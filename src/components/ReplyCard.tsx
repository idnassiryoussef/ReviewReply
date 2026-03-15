import { ClipboardDocumentCheckIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ReplyCardProps {
  reply: string;
  tone: string;
  loading: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
  onClear: () => void;
}

export function ReplyCard({ reply, tone, loading, onCopy, onRegenerate, onClear }: ReplyCardProps) {
  const characterCount = reply?.length ?? 0;

  return (
    <div className="glass rounded-3xl p-6 shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Suggested Reply</h2>
          <p className="mt-1 text-sm text-white/70">
            Tone: <span className="font-medium text-white">{tone}</span>
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
          {characterCount} chars
        </span>
      </div>

      <div className="mt-5 min-h-[170px] rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded-full bg-white/10 animate-pulse" />
            <div className="h-4 w-full rounded-full bg-white/10 animate-pulse" />
            <div className="h-4 w-5/6 rounded-full bg-white/10 animate-pulse" />
            <div className="h-4 w-2/3 rounded-full bg-white/10 animate-pulse" />
          </div>
        ) : reply ? (
          <p className="whitespace-pre-wrap leading-relaxed text-white/80">{reply}</p>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-sky-500/10" />
              <div className="absolute left-4 top-3 h-3 w-3 rounded-full bg-white/40" />
              <div className="absolute left-10 top-9 h-2 w-10 rounded-full bg-white/30" />
              <div className="absolute left-5 top-12 h-2 w-6 rounded-full bg-white/30" />
            </div>
            <p className="text-sm text-white/50">Paste a review above and click “Generate Reply” to see it here.</p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onCopy}
          disabled={!reply || loading}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ClipboardDocumentCheckIcon className="h-4 w-4" />
          Copy
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Regenerate
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={loading && !reply}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <TrashIcon className="h-4 w-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
