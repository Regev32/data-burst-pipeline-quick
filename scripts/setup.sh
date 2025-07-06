#!/bin/bash

# Data Pipeline Setup Script
echo "🚀 Setting up Data Pipeline Infrastructure..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data
mkdir -p scripts
mkdir -p dashboards

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Check Kafka
echo "Checking Kafka..."
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list

# Check Elasticsearch
echo "Checking Elasticsearch..."
curl -s http://localhost:9200/_cluster/health || echo "Elasticsearch not ready yet"

# Create Kafka topic
echo "📝 Creating Kafka topic..."
docker exec kafka kafka-topics --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 3 \
    --topic customer-events || echo "Topic might already exist"

# Install Python dependencies for producer
echo "📦 Installing Python dependencies..."
pip install kafka-python || echo "Please install kafka-python manually: pip install kafka-python"

echo "✅ Setup complete! Services running on:"
echo "   - Kafka: localhost:9092"
echo "   - Elasticsearch: localhost:9200"
echo "   - Kibana: localhost:5601"
echo "   - Spark Master: localhost:8080"

echo ""
echo "🎯 Next steps:"
echo "1. Run the producer: python scripts/kafka_producer.py"
echo "2. Submit Spark job: docker exec spark-master spark-submit --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0,org.elasticsearch:elasticsearch-spark-30_2.12:8.11.0 /opt/spark-scripts/spark_streaming_job.py"
echo "3. Open Kibana: http://localhost:5601"
echo "4. Create index pattern: pipeline-metrics*"