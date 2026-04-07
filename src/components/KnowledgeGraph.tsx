"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { kgNodes, kgEdges, type KGNode, type KGEdge } from "@/lib/graph-data";

// ── Simulation state ──────────────────────────────────────────────────────────
interface SimNode extends KGNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

type FilterType = "all" | "paper" | "lab" | "author";

// ── Force constants ───────────────────────────────────────────────────────────
const REPULSION_BASE = 1800;
const REPULSION_LAB = 3200;
const REPULSION_INDUSTRY = 2200;
const SPRING_LENGTH_BASE = 120;
const SPRING_STRENGTH = 0.04;
const CENTERING = 0.012;
const DAMPING = 0.85;
const SETTLE_TICKS = 150;

function getRepulsion(node: KGNode): number {
  if (node.type === "industry-tag") return REPULSION_INDUSTRY;
  if (node.type === "lab") return REPULSION_LAB;
  return REPULSION_BASE;
}

function springLength(edge: KGEdge): number {
  if (edge.type === "industry") return 180;
  if (edge.type === "affiliated") return 100;
  if (edge.type === "related") return 140;
  return 110; // wrote
}

// ── Node geometry helpers ─────────────────────────────────────────────────────
function nodeRadius(node: KGNode): number {
  if (node.type === "industry-tag") return 22;
  if (node.type === "lab") return 18;
  if (node.type === "author") return 10;
  return 13;
}

function edgeOpacity(edgeType: KGEdge["type"]): number {
  if (edgeType === "related") return 0.35;
  if (edgeType === "industry") return 0.25;
  return 0.5;
}

function edgeDash(edgeType: KGEdge["type"]): string | undefined {
  if (edgeType === "related") return "4 3";
  if (edgeType === "industry") return "2 4";
  return undefined;
}

