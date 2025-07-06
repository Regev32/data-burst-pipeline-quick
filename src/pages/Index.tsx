import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Database, Zap, BarChart3, Eye, Play, FileText, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Database,
      title: 'Kafka Ingestion',
      description: 'High-throughput message streaming with Apache Kafka',
      color: 'data-flow-ingestion'
    },
    {
      icon: Zap,
      title: 'Spark Processing',
      description: 'Real-time stream processing and aggregation',
      color: 'data-flow-processing'
    },
    {
      icon: BarChart3,
      title: 'Elasticsearch Storage',
      description: 'Scalable search and analytics data store',
      color: 'data-flow-storage'
    },
    {
      icon: Eye,
      title: 'Kibana Visualization',
      description: 'Interactive dashboards and data exploration',
      color: 'pipeline-info'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-bg to-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-data-flow-ingestion via-data-flow-processing to-data-flow-storage bg-clip-text text-transparent">
              End-to-End Data Pipeline
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete streaming data pipeline with Kafka, Spark, Elasticsearch, and Kibana. 
              Real-time ingestion, processing, and visualization in one unified platform.
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/pipeline')}
              className="bg-gradient-to-r from-data-flow-processing to-data-flow-storage hover:opacity-90"
            >
              <Play className="mr-2 h-5 w-5" />
              Launch Pipeline Dashboard
            </Button>
            <Button size="lg" variant="outline">
              <FileText className="mr-2 h-5 w-5" />
              View Documentation
            </Button>
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    {feature.description}
                  </p>
                </CardContent>
                {index < features.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Quick Start */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quick Start Guide</CardTitle>
            <CardDescription>Get your pipeline running in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-pipeline-info flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold">Setup Infrastructure</h3>
                <p className="text-sm text-muted-foreground">
                  Run <code className="bg-muted px-2 py-1 rounded">./scripts/setup.sh</code> to start all Docker services
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-data-flow-processing flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold">Start Data Flow</h3>
                <p className="text-sm text-muted-foreground">
                  Launch the Kafka producer and Spark streaming job to begin processing
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-data-flow-storage flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold">Monitor & Visualize</h3>
                <p className="text-sm text-muted-foreground">
                  Access the dashboard to monitor pipeline health and view real-time analytics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Technology Stack</CardTitle>
            <CardDescription>Built with industry-standard tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'Apache Kafka',
                'Apache Spark',
                'Elasticsearch',
                'Kibana',
                'Docker',
                'Python',
                'React',
                'TypeScript'
              ].map((tech) => (
                <Badge key={tech} variant="outline" className="justify-center py-2">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
