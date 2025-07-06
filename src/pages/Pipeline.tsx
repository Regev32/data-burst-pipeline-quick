import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Database, Zap, BarChart3, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { PipelineStatus } from '@/components/pipeline/PipelineStatus';
import { DataFlowDiagram } from '@/components/pipeline/DataFlowDiagram';
import { MetricsChart } from '@/components/pipeline/MetricsChart';
import { LogsViewer } from '@/components/pipeline/LogsViewer';

const Pipeline = () => {
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [errors, setErrors] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pipelineRunning) {
      interval = setInterval(() => {
        setProcessed(prev => prev + Math.floor(Math.random() * 10) + 1);
        if (Math.random() < 0.1) {
          setErrors(prev => prev + 1);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [pipelineRunning]);

  const handleStartPipeline = () => {
    setPipelineRunning(true);
    setProcessed(0);
    setErrors(0);
  };

  const handleStopPipeline = () => {
    setPipelineRunning(false);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-data-flow-ingestion via-data-flow-processing to-data-flow-storage bg-clip-text text-transparent">
            Real-Time Data Pipeline
          </h1>
          <p className="text-lg text-muted-foreground">
            End-to-end streaming data processing with Kafka → Spark → Elasticsearch
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={handleStartPipeline} 
              disabled={pipelineRunning}
              className="bg-pipeline-success hover:bg-pipeline-success/90"
            >
              <Zap className="mr-2 h-4 w-4" />
              Start Pipeline
            </Button>
            <Button 
              onClick={handleStopPipeline} 
              disabled={!pipelineRunning}
              variant="outline"
            >
              Stop Pipeline
            </Button>
          </div>
        </div>

        {/* Pipeline Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-data-flow-ingestion">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kafka Ingestion</CardTitle>
              <Database className="h-4 w-4 text-data-flow-ingestion" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processed}</div>
              <p className="text-xs text-muted-foreground">Messages ingested</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-data-flow-processing">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spark Processing</CardTitle>
              <Zap className="h-4 w-4 text-data-flow-processing" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(processed * 0.95)}</div>
              <p className="text-xs text-muted-foreground">Records processed</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-data-flow-storage">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Elasticsearch</CardTitle>
              <BarChart3 className="h-4 w-4 text-data-flow-storage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(processed * 0.92)}</div>
              <p className="text-xs text-muted-foreground">Documents indexed</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pipeline-error">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
              <AlertCircle className="h-4 w-4 text-pipeline-error" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pipeline-error">{errors}</div>
              <p className="text-xs text-muted-foreground">Processing errors</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PipelineStatus isRunning={pipelineRunning} />
              <DataFlowDiagram />
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <MetricsChart processed={processed} errors={errors} />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <LogsViewer isRunning={pipelineRunning} />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Configuration</CardTitle>
                <CardDescription>Docker services and data flow settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Services</h4>
                    <div className="space-y-1">
                      <Badge variant="outline">Zookeeper: 2181</Badge>
                      <Badge variant="outline">Kafka: 9092</Badge>
                      <Badge variant="outline">Spark: 8080</Badge>
                      <Badge variant="outline">Elasticsearch: 9200</Badge>
                      <Badge variant="outline">Kibana: 5601</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Data Flow</h4>
                    <div className="space-y-1">
                      <Badge variant="outline">Topic: customer-events</Badge>
                      <Badge variant="outline">Batch Size: 1000</Badge>
                      <Badge variant="outline">Window: 30s</Badge>
                      <Badge variant="outline">Index: pipeline-metrics</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Pipeline;