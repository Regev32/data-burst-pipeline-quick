# Kibana Dashboard Setup

This guide walks you through setting up Kibana dashboards for the data pipeline.

## 🎯 Index Pattern Setup

1. Open Kibana at http://localhost:5601
2. Go to **Stack Management** → **Index Patterns**
3. Click **Create index pattern**
4. Enter `pipeline-metrics*` as the index pattern
5. Select `@timestamp` or `processed_at` as the time field
6. Click **Create index pattern**

## 📊 Dashboard Creation

### 1. Purchase Analytics Dashboard

**Visualizations to Create:**

#### A. Purchase Count by Category (Bar Chart)
- **Data**: pipeline-metrics*
- **Metrics**: Count
- **Buckets**: Terms aggregation on `product_category.keyword`
- **Time Range**: Last 15 minutes

#### B. Revenue Over Time (Line Chart)
- **Data**: pipeline-metrics*
- **Metrics**: Sum of `total_revenue`
- **Buckets**: Date histogram on `window_start` (30 second intervals)

#### C. Top Customers (Data Table)
- **Data**: pipeline-metrics*
- **Metrics**: Sum of `total_spent`, Count
- **Buckets**: Terms aggregation on `customer_id.keyword`
- **Limit**: Top 10

#### D. Geographic Distribution (Map)
- **Data**: pipeline-metrics*
- **Metrics**: Count
- **Buckets**: Terms aggregation on `location.keyword`

### 2. System Monitoring Dashboard

#### A. Processing Throughput (Metric)
- **Data**: pipeline-metrics*
- **Metrics**: Count per minute
- **Filter**: `doc_type: "raw_event"`

#### B. Error Rate (Gauge)
- **Data**: pipeline-metrics*
- **Metrics**: Percentage of error events
- **Threshold**: Warning > 5%, Critical > 10%

#### C. Event Types Distribution (Pie Chart)
- **Data**: pipeline-metrics*
- **Buckets**: Terms aggregation on `event_type.keyword`

## 🔍 Useful Queries

### Search for Purchase Events
```
doc_type:"raw_event" AND event_type:"purchase"
```

### High-Value Transactions
```
amount:>500
```

### Recent Activity (Last 5 minutes)
```
processed_at:[now-5m TO now]
```

### Error Events
```
doc_type:"category_purchase" AND purchase_count:0
```

## 📈 Advanced Features

### Alerts
Set up Watcher alerts for:
- Processing delays > 30 seconds
- Error rate > 10%
- No data received for > 2 minutes

### Machine Learning
Use Kibana ML to detect:
- Anomalous purchase patterns
- Unusual customer behavior
- System performance issues

## 🎨 Dashboard Best Practices

1. **Time Ranges**: Use relative time ranges (Last 15m, Last 1h)
2. **Refresh**: Set auto-refresh to 30s or 1m for real-time monitoring
3. **Filters**: Add global filters for easy data exploration
4. **Colors**: Use consistent color schemes across visualizations
5. **Layout**: Arrange visualizations logically (metrics at top, details below)

## 🔧 Troubleshooting

**No Data Visible**
- Check if Elasticsearch contains data: `curl localhost:9200/pipeline-metrics/_search`
- Verify index pattern matches your data
- Ensure time range includes your data

**Slow Performance**
- Reduce time range for queries
- Use filters to limit data scope
- Consider data sampling for large datasets

**Missing Fields**
- Refresh index pattern to detect new fields
- Check field mapping in Elasticsearch
- Verify data structure in your pipeline