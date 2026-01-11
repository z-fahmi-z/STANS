import { motion } from "framer-motion";
import { 
  Boxes, 
  Database, 
  Cpu, 
  Eye, 
  Map, 
  ArrowRight,
  Network,
  GitMerge,
  Navigation,
  TreeDeciduous
} from "lucide-react";

interface ArchitectureBoxProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  delay: number;
  color: "primary" | "secondary" | "accent";
  x: number;
  y: number;
  width?: number;
}

const ArchitectureBox = ({ title, icon, items, delay, color, x, y, width = 160 }: ArchitectureBoxProps) => {
  const colorClasses = {
    primary: "border-primary/50 bg-primary/5",
    secondary: "border-secondary/50 bg-secondary/5", 
    accent: "border-accent/50 bg-accent/5",
  };

  const iconColors = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
  };

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      <foreignObject x={x} y={y} width={width} height={items.length * 22 + 50}>
        <div className={`h-full rounded-lg border-2 ${colorClasses[color]} backdrop-blur-sm p-3`}>
          <div className={`flex items-center gap-2 mb-2 ${iconColors[color]}`}>
            {icon}
            <span className="font-semibold text-sm text-foreground">{title}</span>
          </div>
          <ul className="space-y-1">
            {items.map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full bg-${color}`} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </foreignObject>
    </motion.g>
  );
};

// Animated arrow component
const AnimatedArrow = ({ 
  x1, y1, x2, y2, delay 
}: { x1: number; y1: number; x2: number; y2: number; delay: number }) => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.8, ease: "easeInOut" }}
      />
      {/* Animated dot along the arrow */}
      <motion.circle
        r={4}
        fill="hsl(var(--primary))"
        initial={{ cx: x1, cy: y1, opacity: 0 }}
        animate={{ 
          cx: [x1, x2], 
          cy: [y1, y2],
          opacity: [0, 1, 1, 0]
        }}
        transition={{ 
          delay: delay + 0.5, 
          duration: 2, 
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {/* Arrowhead */}
      <motion.polygon
        points={`${x2},${y2} ${x2 - 8},${y2 - 4} ${x2 - 8},${y2 + 4}`}
        fill="hsl(var(--primary))"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5, duration: 0.3 }}
        style={{ transform: `rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI}deg)`, transformOrigin: `${x2}px ${y2}px` }}
      />
    </motion.g>
  );
};

// Animated curved arrow
const CurvedArrow = ({ 
  startX, startY, endX, endY, delay, curveDirection = "down" 
}: { startX: number; startY: number; endX: number; endY: number; delay: number; curveDirection?: "down" | "up" }) => {
  const midX = (startX + endX) / 2;
  const curveOffset = curveDirection === "down" ? 40 : -40;
  const midY = Math.max(startY, endY) + curveOffset;
  
  const pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <motion.path
        d={pathD}
        fill="none"
        stroke="hsl(var(--secondary))"
        strokeWidth={2}
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.8, ease: "easeInOut" }}
      />
      {/* Animated dot */}
      <motion.circle
        r={4}
        fill="hsl(var(--secondary))"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5, duration: 0.3 }}
      >
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={pathD}
        />
      </motion.circle>
    </motion.g>
  );
};

const ArchitectureDiagram = () => {
  return (
    <div className="w-full overflow-x-auto">
      <svg 
        viewBox="0 0 900 480" 
        className="w-full min-w-[700px] h-auto"
        style={{ minHeight: "400px" }}
      >
        {/* Background grid */}
        <defs>
          <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arch-grid)" rx="8" />

        {/* Title */}
        <motion.text
          x="450"
          y="35"
          textAnchor="middle"
          className="text-lg font-bold fill-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          STANS Architecture
        </motion.text>

        {/* Main border */}
        <motion.rect
          x="20"
          y="50"
          width="860"
          height="410"
          rx="12"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* INPUT LAYER */}
        <ArchitectureBox
          title="GraphBuilder"
          icon={<Boxes className="w-4 h-4" />}
          items={["Add Nodes", "Add Edges", "Set Weights", "Traffic Levels"]}
          delay={0.2}
          color="primary"
          x={40}
          y={80}
          width={150}
        />

        <ArchitectureBox
          title="Templates"
          icon={<Map className="w-4 h-4" />}
          items={["Pakistan Map", "City Networks", "Custom Graphs"]}
          delay={0.4}
          color="primary"
          x={40}
          y={220}
          width={150}
        />

        {/* DATA LAYER */}
        <ArchitectureBox
          title="Graph Data"
          icon={<Database className="w-4 h-4" />}
          items={["Nodes[]", "Edges[]", "Traffic State", "Blocked Roads"]}
          delay={0.6}
          color="secondary"
          x={260}
          y={140}
          width={150}
        />

        {/* SHARED STATE */}
        <ArchitectureBox
          title="Shared State"
          icon={<Network className="w-4 h-4" />}
          items={["React State", "Real-time Sync", "Event Handlers"]}
          delay={0.8}
          color="secondary"
          x={260}
          y={290}
          width={150}
        />

        {/* ALGORITHM ENGINE */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <foreignObject x={480} y={80} width={180} height={200}>
            <div className="h-full rounded-lg border-2 border-accent/50 bg-accent/5 backdrop-blur-sm p-3">
              <div className="flex items-center gap-2 mb-3 text-accent">
                <Cpu className="w-4 h-4" />
                <span className="font-semibold text-sm text-foreground">Algorithm Engine</span>
              </div>
              <div className="space-y-2">
                <motion.div 
                  className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.3 }}
                >
                  <GitMerge className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium">Kruskal + DSU</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.3 }}
                >
                  <Navigation className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-xs font-medium">Dijkstra</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.3 }}
                >
                  <TreeDeciduous className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-medium">Prim</span>
                </motion.div>
              </div>
            </div>
          </foreignObject>
        </motion.g>

        {/* VISUALIZATION */}
        <ArchitectureBox
          title="Visualization"
          icon={<Eye className="w-4 h-4" />}
          items={["SVG Canvas", "Step Animation", "Traffic Flow", "Path Highlight"]}
          delay={1.8}
          color="accent"
          x={720}
          y={140}
          width={150}
        />

        {/* DATA FLOW LABEL */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
        >
          <foreignObject x={260} y={410} width={400} height={40}>
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
              <span>Data Flow:</span>
              <span className="text-primary">User Input</span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-secondary">Graph</span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-accent">Algorithm</span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-primary">Visualization</span>
            </div>
          </foreignObject>
        </motion.g>

        {/* ANIMATED CONNECTIONS */}
        {/* GraphBuilder to Graph Data */}
        <motion.line
          x1={190}
          y1={130}
          x2={255}
          y2={170}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          strokeDasharray="6 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        />
        
        {/* Templates to Shared State */}
        <motion.line
          x1={190}
          y1={280}
          x2={255}
          y2={330}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          strokeDasharray="6 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        />

        {/* Graph Data to Algorithm Engine */}
        <motion.line
          x1={410}
          y1={180}
          x2={475}
          y2={180}
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          strokeDasharray="6 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        />

        {/* Shared State to Graph Data */}
        <motion.line
          x1={335}
          y1={290}
          x2={335}
          y2={245}
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          strokeDasharray="6 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        />

        {/* Algorithm Engine to Visualization */}
        <motion.line
          x1={660}
          y1={180}
          x2={715}
          y2={180}
          stroke="hsl(var(--accent))"
          strokeWidth={2}
          strokeDasharray="6 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        />

        {/* Algorithm Engine to Shared State */}
        <motion.path
          d="M 570 280 Q 570 340 415 340"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          strokeDasharray="6 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        />

        {/* Animated flow dots */}
        <motion.circle
          r={5}
          fill="hsl(var(--primary))"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            cx: [190, 255],
            cy: [130, 170]
          }}
          transition={{ delay: 2, duration: 2, repeat: Infinity, ease: "linear" }}
        />

        <motion.circle
          r={5}
          fill="hsl(var(--secondary))"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            cx: [410, 475],
            cy: [180, 180]
          }}
          transition={{ delay: 2.3, duration: 2, repeat: Infinity, ease: "linear" }}
        />

        <motion.circle
          r={5}
          fill="hsl(var(--accent))"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            cx: [660, 715],
            cy: [180, 180]
          }}
          transition={{ delay: 2.6, duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
};

export default ArchitectureDiagram;
