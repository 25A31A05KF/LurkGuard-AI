import { useState, useRef, useCallback } from "react";
import { Upload, Shield, ShieldAlert, ShieldCheck, Loader2, FileAudio, Sparkles, Mic, Brain, Cpu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroShield from "@/assets/hero-shield.jpg";

type Verdict = "safe" | "suspicious" | "fraud";

interface AnalysisResult {
  transcript: string;
  language?: string;
  translation?: string;
  verdict: Verdict;
  confidence: number;
  red_flags: string[];
  explanation: string;
  summary: string;
}

const verdictConfig: Record<Verdict, { label: string; color: string; bg: string; icon: typeof Shield; emoji: string }> = {
  safe: {
    label: "Safe Call",
    color: "text-safe",
    bg: "from-safe/30 to-safe/5 border-safe/40",
    icon: ShieldCheck,
    emoji: "✅",
  },
  suspicious: {
    label: "Suspicious",
    color: "text-suspicious",
    bg: "from-suspicious/30 to-suspicious/5 border-suspicious/40",
    icon: ShieldAlert,
    emoji: "⚠️",
  },
  fraud: {
    label: "Fraud Detected",
    color: "text-fraud",
    bg: "from-fraud/30 to-fraud/5 border-fraud/40",
    icon: ShieldAlert,
    emoji: "🚨",
  },
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function LurkGuardApp() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File | null) => {
    if (!f) return;
    if (!/audio\/(mpeg|mp3)|video\/mp4|audio\/mp4/.test(f.type) && !/\.(mp3|mp4)$/i.test(f.name)) {
      toast.error("Please upload an MP3 or MP4 file");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      toast.error("File too large (max 20 MB)");
      return;
    }
    setFile(f);
    setResult(null);
  }, []);

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      toast.info("Uploading & transcribing with Google Gemini…");
      const audioBase64 = await fileToBase64(file);
      const mimeType = file.type || (file.name.endsWith(".mp4") ? "audio/mp4" : "audio/mpeg");

      const { data, error } = await supabase.functions.invoke("analyze-call", {
        body: { audioBase64, mimeType },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data as AnalysisResult);
      toast.success("Analysis complete");
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <header className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 opacity-30">
          <img src={heroShield} alt="" className="w-full h-full object-cover" width={1536} height={1024} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 glass mb-6">
            <Sparkles className="w-3.5 h-3.5 text-google-yellow" />
            <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
              Google Solution Challenge 2026
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
            <span className="text-gradient-google animate-gradient inline-block">LurkGuard</span>
            <span className="text-foreground">-AI</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Real-time, unbiased AI that listens to phone calls, transcribes them, and tells you instantly
            whether the call is <span className="text-safe font-semibold">Safe</span>,{" "}
            <span className="text-suspicious font-semibold">Suspicious</span>, or{" "}
            <span className="text-fraud font-semibold">Fraud</span>.
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <TechBadge icon={Brain} label="Google Gemini 2.5" color="text-google-blue" />
            <TechBadge icon={Mic} label="Speech-to-Text" color="text-google-red" />
            <TechBadge icon={Cpu} label="Firebase Cloud" color="text-google-yellow" />
            <TechBadge icon={Shield} label="Unbiased AI" color="text-google-green" />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* UPLOAD */}
        <section
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0] ?? null);
          }}
          className={`relative rounded-3xl border-2 border-dashed p-10 md:p-16 text-center bg-gradient-card glass shadow-elegant transition-all ${
            dragOver ? "border-primary scale-[1.01] shadow-glow" : "border-border"
          }`}
        >
          <div className="absolute -top-px left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-google" />

          <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-google mb-6 animate-float">
            <div className="absolute inset-0 rounded-full animate-pulse-ring" />
            <Upload className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-2">Upload a Call Recording</h2>
          <p className="text-muted-foreground mb-6">
            Drop your <strong className="text-foreground">MP3</strong> or <strong className="text-foreground">MP4</strong> file here, or browse from your device
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".mp3,.mp4,audio/mpeg,audio/mp4,video/mp4"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => inputRef.current?.click()}
              className="px-6 py-3 rounded-xl bg-gradient-google text-white font-semibold shadow-glow hover:opacity-90 transition"
            >
              Choose File
            </button>
            {file && (
              <button
                onClick={analyze}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze Call
                  </>
                )}
              </button>
            )}
          </div>

          {file && (
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
              <FileAudio className="w-4 h-4 text-google-blue" />
              <span className="font-medium">{file.name}</span>
              <span className="text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </section>

        {/* RESULT */}
        {result && <ResultPanel result={result} />}

        {/* HOW IT WORKS */}
        {!result && (
          <section className="grid md:grid-cols-3 gap-4">
            <Step n={1} title="Upload" desc="Securely send your call recording (MP3/MP4)." />
            <Step n={2} title="Transcribe" desc="Google Gemini converts speech to text in real time." />
            <Step n={3} title="Detect" desc="Unbiased AI flags fraud patterns & explains why." />
          </section>
        )}
      </main>

      <footer className="border-t border-border/40 mt-20 py-8 text-center text-xs text-muted-foreground">
        Built with <span className="text-google-red">♥</span> using Google AI · LurkGuard-AI Prototype
      </footer>
    </div>
  );
}

