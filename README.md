# Real-Time Data Pipeline

🚀 **Complete end-to-end streaming data pipeline** built with modern data engineering tools. This project demonstrates real-time data ingestion, processing, and visualization using Apache Kafka, Spark, Elasticsearch, and Kibana.

## ✨ What You Get

- **🎯 5-Minute Setup**: Complete pipeline running in minutes
- **📊 Real-Time Dashboard**: Beautiful React dashboard with live metrics  
- **🔄 End-to-End Data Flow**: Kafka → Spark → Elasticsearch → Kibana
- **🐳 Dockerized Environment**: Everything containerized for easy deployment
- **📈 Live Analytics**: Real-time customer event processing and visualization

## 🏗️ Architecture

```
[Customer Events] → [Kafka] → [Spark Streaming] → [Elasticsearch] → [Dashboard/Kibana]
```

### Tech Stack
- **Apache Kafka**: Real-time data streaming
- **Apache Spark**: Stream processing and aggregation  
- **Elasticsearch**: Search and analytics storage
- **Kibana**: Data visualization platform
- **React + TypeScript**: Custom dashboard
- **Docker**: Containerized deployment

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.8+ 
- Node.js (for dashboard)
- 8GB RAM recommended

### Option 1: One-Command Demo
```bash
make demo
```

### Option 2: Step by Step
```bash
# 1. Setup infrastructure
make setup

# 2. Start services  
make start

# 3. Start data producer (new terminal)
make producer

# 4. Submit Spark job (new terminal)
make spark

# 5. View dashboard
make dashboard
```

## 📊 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Pipeline Dashboard** | http://localhost:3000/pipeline | Custom React dashboard |
| **Kibana** | http://localhost:5601 | Data visualization |  
| **Spark UI** | http://localhost:8080 | Spark job monitoring |
| **Elasticsearch** | http://localhost:9200 | Data storage API |

## 📈 Sample Data Flow

The pipeline processes customer purchase events:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "customer_id": "cust_001", 
  "event_type": "purchase",
  "product_category": "Electronics",
  "amount": 999.99,
  "location": "New York"
}
```

**Processing includes:**
- Real-time aggregations by product category
- Customer activity summaries  
- Geographic analysis
- Revenue calculations

## 🎯 Key Features

### Real-Time Processing
- **Throughput**: ~1000 events/second
- **Latency**: < 30 seconds end-to-end
- **Windows**: 30-second tumbling windows
- **Scalability**: Horizontal scaling ready

### Monitoring & Observability  
- Pipeline health status
- Processing metrics
- Error tracking
- System logs viewer
- Performance dashboards

### Data Quality
- Schema validation
- Duplicate detection  
- Error handling
- Data lineage tracking

## 🛠️ Development

### Adding New Event Types
1. Update schema in `spark_streaming_job.py`
2. Add processing logic
3. Create visualizations

### Scaling the Pipeline
```bash
# Scale Kafka partitions
docker exec kafka kafka-topics --alter --topic customer-events --partitions 6

# Add Spark workers
docker-compose up --scale spark-worker=3

# Scale Elasticsearch 
# Update docker-compose.yml with cluster config
```

### Custom Metrics
```python
# Add to Spark job
custom_metrics = df.groupBy("custom_field").agg(
    count("*").alias("count"),
    avg("amount").alias("avg_amount")
)
```

## 🔧 Troubleshooting

### Quick Health Check
```bash
make status
```

### Common Issues

**Services not starting:**
```bash
docker-compose logs [service-name]
make clean && make start
```

**No data flowing:**
```bash
# Check Kafka topic
docker exec kafka kafka-topics --list --bootstrap-server localhost:9092

# Verify producer
docker exec kafka kafka-console-consumer --topic customer-events --bootstrap-server localhost:9092
```

**Spark job failures:**
```bash
# Check Spark logs
docker logs spark-master
# Monitor at http://localhost:8080
```

## 📚 Learning Path

### Beginner
1. Run the demo
2. Explore the dashboard
3. Modify sample data
4. Create Kibana visualizations

### Intermediate  
1. Add new event types
2. Create custom aggregations
3. Build new dashboard components
4. Implement data quality checks

### Advanced
1. Multi-topic processing
2. Complex event processing 
3. ML model integration
4. Production deployment patterns

## 🎓 Educational Value

This project teaches:
- **Stream Processing**: Real-time data handling patterns
- **Data Engineering**: ETL/ELT pipeline design
- **Microservices**: Containerized architecture  
- **Observability**: Monitoring and alerting
- **Scalability**: Horizontal scaling techniques

## 📝 Files Structure

```
├── docker-compose.yml          # Infrastructure definition
├── data/                       # Sample datasets
├── scripts/                    # Processing scripts
│   ├── kafka_producer.py       # Data ingestion
│   ├── spark_streaming_job.py  # Stream processing  
│   └── setup.sh               # Environment setup
├── dashboards/                 # Visualization configs
├── src/                        # React dashboard
└── Makefile                    # Automation commands
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**🎯 Perfect for:** Data engineering portfolios, learning modern data stack, job interviews, hackathons

**⭐ Star this repo** if it helps you learn data engineering!
