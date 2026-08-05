import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Trophy, Search, Star, Zap, FolderGit2, Check, ArrowUpRight,
  ShieldCheck, Filter, ChevronLeft, ChevronRight, ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TechBadge from "@/components/TechBadge";

interface LeaderboardBuilder {
  id: string;
  rank: number;
  username: string;
  full_name: string;
  avatar_url: string;
  category: string;
  reputation: number;
  ships_count: number;
  stars_count: number;
  contracts_count: number;
  top_stack: string[];
  is_verified: boolean;
}

const LEADERBOARD_DATA: LeaderboardBuilder[] = [
  {
    id: "b_demo",
    rank: 1,
    username: "demo",
    full_name: "Demo Builder",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demobuilder&backgroundColor=00f2ff",
    category: "AI Agents",
    reputation: 99,
    ships_count: 12,
    stars_count: 1240,
    contracts_count: 18,
    top_stack: ["Python", "PyTorch", "LangChain", "FastAPI"],
    is_verified: true,
  },
  {
    id: "b2",
    rank: 2,
    username: "priya_ships",
    full_name: "Priya Sharma",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=c0aede",
    category: "Data & ML",
    reputation: 97,
    ships_count: 8,
    stars_count: 567,
    contracts_count: 12,
    top_stack: ["Python", "PyTorch", "LangChain", "FastAPI"],
    is_verified: true,
  },
  {
    id: "b3",
    rank: 3,
    username: "arjun_builds",
    full_name: "Arjun Mehta",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun&backgroundColor=b6e3f4",
    category: "AI Agents",
    reputation: 98,
    ships_count: 12,
    stars_count: 342,
    contracts_count: 15,
    top_stack: ["OpenAI", "LangChain", "Next.js", "Postgres"],
    is_verified: true,
  },
  {
    id: "b4",
    rank: 4,
    username: "devpatel_ai",
    full_name: "Dev Patel",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=devpatel&backgroundColor=b6e3f4",
    category: "DevOps & Infra",
    reputation: 95,
    ships_count: 8,
    stars_count: 203,
    contracts_count: 9,
    top_stack: ["Twilio", "Whisper", "GPT-4", "Node.js"],
    is_verified: true,
  },
  {
    id: "b5",
    rank: 5,
    username: "sarah_agent",
    full_name: "Sarah Chen",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarahchen&backgroundColor=ffdfbf",
    category: "Full Stack",
    reputation: 94,
    ships_count: 15,
    stars_count: 890,
    contracts_count: 22,
    top_stack: ["React", "TypeScript", "Python", "Qdrant"],
    is_verified: true,
  },
  {
    id: "b6",
    rank: 6,
    username: "marcus_dev",
    full_name: "Marcus Vance",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus&backgroundColor=d1d4f9",
    category: "DevOps & Infra",
    reputation: 92,
    ships_count: 10,
    stars_count: 412,
    contracts_count: 11,
    top_stack: ["Docker", "Kubernetes", "Rust", "Terraform"],
    is_verified: false,
  },
  {
    id: "b7",
    rank: 7,
    username: "elena_ml",
    full_name: "Elena Rostova",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena&backgroundColor=ffd5dc",
    category: "Data & ML",
    reputation: 91,
    ships_count: 7,
    stars_count: 630,
    contracts_count: 8,
    top_stack: ["TensorFlow", "Python", "Jupyter", "AWS"],
    is_verified: true,
  },
  {
    id: "b8",
    rank: 8,
    username: "kai_systems",
    full_name: "Kai Tanaka",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=kai&backgroundColor=c0aede",
    category: "Full Stack",
    reputation: 89,
    ships_count: 6,
    stars_count: 280,
    contracts_count: 7,
    top_stack: ["Go", "PostgreSQL", "React", "Tailwind"],
    is_verified: true,
  },
];

const CATEGORIES = ["All", "AI Agents", "Data & ML", "DevOps & Infra", "Full Stack"];

export const Leaderboards = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"reputation" | "ships_count" | "stars_count">("reputation");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = useMemo(() => {
    let result = [...LEADERBOARD_DATA];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.full_name.toLowerCase().includes(q) ||
          b.username.toLowerCase().includes(q) ||
          b.top_stack.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== "All") {
      result = result.filter((b) => b.category === selectedCategory);
    }
    result.sort((a, b) => b[sortBy] - a[sortBy]);
    return result;
  }, [search, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 h-14 border-b border-border bg-background/80 backdrop-blur-xl flex items-center px-4 z-50 justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
          ← Shipyards
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/explore" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
          <Link to="/projects" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">Projects</Link>
          <Link to="/login" className="px-3 py-1 rounded bg-primary text-primary-foreground font-mono text-xs hover:bg-primary/90 transition-colors">Sign In</Link>
        </div>
      </div>

      <div className="h-14" />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-medium text-primary mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Builder Leaderboard</span>
            </div>
            <h1 className="font-display font-bold text-3xl text-foreground">Top AI Builders</h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">Ranked algorithmically by verified code docks, reputation, and contract deliveries.</p>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search builders or stack..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9 h-9 bg-card text-xs font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                  selectedCategory === cat
                    ? "bg-primary/15 border-primary/30 text-primary font-bold"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Card */}
        <Card className="border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold">Rank</th>
                  <th className="px-4 py-3 font-semibold">Builder</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold cursor-pointer" onClick={() => setSortBy("reputation")}>
                    <span className="flex items-center gap-1">Reputation <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="px-4 py-3 font-semibold cursor-pointer hidden md:table-cell" onClick={() => setSortBy("ships_count")}>
                    <span className="flex items-center gap-1">Ships <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="px-4 py-3 font-semibold cursor-pointer hidden md:table-cell" onClick={() => setSortBy("stars_count")}>
                    <span className="flex items-center gap-1">Stars <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="px-4 py-3 font-semibold text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedData.map((b, idx) => {
                  const actualRank = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold ${
                          actualRank === 1 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                          actualRank === 2 ? "bg-slate-300/20 text-slate-300 border border-slate-300/30" :
                          actualRank === 3 ? "bg-amber-700/20 text-amber-600 border border-amber-700/30" :
                          "text-muted-foreground"
                        }`}>
                          #{actualRank}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={b.avatar_url} alt="" className="w-8 h-8 rounded-full border border-border" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Link to={`/@${b.username}`} className="text-xs font-bold text-foreground hover:text-primary transition-colors">
                                {b.full_name}
                              </Link>
                              {b.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground">@{b.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{b.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs font-mono font-bold text-primary">
                          <Zap className="w-3.5 h-3.5" />
                          <span>{b.reputation}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs font-mono text-foreground">
                        <span className="flex items-center gap-1"><FolderGit2 className="w-3.5 h-3.5 text-muted-foreground" /> {b.ships_count}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs font-mono text-foreground">
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {b.stars_count}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/@${b.username}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-border text-[10px] font-mono text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                          View <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Showing {paginatedData.length} of {filteredData.length} builders</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="h-7 px-2 text-[10px]"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </Button>
              <span>Page {currentPage} of {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="h-7 px-2 text-[10px]"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Leaderboards;
