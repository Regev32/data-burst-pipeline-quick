import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Activity } from 'lucide-react';

interface PipelineStatusProps {
  isRunning: boolean;
}

export const PipelineStatus = ({ isRunning }: PipelineStatusProps) => {
  const stages = [
    {
      name: 'Data Ingestion',
      status: isRunning ? 'running' : 'idle',
      description: 'Kafka consumer reading from customer-events topic',
      icon: Activity,
    },
    {
      name: 'Stream Processing',
      status: isRunning ? 'running' : 'idle',
      description: 'Spark Structured Streaming job transforming data',
      icon: Activity,
    },
    {
      name: 'Data Storage',
      status: isRunning ? 'running' : 'idle',
      description: 'Elasticsearch indexing processed records',
      icon: Activity,
    },
    {
      name: 'Visualization',
      status: 'ready',
      description: 'Kibana dashboard ready for analysis',
      icon: CheckCircle,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-pipeline-success';
      case 'idle':
        return 'bg-muted';
      case 'ready':
        return 'bg-pipeline-info';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running':
        return 'Running';
      case 'idle':
        return 'Idle';
      case 'ready':
        return 'Ready';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Pipeline Status
        </CardTitle>
        <CardDescription>
          Current state of all pipeline stages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <div key={stage.name} className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(stage.status)}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{stage.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {getStatusText(stage.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              </div>
            </div>
          );
        })}
        
        {isRunning && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>Processing...</span>
            </div>
            <Progress value={75} className="w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};