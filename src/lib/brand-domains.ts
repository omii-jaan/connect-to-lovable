/**
 * Brand identity resolution.
 *
 * Tech-stack tags across the marketplace are free-form strings ("Claude API",
 * "GPT-4o", "Next.js"). We normalise them to a canonical brand and a domain so
 * Logo.dev can resolve a real logo at runtime, with a typographic monogram as
 * the deterministic fallback for anything unmapped (a language, a pattern, a
 * skill — things that have no logo and shouldn't fake one).
 */

export type Brand = {
  /** Canonical display label. */
  label: string;
  /** Root domain used for logo lookup, or null when the tag has no brand. */
  domain: string | null;
};

const BRANDS: Record<string, Brand> = {
  // Model providers
  openai: { label: "OpenAI", domain: "openai.com" },
  "gpt-4": { label: "GPT-4", domain: "openai.com" },
  "gpt-4o": { label: "GPT-4o", domain: "openai.com" },
  "gpt-5": { label: "GPT-5", domain: "openai.com" },
  whisper: { label: "Whisper", domain: "openai.com" },
  "openai whisper": { label: "Whisper", domain: "openai.com" },
  dalle: { label: "DALL·E", domain: "openai.com" },
  anthropic: { label: "Anthropic", domain: "anthropic.com" },
  claude: { label: "Claude", domain: "anthropic.com" },
  "claude api": { label: "Claude", domain: "anthropic.com" },
  "claude-3.5-sonnet": { label: "Claude 3.5", domain: "anthropic.com" },
  gemini: { label: "Gemini", domain: "deepmind.google" },
  mistral: { label: "Mistral", domain: "mistral.ai" },
  cohere: { label: "Cohere", domain: "cohere.com" },
  perplexity: { label: "Perplexity", domain: "perplexity.ai" },
  elevenlabs: { label: "ElevenLabs", domain: "elevenlabs.io" },
  replicate: { label: "Replicate", domain: "replicate.com" },
  huggingface: { label: "Hugging Face", domain: "huggingface.co" },
  "hugging face": { label: "Hugging Face", domain: "huggingface.co" },
  ollama: { label: "Ollama", domain: "ollama.com" },

  // Agent / orchestration
  langchain: { label: "LangChain", domain: "langchain.com" },
  langgraph: { label: "LangGraph", domain: "langchain.com" },
  langsmith: { label: "LangSmith", domain: "langchain.com" },
  llamaindex: { label: "LlamaIndex", domain: "llamaindex.ai" },
  crewai: { label: "CrewAI", domain: "crewai.com" },
  n8n: { label: "n8n", domain: "n8n.io" },
  zapier: { label: "Zapier", domain: "zapier.com" },
  make: { label: "Make", domain: "make.com" },

  // Vector / data
  pinecone: { label: "Pinecone", domain: "pinecone.io" },
  qdrant: { label: "Qdrant", domain: "qdrant.tech" },
  weaviate: { label: "Weaviate", domain: "weaviate.io" },
  chroma: { label: "Chroma", domain: "trychroma.com" },
  supabase: { label: "Supabase", domain: "supabase.com" },
  postgres: { label: "Postgres", domain: "postgresql.org" },
  postgresql: { label: "PostgreSQL", domain: "postgresql.org" },
  mongodb: { label: "MongoDB", domain: "mongodb.com" },
  redis: { label: "Redis", domain: "redis.io" },
  clickhouse: { label: "ClickHouse", domain: "clickhouse.com" },
  snowflake: { label: "Snowflake", domain: "snowflake.com" },
  planetscale: { label: "PlanetScale", domain: "planetscale.com" },
  neon: { label: "Neon", domain: "neon.tech" },
  firebase: { label: "Firebase", domain: "firebase.google.com" },
  airtable: { label: "Airtable", domain: "airtable.com" },

  // Frameworks / runtimes
  react: { label: "React", domain: "react.dev" },
  "next.js": { label: "Next.js", domain: "nextjs.org" },
  nextjs: { label: "Next.js", domain: "nextjs.org" },
  vue: { label: "Vue", domain: "vuejs.org" },
  svelte: { label: "Svelte", domain: "svelte.dev" },
  "node.js": { label: "Node.js", domain: "nodejs.org" },
  nodejs: { label: "Node.js", domain: "nodejs.org" },
  node: { label: "Node.js", domain: "nodejs.org" },
  deno: { label: "Deno", domain: "deno.com" },
  bun: { label: "Bun", domain: "bun.sh" },
  fastapi: { label: "FastAPI", domain: "fastapi.tiangolo.com" },
  django: { label: "Django", domain: "djangoproject.com" },
  flask: { label: "Flask", domain: "palletsprojects.com" },
  tailwind: { label: "Tailwind", domain: "tailwindcss.com" },
  typescript: { label: "TypeScript", domain: "typescriptlang.org" },
  python: { label: "Python", domain: "python.org" },
  rust: { label: "Rust", domain: "rust-lang.org" },
  go: { label: "Go", domain: "go.dev" },
  pytorch: { label: "PyTorch", domain: "pytorch.org" },
  tensorflow: { label: "TensorFlow", domain: "tensorflow.org" },
  playwright: { label: "Playwright", domain: "playwright.dev" },

  // Infra / platform
  vercel: { label: "Vercel", domain: "vercel.com" },
  netlify: { label: "Netlify", domain: "netlify.com" },
  aws: { label: "AWS", domain: "aws.amazon.com" },
  gcp: { label: "Google Cloud", domain: "cloud.google.com" },
  azure: { label: "Azure", domain: "azure.microsoft.com" },
  cloudflare: { label: "Cloudflare", domain: "cloudflare.com" },
  docker: { label: "Docker", domain: "docker.com" },
  kubernetes: { label: "Kubernetes", domain: "kubernetes.io" },
  github: { label: "GitHub", domain: "github.com" },
  railway: { label: "Railway", domain: "railway.app" },
  render: { label: "Render", domain: "render.com" },
  fly: { label: "Fly.io", domain: "fly.io" },
  modal: { label: "Modal", domain: "modal.com" },

  // Product / SaaS
  stripe: { label: "Stripe", domain: "stripe.com" },
  twilio: { label: "Twilio", domain: "twilio.com" },
  slack: { label: "Slack", domain: "slack.com" },
  "slack api": { label: "Slack", domain: "slack.com" },
  discord: { label: "Discord", domain: "discord.com" },
  notion: { label: "Notion", domain: "notion.so" },
  "notion api": { label: "Notion", domain: "notion.so" },
  linear: { label: "Linear", domain: "linear.app" },
  intercom: { label: "Intercom", domain: "intercom.com" },
  hubspot: { label: "HubSpot", domain: "hubspot.com" },
  salesforce: { label: "Salesforce", domain: "salesforce.com" },
  calendly: { label: "Calendly", domain: "calendly.com" },
  gmail: { label: "Gmail", domain: "gmail.com" },
  "gmail api": { label: "Gmail", domain: "gmail.com" },
  resend: { label: "Resend", domain: "resend.com" },
  shopify: { label: "Shopify", domain: "shopify.com" },
  figma: { label: "Figma", domain: "figma.com" },
  posthog: { label: "PostHog", domain: "posthog.com" },
  sentry: { label: "Sentry", domain: "sentry.io" },
  algolia: { label: "Algolia", domain: "algolia.com" },
};

/** Strip trailing noise like "API", "SDK", punctuation and casing. */
function normalise(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*\((.*)\)\s*/g, " ")
    .trim();
}

export function resolveBrand(raw: string): Brand {
  const key = normalise(raw);
  const direct = BRANDS[key];
  if (direct) return direct;

  // "Claude API" -> "claude", "Notion API" -> "notion"
  const stripped = key.replace(/\s+(api|sdk|cloud|platform)$/i, "");
  const loose = BRANDS[stripped];
  if (loose) return { label: raw, domain: loose.domain };

  return { label: raw, domain: null };
}

/** Deterministic monogram for tags without a brand (skills, patterns, langs). */
export function monogram(label: string): string {
  const words = label.replace(/[^a-zA-Z0-9 ]/g, " ").trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return label.slice(0, 2).toUpperCase();
}
