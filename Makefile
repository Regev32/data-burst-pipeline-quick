# Data Pipeline Makefile
.PHONY: help setup start stop clean logs producer spark dashboard

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Setup the pipeline infrastructure
	@echo "🚀 Setting up Data Pipeline..."
	@chmod +x scripts/setup.sh
	@./scripts/setup.sh

start: ## Start all Docker services
	@echo "🐳 Starting Docker services..."
	@docker-compose up -d
	@echo "⏳ Waiting for services to be ready..."
	@sleep 30
	@echo "✅ Services started!"

stop: ## Stop all Docker services
	@echo "🛑 Stopping Docker services..."
	@docker-compose down

clean: ## Clean up containers and volumes
	@echo "🧹 Cleaning up..."
	@docker-compose down -v
	@docker system prune -f

logs: ## Show logs from all services
	@docker-compose logs -f

producer: ## Start the Kafka producer
	@echo "📡 Starting Kafka producer..."
	@python scripts/kafka_producer.py

spark: ## Submit Spark streaming job
	@echo "⚡ Submitting Spark job..."
	@docker exec spark-master spark-submit \
		--packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0,org.elasticsearch:elasticsearch-spark-30_2.12:8.11.0 \
		/opt/spark-scripts/spark_streaming_job.py

dashboard: ## Open the pipeline dashboard
	@echo "📊 Opening dashboard..."
	@open http://localhost:3000/pipeline || xdg-open http://localhost:3000/pipeline

demo: ## Run complete demo
	@echo "🎬 Starting complete pipeline demo..."
	@make setup
	@make start
	@echo "⏳ Waiting for services to stabilize..."
	@sleep 45
	@echo "📊 Visit http://localhost:3000/pipeline to see the dashboard"
	@echo "🔍 Visit http://localhost:5601 for Kibana"
	@echo "⚡ Visit http://localhost:8080 for Spark UI"
	@echo ""
	@echo "🎯 Next steps:"
	@echo "1. Run 'make producer' in a new terminal"
	@echo "2. Run 'make spark' in another terminal"
	@echo "3. Watch the real-time data flow!"

status: ## Check service status
	@echo "📊 Service Status:"
	@echo "==================="
	@docker-compose ps
	@echo ""
	@echo "🔍 Health Checks:"
	@echo "=================="
	@echo -n "Kafka: "
	@curl -s http://localhost:9092 >/dev/null 2>&1 && echo "✅ Running" || echo "❌ Down"
	@echo -n "Elasticsearch: "
	@curl -s http://localhost:9200/_cluster/health >/dev/null 2>&1 && echo "✅ Running" || echo "❌ Down"
	@echo -n "Kibana: "
	@curl -s http://localhost:5601/api/status >/dev/null 2>&1 && echo "✅ Running" || echo "❌ Down"
	@echo -n "Spark: "
	@curl -s http://localhost:8080 >/dev/null 2>&1 && echo "✅ Running" || echo "❌ Down"