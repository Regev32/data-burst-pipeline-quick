#!/usr/bin/env python3

import json
import time
import random
from datetime import datetime, timedelta
from kafka import KafkaProducer
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Kafka configuration
KAFKA_BOOTSTRAP_SERVERS = ['localhost:9092']
TOPIC_NAME = 'customer-events'

# Sample data templates
PRODUCT_CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports']
EVENT_TYPES = ['purchase', 'view', 'add_to_cart', 'remove_from_cart']
LOCATIONS = ['New York', 'California', 'Texas', 'Florida', 'Illinois', 'Washington', 'Oregon', 'Nevada', 'Colorado', 'Arizona']

def generate_customer_event():
    """Generate a realistic customer event"""
    return {
        'timestamp': datetime.now().isoformat() + 'Z',
        'customer_id': f'cust_{random.randint(1, 1000):03d}',
        'event_type': random.choice(EVENT_TYPES),
        'product_category': random.choice(PRODUCT_CATEGORIES),
        'product_id': f'prod_{random.randint(1, 9999):04d}',
        'amount': round(random.uniform(9.99, 999.99), 2) if random.choice(EVENT_TYPES) == 'purchase' else 0,
        'quantity': random.randint(1, 5) if random.choice(EVENT_TYPES) in ['purchase', 'add_to_cart'] else 0,
        'location': random.choice(LOCATIONS)
    }

def load_sample_data():
    """Load sample data from JSON file"""
    try:
        with open('/opt/spark-data/sample-customer-events.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.warning("Sample data file not found, generating random data")
        return []

def create_producer():
    """Create Kafka producer with proper configuration"""
    return KafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_serializer=lambda v: json.dumps(v).encode('utf-8'),
        key_serializer=lambda k: str(k).encode('utf-8') if k else None,
        retry_backoff_ms=1000,
        request_timeout_ms=30000,
        acks='all'
    )

def main():
    """Main function to produce messages to Kafka"""
    try:
        logger.info("Starting Kafka Producer...")
        producer = create_producer()
        
        # Load sample data
        sample_events = load_sample_data()
        
        # Send sample data first
        if sample_events:
            logger.info(f"Sending {len(sample_events)} sample events...")
            for event in sample_events:
                producer.send(
                    TOPIC_NAME,
                    key=event['customer_id'],
                    value=event
                )
                time.sleep(0.1)  # Small delay between messages
        
        # Then generate and send real-time events
        logger.info("Starting real-time event generation...")
        event_count = 0
        
        while True:
            # Generate and send event
            event = generate_customer_event()
            producer.send(
                TOPIC_NAME,
                key=event['customer_id'],
                value=event
            )
            
            event_count += 1
            if event_count % 10 == 0:
                logger.info(f"Sent {event_count} events")
            
            # Random delay between 1-5 seconds
            time.sleep(random.uniform(1, 5))
            
    except KeyboardInterrupt:
        logger.info("Producer stopped by user")
    except Exception as e:
        logger.error(f"Error in producer: {e}")
    finally:
        producer.close()
        logger.info("Producer closed")

if __name__ == "__main__":
    main()