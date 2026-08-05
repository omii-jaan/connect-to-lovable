import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Activity, FolderGit2, Sparkles, MessageSquare, Heart, Bookmark,
  Share2, ShieldCheck, ArrowRight, UserCheck, Flame, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notify as toast } from "@/lib/notify";
import { sendNotification } from "@/lib/notifications";
import TechBadge from "@/components/TechBadge";

interface FeedPost {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    is_verified: boolean;
  };
  timestamp: string;
  content: string;
  ship?: {
    title: string;
    description: string;
    stack: string[];
    link: string;
  };
  likes: number;
  comments: number;
}

const SAMPLE_FEED_POSTS: FeedPost[] = [
  {
    id: "f1",
    author: {
      name: "Demo Builder",
      username: "demo",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demobuilder&backgroundColor=00f2ff",
      is_verified: true,
    },
    timestamp: "2 hours ago",
    content: "Just docked a new multi-agent orchestrator for real-time document OCR! Benchmark latency dropped to 42ms with full layout preservation.",
    ship: {
      title: "Real-Time Document OCR Pipeline",
      description: "End-to-end OCR with layout preservation using vision transformers.",
      stack: ["Python", "PyTorch", "FastAPI"],
      link: "/@demo",
    },
    likes: 48,
    comments: 12,
  },
  {
    id: "f2",
    author: {
      name: "Priya Sharma",
      username: "priya_ships",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=c0aede",
      is_verified: true,
    },
    timestamp: "5 hours ago",
    content: "Milestone #2 approved and released on the Autonomous Web Scraper project! Special thanks to the Shipyards marketplace matcher for connecting us.",
    likes: 31,
    comments: 5,
  },
  {
    id: "f3",
    author: {
      name: "Arjun Mehta",
      username: "arjun_builds",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun&backgroundColor=b6e3f4",
      is_verified: true,
    },
    timestamp: "1 day ago",
    content: "Shipped v2.0 of our AI CRM Agent. Added native Stripe API webhook triggers and automatic follow-up sequencing.",
    ship: {
      title: "Autonomous CRM Agent",
      description: "AI-driven CRM workflows with zero-latency webhook routing.",
      stack: ["OpenAI", "LangChain", "Next.js"],
      link: "/@arjun_builds",
    },
    likes: 64,
    comments: 19,
  },
];

export const Feed = () => {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleGuestAction = (actionName: string) => {
    toast.error(`Sign in to ${actionName}.`, {
      action: {
        label: "Sign In",
        onClick: () => { window.location.href = "/login"; },
      },
    });
  };

  const toggleLike = (postId: string) => {
    if (!user) {
      handleGuestAction("like posts");
      return;
    }
    const isLiking = !likedPosts.has(postId);
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) { next.delete(postId); }
      else { next.add(postId); }
      return next;
    });

    if (isLiking) {
      const post = SAMPLE_FEED_POSTS.find((p) => p.id === postId);
      if (post) {
        const recipientUid = post.author.username === "priya_ships" ? "user_b" : (post.author.username === "demo" ? "user_b" : post.author.username);
        sendNotification({
          recipientUid,
          actorUid: user.id,
          actorName: user.user_metadata?.full_name || "Alex Rivera",
          actorAvatar: user.user_metadata?.avatar_url || "",
          type: "like",
          targetId: post.id,
          title: `${user.user_metadata?.full_name || "A builder"} liked your feed post`,
          text: post.content.slice(0, 60),
          link: "/feed",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 h-14 border-b border-border bg-background/80 backdrop-blur-xl flex items-center px-4 z-50 justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
          ← Shipyards
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/explore" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
          <Link to="/leaderboards" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">Leaderboards</Link>
          <Link to="/login" className="px-3 py-1 rounded bg-primary text-primary-foreground font-mono text-xs hover:bg-primary/90 transition-colors">Sign In</Link>
        </div>
      </div>

      <div className="h-14" />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-medium text-primary mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Discover Feed</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-foreground">Live Builder Activity</h1>
          <p className="text-xs font-mono text-muted-foreground mt-1">Real-time updates, docked releases, and milestone achievements from the community.</p>
        </div>

        {/* Composer or Guest CTA */}
        {user ? (
          <Card className="border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="text-primary">&gt;</span> Share a milestone or ship...
            </div>
            <textarea
              aria-label="What are you shipping today?"
              placeholder="What are you shipping today?"
              className="w-full h-20 p-3 rounded-lg bg-muted/50 border border-border text-xs text-foreground outline-none focus:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
            />
            <div className="flex justify-end">
              <Button size="sm" className="text-xs">
                <Send className="w-3.5 h-3.5 mr-1" /> Post Update
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="border-primary/20 bg-primary/5 p-6 text-center space-y-3 relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary font-bold">
              <UserCheck className="w-3.5 h-3.5" /> Guest Mode (Read Only)
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Join the conversation on Shipyards</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Sign in to post your ships, express interest in open contracts, and collaborate with verified AI builders.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link to="/sign-up">
                <Button size="sm" className="bg-primary text-primary-foreground font-bold text-xs px-5">
                  Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm" className="text-xs px-5">
                  Sign In
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Feed Posts List */}
        <div className="space-y-4">
          {SAMPLE_FEED_POSTS.map((post) => {
            const isLiked = likedPosts.has(post.id);
            return (
              <Card key={post.id} className="border-border bg-card p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full border border-border" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Link to={`/@${post.author.username}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                          {post.author.name}
                        </Link>
                        {post.author.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">@{post.author.username} · {post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-foreground leading-relaxed">{post.content}</p>

                {post.ship && (
                  <div className="rounded-xl border border-border/60 bg-muted/40 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">{post.ship.title}</span>
                      </div>
                      <Link to={post.ship.link} className="text-[10px] font-mono text-primary hover:underline">
                        View Dock →
                      </Link>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{post.ship.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {post.ship.stack.map((s) => (
                        <TechBadge key={s} name={s} size="xs" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <button
                    type="button"
                    aria-label={`Like post, current likes ${post.likes + (isLiked ? 1 : 0)}`}
                    onClick={() => toggleLike(post.id)}
                    className={`min-h-[36px] min-w-[36px] px-2 rounded-md flex items-center gap-1.5 hover:text-foreground transition-colors ${isLiked ? "text-destructive font-bold" : ""}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-destructive text-destructive" : ""}`} />
                    <span>{post.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Comments, total ${post.comments}`}
                    onClick={() => handleGuestAction("comment on posts")}
                    className="min-h-[36px] min-w-[36px] px-2 rounded-md flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments}</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Share post link"
                    onClick={() => toast("Post link copied!")}
                    className="min-h-[36px] min-w-[36px] px-2 rounded-md flex items-center justify-center hover:text-foreground transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Feed;
