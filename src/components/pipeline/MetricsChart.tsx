import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from 'lucide-react';

interface MetricsChartProps {
  processed: number;
  errors: number;
}

export const MetricsChart = ({ processed, errors }: MetricsChartProps) => {
  const [throughput, setThroughput] = useState(0);

  useEffect(() => {
    // Simulate throughput calculation
    setThroughput(Math.floor(Math.random() * 100) + 50);
  }, [processed]);

  const sampleCategories = [
    { name: 'Electronics', count: 45, revenue: 12500, growth: 12.5 },
    { name: 'Clothing', count: 32, revenue: 8900, growth: -2.1 },
    { name: 'Books', count: 28, revenue: 3400, growth: 8.3 },
    { name: 'Home & Garden', count: 19, revenue: 6700, growth: 15.7 },
    { name: 'Sports', count: 15, revenue: 4200, growth: 5.2 },
  ];

  const totalRevenue = sampleCategories.reduce((sum, cat) => sum + cat.revenue, 0);
  const totalOrders = sampleCategories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{throughput}/sec</div>
            <p className="text-xs text-muted-foreground">Messages processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 5 minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Purchase events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((errors / Math.max(processed, 1)) * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Processing errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Product Category Performance</CardTitle>
          <CardDescription>Real-time sales analytics by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{category.name}</span>
                    <Badge variant={category.growth > 0 ? "default" : "secondary"}>
                      {category.growth > 0 ? '+' : ''}{category.growth}%
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${category.revenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{category.count} orders</div>
                  </div>
                </div>
                <Progress 
                  value={(category.revenue / totalRevenue) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Processing Pipeline</CardTitle>
            <CardDescription>Data flow statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Messages Ingested</span>
              <span className="font-bold">{processed}</span>
            </div>
            <Progress value={100} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span>Successfully Processed</span>
              <span className="font-bold">{processed - errors}</span>
            </div>
            <Progress value={((processed - errors) / Math.max(processed, 1)) * 100} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span>Indexed in Elasticsearch</span>
              <span className="font-bold">{Math.floor((processed - errors) * 0.98)}</span>
            </div>
            <Progress value={98} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Infrastructure monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Kafka Lag</span>
                <Badge variant="outline">~50ms</Badge>
              </div>
              <div className="flex justify-between">
                <span>Spark Memory</span>
                <Badge variant="outline">67%</Badge>
              </div>
              <div className="flex justify-between">
                <span>ES Cluster</span>
                <Badge variant="outline" className="bg-pipeline-success text-white">Healthy</Badge>
              </div>
              <div className="flex justify-between">
                <span>Kibana Status</span>
                <Badge variant="outline" className="bg-pipeline-success text-white">Running</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};