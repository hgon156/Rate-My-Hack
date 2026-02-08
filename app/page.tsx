"use client";

import { useState } from "react";

export default function HomePage() {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<{
    error?: string;
    score?: number;
    phrase?: string;
    reasons?: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tagline, description }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Request failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const getScoreStyle = (score: number) => {
    if (score >= 5) return "bg-green-600 text-white";
    if (score >= 4) return "bg-emerald-500 text-white";
    if (score >= 3) return "bg-amber-500 text-black";
    if (score >= 2) return "bg-orange-500 text-white";
    return "bg-red-600 text-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-slate-800 border border-slate-600 p-6 rounded-xl shadow-2xl">
        <img
          src="/logo.png"
          alt="Rate-My-Hack Logo"
          className="h-12 mx-auto mb-2 opacity-90"
        />
        <h1 className="text-3xl font-black text-center mb-1 text-white">
          Rate-My-Hack
        </h1>
        <p className="text-slate-400 text-center text-sm mb-6">
          {"ratemyhack.online \u00B7 Paste your Devpost. Get the verdict."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Tagline (one-liner)"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            required
          />
          <textarea
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg h-32 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            placeholder="Project description (paste from Devpost...)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Judging..." : "Get Verdict"}
          </button>
        </form>

        {result && !loading && (
          <div className="mt-6 p-4 rounded-lg bg-slate-700/50 border border-slate-600">
            {result.error ? (
              <p className="text-red-400 font-medium">
                {"Error: "}
                {result.error}
              </p>
            ) : (
              <>
                <div
                  className={`inline-block px-4 py-2 rounded-lg text-lg font-bold mb-3 ${getScoreStyle(result.score ?? 0)}`}
                >
                  {result.score}
                  {" \u2013 "}
                  {result.phrase}
                </div>
                <p className="text-slate-300 font-semibold mb-2 text-sm">
                  Why:
                </p>
                <ul className="flex flex-col gap-1">
                  {result.reasons &&
                    result.reasons.map((r, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-slate-400 text-sm"
                      >
                        <span className="text-amber-500">
                          {"\u2022"}
                        </span>{" "}
                        {r}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