function TechBadge({ icon: Icon, label, color }: { icon: typeof Shield; label: string; color: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 glass">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-card border border-border glass">
      <div className="w-10 h-10 rounded-full bg-gradient-google flex items-center justify-center font-bold text-white mb-3">
        {n}
      </div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function ResultPanel({ result }: { result: AnalysisResult }) {
  const cfg = verdictConfig[result.verdict];
  const Icon = cfg.icon;
  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Verdict card */}
      <div className={`relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br ${cfg.bg} p-8 shadow-elegant`}>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className={`shrink-0 w-24 h-24 rounded-2xl bg-background/40 border border-white/10 flex items-center justify-center ${cfg.color}`}>
            <Icon className="w-12 h-12" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">AI Verdict</div>
            <h3 className={`text-4xl md:text-5xl font-bold mb-2 ${cfg.color}`}>
              {cfg.emoji} {cfg.label}
            </h3>
            <p className="text-foreground/90 leading-relaxed">{result.summary}</p>
          </div>
          <div className="shrink-0 text-center md:text-right">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Confidence</div>
            <div className={`text-5xl font-bold ${cfg.color}`}>{Math.round(result.confidence)}%</div>
          </div>
        </div>
      </div>

      {/* Red flags */}
      {result.red_flags.length > 0 && (
        <div className="rounded-2xl border border-border bg-gradient-card glass p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-google-red" />
            Red Flags Detected
          </h4>
          <ul className="grid md:grid-cols-2 gap-2">
            {result.red_flags.map((flag, i) => (
              <li
                key={i}
                className="flex items-start gap-2 p-3 rounded-lg bg-fraud/10 border border-fraud/20 text-sm"
              >
                <span className="text-fraud mt-0.5">▸</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Explanation */}
      <div className="rounded-2xl border border-border bg-gradient-card glass p-6">
        <h4 className="font-bold mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5 text-google-blue" />
          AI Reasoning
        </h4>
        <p className="text-foreground/90 leading-relaxed">{result.explanation}</p>
      </div>

      {/* Transcript */}
      <div className="rounded-2xl border border-border bg-gradient-card glass p-6">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <Mic className="w-5 h-5 text-google-green" />
          Transcript {result.language && <span className="text-xs text-muted-foreground font-normal">({result.language})</span>}
        </h4>
        <div className="max-h-72 overflow-y-auto p-4 rounded-lg bg-background/40 border border-border text-sm leading-relaxed whitespace-pre-wrap">
          {result.transcript}
        </div>
        {result.translation && (
          <div className="mt-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">English Translation</div>
            <div className="max-h-48 overflow-y-auto p-4 rounded-lg bg-background/40 border border-border text-sm leading-relaxed whitespace-pre-wrap">
              {result.translation}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