// ── Main component ────────────────────────────────────────────────────────────
export function KnowledgeGraph() {
  const router = useRouter();
  const { t, lang } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  const [width, setWidth] = useState(800);
  const height = width < 640 ? 400 : 600;

  // Simulation nodes — initialised once, mutated in-place
  const simNodes = useRef<SimNode[]>([]);
  const [renderTick, setRenderTick] = useState(0); // incremented to trigger re-render

  const [filter, setFilter] = useState<FilterType>("all");
  const [tooltip, setTooltip] = useState<{
    node: KGNode;
    x: number;
    y: number;
  } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const draggingRef = useRef<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // ── ResizeObserver ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Initialise simulation ───────────────────────────────────────────────────
  useEffect(() => {
    const cx = width / 2;
    const cy = height / 2;
    // Spread nodes in a rough circle so they don't start stacked
    simNodes.current = kgNodes.map((node, i) => {
      const angle = (i / kgNodes.length) * 2 * Math.PI;
      const radius = 150 + Math.random() * 80;
      return {
        ...node,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      };
    });

    // Run settle ticks synchronously before first paint
    for (let i = 0; i < SETTLE_TICKS; i++) {
      tickSimulation(simNodes.current, width, height);
    }
    setRenderTick((n) => n + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  // ── Animation loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    let settled = 0;
    function loop() {
      if (!draggingRef.current) {
        tickSimulation(simNodes.current, width, height);
        settled++;
      }
      setRenderTick((n) => n + 1);
      // After 300 more ticks of animation slow down to every 4 frames
      if (settled > 300) {
        let skip = 0;
        const slowLoop = () => {
          if (skip++ % 4 === 0) {
            tickSimulation(simNodes.current, width, height);
            setRenderTick((n) => n + 1);
          }
          animRef.current = requestAnimationFrame(slowLoop);
        };
        animRef.current = requestAnimationFrame(slowLoop);
        return;
      }
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  // ── Build id → index map for fast lookup ────────────────────────────────────
  const nodeIndex = useMemo(() => {
    const m = new Map<string, number>();
    kgNodes.forEach((n, i) => m.set(n.id, i));
    return m;
  }, []);

  // ── Filter logic ─────────────────────────────────────────────────────────────
  function isVisible(node: KGNode): boolean {
    if (filter === "all") return true;
    if (filter === "paper") return node.type === "paper";
    if (filter === "lab")
      return node.type === "lab" || node.type === "industry-tag";
    if (filter === "author") return node.type === "author";
    return true;
  }

  // ── Drag handlers ─────────────────────────────────────────────────────────────
  const svgRef = useRef<SVGSVGElement>(null);

  function svgPoint(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return { x: clientX, y: clientY };
    const rect = svg.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.preventDefault();
      const sim = simNodes.current.find((n) => n.id === nodeId);
      if (!sim) return;
      const pt = svgPoint(e.clientX, e.clientY);
      dragOffsetRef.current = { x: pt.x - sim.x, y: pt.y - sim.y };
      draggingRef.current = nodeId;
      setDragging(nodeId);
    },
    []
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const pt = svgPoint(e.clientX, e.clientY);
    const sim = simNodes.current.find((n) => n.id === draggingRef.current);
    if (!sim) return;
    sim.x = pt.x - dragOffsetRef.current.x;
    sim.y = pt.y - dragOffsetRef.current.y;
    sim.vx = 0;
    sim.vy = 0;
    setRenderTick((n) => n + 1);
  }, []);

  const handleMouseUp = useCallback(() => {
    draggingRef.current = null;
    setDragging(null);
  }, []);

  // Touch equivalents
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, nodeId: string) => {
      const touch = e.touches[0];
      if (!touch) return;
      const sim = simNodes.current.find((n) => n.id === nodeId);
      if (!sim) return;
      const pt = svgPoint(touch.clientX, touch.clientY);
      dragOffsetRef.current = { x: pt.x - sim.x, y: pt.y - sim.y };
      draggingRef.current = nodeId;
      setDragging(nodeId);
    },
    []
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const pt = svgPoint(touch.clientX, touch.clientY);
    const sim = simNodes.current.find((n) => n.id === draggingRef.current);
    if (!sim) return;
    sim.x = pt.x - dragOffsetRef.current.x;
    sim.y = pt.y - dragOffsetRef.current.y;
    sim.vx = 0;
    sim.vy = 0;
    setRenderTick((n) => n + 1);
  }, []);

  // ── Click handler ─────────────────────────────────────────────────────────────
  const handleNodeClick = useCallback(
    (node: KGNode) => {
      if (node.type === "paper" && node.slug) {
        router.push(`/papers/${node.slug}`);
      }
    },
    [router]
  );

  // Suppress unused var warning — renderTick is consumed here
  void renderTick;

  // ── Snapshot positions for render ────────────────────────────────────────────
  const positions = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    simNodes.current.forEach((n) => m.set(n.id, { x: n.x, y: n.y }));
    return m;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderTick]);

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {(["all", "paper", "lab", "author"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? "bg-paper-900 text-white dark:bg-slate-200 dark:text-slate-900"
                : "bg-paper-100 text-paper-700 hover:bg-paper-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            {f === "all"
              ? t("All", "全部")
              : f === "paper"
              ? t("Papers", "论文")
              : f === "lab"
              ? t("Labs", "机构")
              : t("Authors", "作者")}
          </button>
        ))}
        <span className="ml-auto text-xs text-paper-800/40 dark:text-slate-500 self-center">
          {t("Drag nodes · Click papers to open", "拖拽节点 · 点击论文打开")}
        </span>
      </div>

      {/* SVG canvas */}
      <div
        ref={containerRef}
        className="relative rounded-xl border border-paper-200 dark:border-slate-700 bg-paper-50 dark:bg-slate-900 overflow-hidden select-none"
        style={{ height }}
      >
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="absolute inset-0"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Edges */}
          <g>
            {kgEdges.map((edge, i) => {
              const si = nodeIndex.get(edge.source);
              const ti = nodeIndex.get(edge.target);
              if (si === undefined || ti === undefined) return null;
              const sNode = kgNodes[si];
              const tNode = kgNodes[ti];
              const sPos = positions.get(edge.source);
              const tPos = positions.get(edge.target);
              if (!sPos || !tPos) return null;
              const bothVisible = isVisible(sNode) && isVisible(tNode);
              return (
                <line
                  key={i}
                  x1={sPos.x}
                  y1={sPos.y}
                  x2={tPos.x}
                  y2={tPos.y}
                  stroke={bothVisible ? "#94a3b8" : "#cbd5e1"}
                  strokeOpacity={bothVisible ? edgeOpacity(edge.type) : 0.1}
                  strokeWidth={edge.type === "related" ? 1 : 1.5}
                  strokeDasharray={edgeDash(edge.type)}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {kgNodes.map((node) => {
              const pos = positions.get(node.id);
              if (!pos) return null;
              const visible = isVisible(node);
              const r = nodeRadius(node);
              const opacity = visible ? 1 : 0.18;
              const isDragged = dragging === node.id;
              const label = lang === "zh" && node.labelZh ? node.labelZh : node.label;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x},${pos.y})`}
                  style={{ cursor: node.type === "paper" ? "pointer" : "grab", opacity }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  onTouchStart={(e) => handleTouchStart(e, node.id)}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={(e) => {
                    const svgEl = svgRef.current;
                    if (!svgEl) return;
                    const rect = svgEl.getBoundingClientRect();
                    setTooltip({
                      node,
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <NodeShape
                    node={node}
                    r={r}
                    isDragged={isDragged}
                    visible={visible}
                  />
                  {/* Label */}
                  <text
                    y={r + 11}
                    textAnchor="middle"
                    fontSize={node.type === "industry-tag" ? 9 : 8.5}
                    fontWeight={node.type === "industry-tag" ? "700" : "500"}
                    fill="currentColor"
                    className="text-paper-800 dark:text-slate-200"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {label.length > 16 ? label.slice(0, 15) + "…" : label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-10 pointer-events-none px-2.5 py-1.5 rounded-lg shadow-lg text-xs bg-white dark:bg-slate-800 border border-paper-200 dark:border-slate-600"
            style={{
              left: Math.min(tooltip.x + 10, width - 160),
              top: Math.max(tooltip.y - 40, 4),
              maxWidth: 160,
            }}
          >
            <div className="font-semibold text-paper-900 dark:text-slate-100 leading-tight">
              {lang === "zh" && tooltip.node.labelZh
                ? tooltip.node.labelZh
                : tooltip.node.label}
            </div>
            {tooltip.node.year && (
              <div className="text-paper-500 dark:text-slate-400">
                {tooltip.node.year}
              </div>
            )}
            <div className="text-paper-400 dark:text-slate-500 capitalize">
              {tooltip.node.type === "industry-tag"
                ? t("category", "分类")
                : tooltip.node.type}
            </div>
            {tooltip.node.type === "paper" && (
              <div className="text-indigo-500 dark:text-indigo-400 mt-0.5">
                {t("Click to open →", "点击打开 →")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── NodeShape sub-component ───────────────────────────────────────────────────
function NodeShape({
  node,
  r,
  isDragged,
}: {
  node: KGNode;
  r: number;
  isDragged: boolean;
  visible: boolean;
}) {
  const stroke = isDragged ? "#6366f1" : "white";
  const strokeWidth = isDragged ? 2.5 : 1.5;
  const fill = node.color ?? "#94a3b8";

  if (node.type === "industry-tag") {
    // Pill shape
    const rx = r * 1.8;
    const ry = r * 0.72;
    return (
      <ellipse
        rx={rx}
        ry={ry}
        fill={fill}
        fillOpacity={0.18}
        stroke={fill}
        strokeWidth={1.5}
      />
    );
  }

  if (node.type === "lab") {
    // Diamond
    const s = r * 1.1;
    return (
      <polygon
        points={`0,${-s} ${s},0 0,${s} ${-s},0`}
        fill={fill}
        fillOpacity={0.85}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }

  // Default circle (paper + author)
  return (
    <circle
      r={r}
      fill={fill}
      fillOpacity={node.type === "author" ? 0.9 : 1}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

// ── Force simulation tick ─────────────────────────────────────────────────────
function tickSimulation(nodes: SimNode[], width: number, height: number) {
  const n = nodes.length;
  const cx = width / 2;
  const cy = height / 2;

  // Zero forces
  for (let i = 0; i < n; i++) {
    nodes[i].vx *= DAMPING;
    nodes[i].vy *= DAMPING;
  }

  // Repulsion (O(n²) — fine for ~50 nodes)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const dist2 = dx * dx + dy * dy + 0.01;
      const dist = Math.sqrt(dist2);
      const rep = (getRepulsion(nodes[i]) + getRepulsion(nodes[j])) / 2;
      const force = rep / dist2;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      nodes[i].vx -= fx;
      nodes[i].vy -= fy;
      nodes[j].vx += fx;
      nodes[j].vy += fy;
    }
  }

  // Spring attraction along edges
  const nodeMap = new Map<string, SimNode>();
  for (let i = 0; i < n; i++) nodeMap.set(nodes[i].id, nodes[i]);

  for (const edge of kgEdges) {
    const s = nodeMap.get(edge.source);
    const t = nodeMap.get(edge.target);
    if (!s || !t) continue;
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
    const target = springLength(edge);
    const stretch = dist - target;
    const force = stretch * SPRING_STRENGTH;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;
    s.vx += fx;
    s.vy += fy;
    t.vx -= fx;
    t.vy -= fy;
  }

  // Centering force
  for (let i = 0; i < n; i++) {
    nodes[i].vx += (cx - nodes[i].x) * CENTERING;
    nodes[i].vy += (cy - nodes[i].y) * CENTERING;
  }

  // Integrate + clamp to bounds
  const margin = 40;
  for (let i = 0; i < n; i++) {
    nodes[i].x += nodes[i].vx;
    nodes[i].y += nodes[i].vy;
    nodes[i].x = Math.max(margin, Math.min(width - margin, nodes[i].x));
    nodes[i].y = Math.max(margin, Math.min(height - margin, nodes[i].y));
  }
}
