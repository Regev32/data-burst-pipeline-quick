import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Database, Zap, BarChart3, Eye } from 'lucide-react';

export const DataFlowDiagram = () => {
  const stages = [
    {
      name: 'Kafka',
      description: 'Message Queue',
      icon: Database,
      color: 'data-flow-ingestion',
    },
    {
      name: 'Spark',
      description: 'Stream Processing',
      icon: Zap,
      color: 'data-flow-processing',
    },
    {
      name: 'Elasticsearch',
      description: 'Data Storage',
      icon: BarChart3,
      color: 'data-flow-storage',
    },
    {
      name: 'Kibana',
      description: 'Visualization',
      icon: Eye,
      color: 'pipeline-info',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Flow Architecture</CardTitle>
        <CardDescription>
          Real-time data processing pipeline components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          {/* Flow Diagram */}
          <div className="flex items-center justify-between">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={stage.name} className="flex items-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-12 rounded-full bg-${stage.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{stage.name}</div>
                      <div className="text-xs text-muted-foreground">{stage.description}</div>
                    </div>
                  </div>
                  {index < stages.length - 1 && (
                    <ArrowRight className="h-6 w-6 text-muted-foreground mx-4" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Data Flow Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Sample Data Flow</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Customer purchase events</div>
                <div>• Aggregated by product category</div>
                <div>• Real-time analytics ready</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Processing Rate</h4>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  ~1k events/sec
                </Badge>
                <Badge variant="outline" className="text-xs">
                  30s windows
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};