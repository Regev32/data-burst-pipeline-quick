import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, Terminal } from 'lucide-react';

interface LogsViewerProps {
  isRunning: boolean;
}

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';
  component: string;
  message: string;
}

export const LogsViewer = ({ isRunning }: LogsViewerProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      component: 'Docker',
      message: 'All services started successfully'
    },
    {
      timestamp: new Date(Date.now() - 5000).toISOString(),
      level: 'INFO',
      component: 'Kafka',
      message: 'Created topic: customer-events with 3 partitions'
    },
    {
      timestamp: new Date(Date.now() - 10000).toISOString(),
      level: 'INFO',
      component: 'Elasticsearch',
      message: 'Index pipeline-metrics created with 1 shard'
    },
  ]);

  const sampleMessages = [
    'Processing batch of 100 records',
    'Kafka consumer lag: 23ms',
    'Elasticsearch bulk insert completed',
    'Spark job completed successfully',
    'Window aggregation: 1,234 events processed',
    'Memory usage: 78% of allocated heap',
    'Network I/O: 45MB/s',
    'Data quality check passed',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        const newLog: LogEntry = {
          timestamp: new Date().toISOString(),
          level: Math.random() < 0.1 ? 'ERROR' : Math.random() < 0.2 ? 'WARN' : 'INFO',
          component: ['Kafka', 'Spark', 'Elasticsearch', 'Kibana'][Math.floor(Math.random() * 4)],
          message: sampleMessages[Math.floor(Math.random() * sampleMessages.length)]
        };

        setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
        return <AlertCircle className="h-4 w-4 text-pipeline-error" />;
      case 'WARN':
        return <AlertCircle className="h-4 w-4 text-pipeline-warning" />;
      case 'INFO':
        return <CheckCircle className="h-4 w-4 text-pipeline-success" />;
      default:
        return <Info className="h-4 w-4 text-pipeline-info" />;
    }
  };

  const getLogBadgeVariant = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'destructive';
      case 'WARN':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          System Logs
        </CardTitle>
        <CardDescription>
          Real-time pipeline logs and system messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full rounded-md border p-4">
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50">
                {getLogIcon(log.level)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getLogBadgeVariant(log.level)} className="text-xs">
                      {log.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {log.component}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm font-mono">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Total logs: {logs.length}</span>
          <span>Status: {isRunning ? 'Live' : 'Stopped'}</span>
        </div>
      </CardContent>
    </Card>
  );
};