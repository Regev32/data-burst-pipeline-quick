# Real-Time Data Pipeline

A complete end-to-end streaming data pipeline built with Apache Kafka, Spark, Elasticsearch, and Kibana. This project demonstrates modern data engineering practices with real-time ingestion, processing, and visualization.

## 🏗️ Architecture

```
[Data Source] → [Kafka] → [Spark Streaming] → [Elasticsearch] → [Kibana Dashboard]
```

### Components

- **Apache Kafka**: Message streaming platform for real-time data ingestion
- **Apache Spark**: Distributed processing engine for stream processing and aggregation
- **Elasticsearch**: Search and analytics engine for data storage
- **Kibana**: Data visualization and exploration platform
- **Docker**: Containerization for easy deployment and scaling

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Python 3.8+ (for data producer)
- 8GB RAM recommended

### 1. Clone and Setup
```bash
git clone <your-repo>
cd data-pipeline
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Start the Pipeline
```bash
# Terminal 1: Start data producer
python scripts/kafka_producer.py

# Terminal 2: Submit Spark streaming job
docker exec spark-master spark-submit \
    --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0,org.elasticsearch:elasticsearch-spark-30_2.12:8.11.0 \
    /opt/spark-scripts/spark_streaming_job.py
```

### 3. Access Services
- **Pipeline Dashboard**: http://localhost:3000/pipeline
- **Kibana**: http://localhost:5601
- **Spark UI**: http://localhost:8080
- **Elasticsearch**: http://localhost:9200

## 📊 Data Flow

### Sample Data Structure
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "customer_id": "cust_001",
  "event_type": "purchase",
  "product_category": "Electronics",
  "product_id": "prod_laptop_001",
  "amount": 999.99,
  "quantity": 1,
  "location": "New York"
}
```

### Processing Logic
1. **Ingestion**: Customer events published to Kafka topic `customer-events`
2. **Processing**: Spark Structured Streaming performs:
   - Real-time aggregations by product category
   - Customer activity summaries
   - Data quality validation
3. **Storage**: Processed data indexed in Elasticsearch
4. **Visualization**: Real-time dashboards in Kibana and custom React UI

## 🔧 Configuration

### Docker Services
- **Zookeeper**: Port 2181
- **Kafka**: Port 9092
- **Spark Master**: Port 8080
- **Elasticsearch**: Port 9200
- **Kibana**: Port 5601

### Kafka Topics
- `customer-events`: Raw customer interaction events

### Elasticsearch Indices
- `pipeline-metrics`: Processed aggregations and analytics

## 📈 Monitoring

### Key Metrics
- **Throughput**: Messages processed per second
- **Latency**: End-to-end processing time
- **Error Rate**: Failed message percentage
- **Resource Usage**: CPU, Memory, Disk utilization

### Dashboard Features
- Real-time pipeline status
- Data flow visualization
- Processing metrics charts
- System logs viewer
- Configuration management

## 🛠️ Development

### Adding New Event Types
1. Update the schema in `spark_streaming_job.py`
2. Modify processing logic for new event types
3. Add corresponding visualizations

### Scaling
- Increase Kafka partitions for higher throughput
- Add more Spark workers for parallel processing
- Scale Elasticsearch cluster for storage needs

### Customization
- Modify window sizes for different aggregation periods
- Add new metrics and KPIs
- Integrate with external data sources

## 🐛 Troubleshooting

### Common Issues

**Services not starting**
```bash
docker-compose logs [service-name]
docker-compose restart
```

**Kafka connection issues**
```bash
# Check if topic exists
docker exec kafka kafka-topics --list --bootstrap-server localhost:9092

# Create topic manually
docker exec kafka kafka-topics --create --topic customer-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

**Spark job failures**
```bash
# Check Spark logs
docker logs spark-master
docker logs spark-worker

# Monitor Spark UI at http://localhost:8080
```

## 📚 Learning Resources

- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Apache Spark Structured Streaming](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html)
- [Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Kibana User Guide](https://www.elastic.co/guide/en/kibana/current/index.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for learning modern data engineering**