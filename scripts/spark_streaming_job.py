#!/usr/bin/env python3

from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Elasticsearch configuration
ES_HOST = "elasticsearch"
ES_PORT = "9200"
ES_INDEX = "pipeline-metrics"

def create_spark_session():
    """Create Spark session with Kafka and Elasticsearch dependencies"""
    return SparkSession.builder \
        .appName("CustomerEventStreamProcessor") \
        .config("spark.sql.streaming.checkpointLocation", "/tmp/checkpoint") \
        .config("spark.sql.streaming.forceDeleteTempCheckpointLocation", "true") \
        .config("spark.jars.packages", 
                "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0,"
                "org.elasticsearch:elasticsearch-spark-30_2.12:8.11.0") \
        .getOrCreate()

def define_schema():
    """Define schema for customer events"""
    return StructType([
        StructField("timestamp", StringType(), True),
        StructField("customer_id", StringType(), True),
        StructField("event_type", StringType(), True),
        StructField("product_category", StringType(), True),
        StructField("product_id", StringType(), True),
        StructField("amount", DoubleType(), True),
        StructField("quantity", IntegerType(), True),
        StructField("location", StringType(), True)
    ])

def process_stream(spark):
    """Main stream processing logic"""
    
    # Read from Kafka
    df = spark \
        .readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", "kafka:29092") \
        .option("subscribe", "customer-events") \
        .option("startingOffsets", "latest") \
        .load()
    
    # Parse JSON data
    schema = define_schema()
    parsed_df = df.select(
        from_json(col("value").cast("string"), schema).alias("data"),
        col("timestamp").alias("kafka_timestamp")
    ).select("data.*", "kafka_timestamp")
    
    # Add processing timestamp
    processed_df = parsed_df.withColumn("processed_at", current_timestamp())
    
    # Convert timestamp string to timestamp type
    processed_df = processed_df.withColumn(
        "event_timestamp", 
        to_timestamp(col("timestamp"), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    )
    
    # Create aggregations
    # 1. Purchases by category (tumbling window)
    category_purchases = processed_df \
        .filter(col("event_type") == "purchase") \
        .withWatermark("event_timestamp", "30 seconds") \
        .groupBy(
            window(col("event_timestamp"), "30 seconds"),
            col("product_category")
        ) \
        .agg(
            count("*").alias("purchase_count"),
            sum("amount").alias("total_revenue"),
            avg("amount").alias("avg_order_value")
        ) \
        .select(
            col("window.start").alias("window_start"),
            col("window.end").alias("window_end"),
            col("product_category"),
            col("purchase_count"),
            col("total_revenue"),
            col("avg_order_value"),
            current_timestamp().alias("processed_at")
        )
    
    # 2. Customer activity summary
    customer_activity = processed_df \
        .withWatermark("event_timestamp", "30 seconds") \
        .groupBy(
            window(col("event_timestamp"), "60 seconds"),
            col("customer_id"),
            col("location")
        ) \
        .agg(
            count("*").alias("event_count"),
            sum(when(col("event_type") == "purchase", 1).otherwise(0)).alias("purchase_count"),
            sum("amount").alias("total_spent")
        ) \
        .select(
            col("window.start").alias("window_start"),
            col("window.end").alias("window_end"),
            col("customer_id"),
            col("location"),
            col("event_count"),
            col("purchase_count"),
            col("total_spent"),
            current_timestamp().alias("processed_at")
        )
    
    return category_purchases, customer_activity, processed_df

def write_to_elasticsearch(df, output_mode="append"):
    """Write DataFrame to Elasticsearch"""
    return df.writeStream \
        .outputMode(output_mode) \
        .format("org.elasticsearch.spark.sql") \
        .option("es.resource", f"{ES_INDEX}/_doc") \
        .option("es.nodes", ES_HOST) \
        .option("es.port", ES_PORT) \
        .option("es.nodes.wan.only", "true") \
        .option("checkpointLocation", f"/tmp/checkpoint-{ES_INDEX}") \
        .trigger(processingTime='10 seconds') \
        .start()

def write_to_console(df, output_mode="append"):
    """Write DataFrame to console for debugging"""
    return df.writeStream \
        .outputMode(output_mode) \
        .format("console") \
        .option("truncate", False) \
        .trigger(processingTime='15 seconds') \
        .start()

def main():
    """Main function"""
    try:
        logger.info("Starting Spark Streaming Job...")
        
        # Create Spark session
        spark = create_spark_session()
        spark.sparkContext.setLogLevel("WARN")
        
        # Process the stream
        category_purchases, customer_activity, raw_events = process_stream(spark)
        
        # Start streaming queries
        queries = []
        
        # Write category purchases to Elasticsearch
        query1 = write_to_elasticsearch(
            category_purchases.withColumn("doc_type", lit("category_purchase"))
        )
        queries.append(query1)
        
        # Write customer activity to Elasticsearch  
        query2 = write_to_elasticsearch(
            customer_activity.withColumn("doc_type", lit("customer_activity"))
        )
        queries.append(query2)
        
        # Write raw events to Elasticsearch
        query3 = write_to_elasticsearch(
            raw_events.withColumn("doc_type", lit("raw_event"))
        )
        queries.append(query3)
        
        # Also write to console for debugging
        console_query = write_to_console(category_purchases, "complete")
        queries.append(console_query)
        
        logger.info("Streaming queries started. Waiting for termination...")
        
        # Wait for all queries to finish
        for query in queries:
            query.awaitTermination()
            
    except Exception as e:
        logger.error(f"Error in streaming job: {e}")
        raise
    finally:
        spark.stop()
        logger.info("Spark session stopped")

if __name__ == "__main__":
    main()