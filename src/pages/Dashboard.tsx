import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TrafficSimulator from "@/components/dashboard/TrafficSimulator";
import RouteFinder from "@/components/dashboard/RouteFinder";
import SystemDashboard from "@/components/dashboard/SystemDashboard";
import TrafficMapCanvas from "@/components/dashboard/TrafficMapCanvas";
import { useTrafficSimulation } from "@/hooks/useTrafficSimulation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Network, 
  Route, 
  TreeDeciduous, 
  Navigation,
  Hammer,
  Grid3x3,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import type { Edge } from "@/utils/kruskal";
import GraphBuilder from "@/components/GraphBuilder";
import GraphTemplates from "@/components/GraphTemplates";
import GraphVisualization from "@/components/GraphVisualization";
import DijkstraVisualization from "@/components/DijkstraVisualization";
import PrimVisualization from "@/components/PrimVisualization";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

const Dashboard = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [activeTab, setActiveTab] = useState("map");
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [mstEdges, setMstEdges] = useState<Edge[]>([]);
  const [algorithmStatus, setAlgorithmStatus] = useState<{
    name: string;
    step: string;
    progress: number;
    details?: string[];
  } | null>(null);
  
  // Sidebar state
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  const handleEdgesUpdate = useCallback((updatedEdges: Edge[]) => {
    setEdges(updatedEdges);
  }, []);

  const {
    isSimulating,
    isPaused,
    speed,
    trafficMultipliers,
    startSimulation,
    stopSimulation,
    togglePause,
    setSpeed,
    simulateAccident,
    setTrafficLevel,
    clearAccidents,
  } = useTrafficSimulation({
    edges,
    onEdgesUpdate: handleEdgesUpdate,
  });

  // Calculate network health
  const networkHealth = useMemo(() => {
    if (edges.length === 0) return "optimal";
    const congestedCount = edges.filter(e => {
      const multiplier = trafficMultipliers[`${e.from}-${e.to}`] || 1;
      return multiplier > 1.5 || e.traffic === 'high';
    }).length;
    const ratio = congestedCount / edges.length;
    if (ratio > 0.5) return "congested";
    if (ratio > 0.2) return "strained";
    return "optimal";
  }, [edges, trafficMultipliers]);

  const handleToggleSimulation = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  const handleRouteCalculated = (path: string[]) => {
    setHighlightedPath(path);
    setAlgorithmStatus({
      name: "Dijkstra's Algorithm",
      step: "Route found!",
      progress: 100,
      details: [`Path: ${path.join(" → ")}`, `Stops: ${path.length}`]
    });
  };

  return (
    <div className="min-h-screen bg-background city-grid-bg flex flex-col">
      {/* Header */}
      <DashboardHeader 
        isSimulating={isSimulating} 
        networkHealth={networkHealth}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Controls */}
        <aside 
          className={`${leftSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-border bg-card/50 backdrop-blur-sm overflow-hidden flex-shrink-0`}
        >
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {/* Traffic Simulator */}
              <TrafficSimulator
                isSimulating={isSimulating}
                isPaused={isPaused}
                speed={speed}
                edges={edges}
                trafficMultipliers={trafficMultipliers}
                onToggleSimulation={handleToggleSimulation}
                onTogglePause={togglePause}
                onSpeedChange={setSpeed}
                onSimulateAccident={simulateAccident}
                onClearAccidents={clearAccidents}
                onTrafficLevelChange={setTrafficLevel}
                selectedEdge={selectedEdge}
              />

              {/* Route Finder */}
              <RouteFinder
                nodes={nodes}
                edges={edges}
                onRouteCalculated={handleRouteCalculated}
                trafficMultipliers={trafficMultipliers}
              />

              {/* Quick Actions */}
              <Card className="dashboard-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("builder")}
                  >
                    <Hammer className="w-4 h-4 mr-2" />
                    Build Custom Network
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("templates")}
                  >
                    <Grid3x3 className="w-4 h-4 mr-2" />
                    Load Template
                  </Button>
                  <Link to="/concepts" className="block">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      DSA Guide
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </aside>

        {/* Toggle Left Sidebar */}
        <button
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="absolute top-1/2 -translate-y-1/2 z-20 bg-card border border-border rounded-r-lg p-1 hover:bg-muted transition-colors"
          style={{ left: leftSidebarOpen ? '320px' : '0' }}
        >
          {leftSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Center - Main Visualization */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-border px-4 py-2 bg-card/30 backdrop-blur-sm">
              <TabsList className="h-9">
                <TabsTrigger value="map" className="text-xs gap-1.5">
                  <Network className="w-3.5 h-3.5" />
                  Traffic Map
                </TabsTrigger>
                <TabsTrigger value="kruskal" className="text-xs gap-1.5">
                  <Route className="w-3.5 h-3.5" />
                  Kruskal's MST
                </TabsTrigger>
                <TabsTrigger value="dijkstra" className="text-xs gap-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  Dijkstra's Path
                </TabsTrigger>
                <TabsTrigger value="prim" className="text-xs gap-1.5">
                  <TreeDeciduous className="w-3.5 h-3.5" />
                  Prim's MST
                </TabsTrigger>
                <TabsTrigger value="builder" className="text-xs gap-1.5">
                  <Hammer className="w-3.5 h-3.5" />
                  Builder
                </TabsTrigger>
                <TabsTrigger value="templates" className="text-xs gap-1.5">
                  <Grid3x3 className="w-3.5 h-3.5" />
                  Templates
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <TabsContent value="map" className="m-0 h-full">
                <TrafficMapCanvas
                  nodes={nodes}
                  edges={edges}
                  trafficMultipliers={trafficMultipliers}
                  highlightedPath={highlightedPath}
                  mstEdges={mstEdges}
                  selectedEdge={selectedEdge}
                  onEdgeSelect={setSelectedEdge}
                  onNodeSelect={setSelectedNode}
                  currentNode={selectedNode}
                  visitedNodes={new Set()}
                />
              </TabsContent>

              <TabsContent value="kruskal" className="m-0">
                <GraphVisualization nodes={nodes} edges={edges} />
              </TabsContent>

              <TabsContent value="dijkstra" className="m-0">
                <DijkstraVisualization nodes={nodes} edges={edges} />
              </TabsContent>

              <TabsContent value="prim" className="m-0">
                <PrimVisualization nodes={nodes} edges={edges} />
              </TabsContent>

              <TabsContent value="builder" className="m-0">
                <GraphBuilder 
                  nodes={nodes} 
                  edges={edges} 
                  setNodes={setNodes} 
                  setEdges={setEdges} 
                />
              </TabsContent>

              <TabsContent value="templates" className="m-0">
                <GraphTemplates 
                  onLoadTemplate={(templateNodes, templateEdges) => {
                    setNodes(templateNodes);
                    setEdges(templateEdges);
                    setActiveTab("map");
                  }} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </main>

        {/* Toggle Right Sidebar */}
        <button
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          className="absolute top-1/2 -translate-y-1/2 z-20 bg-card border border-border rounded-l-lg p-1 hover:bg-muted transition-colors"
          style={{ right: rightSidebarOpen ? '320px' : '0' }}
        >
          {rightSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Right Sidebar - Metrics & Insights */}
        <aside 
          className={`${rightSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-l border-border bg-card/50 backdrop-blur-sm overflow-hidden flex-shrink-0`}
        >
          <ScrollArea className="h-full">
            <div className="p-4">
              <SystemDashboard
                nodes={nodes}
                edges={edges}
                trafficMultipliers={trafficMultipliers}
                algorithmStatus={algorithmStatus}
              />
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
