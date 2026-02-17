"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
       const [url, setUrl] = useState("");
       const [alias, setAlias] = useState("");
       const [isLoading, setIsLoading] = useState(false);
       const [error, setError] = useState("");
       const [shortUrl, setShortUrl] = useState("");
       const [copied, setCopied] = useState(false);

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              setIsLoading(true);
              setError("");
              setShortUrl("");
              setCopied(false);

              try {
                     const res = await fetch("/api/shorten", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ original_url: url, custom_alias: alias || undefined }),
                     });

                     const data = await res.json();

                     if (!res.ok) {
                            throw new Error(data.error || "Something went wrong");
                     }

                     setShortUrl(`${window.location.origin}/r/${data.short_code}`);
              } catch (err: any) {
                     setError(err.message);
              } finally {
                     setIsLoading(false);
              }
       };

       const copyToClipboard = () => {
              navigator.clipboard.writeText(shortUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
       };

       return (
              <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                     <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-8">
                            <div className="text-center space-y-2">
                                   <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                                          Cloud<span className="text-indigo-600">Link</span>
                                   </h1>
                                   <p className="text-slate-500">Simplify your links in seconds.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                   <div className="space-y-2">
                                          <label htmlFor="url" className="text-sm font-medium text-slate-700">
                                                 Long URL
                                          </label>
                                          <input
                                                 id="url"
                                                 type="url"
                                                 required
                                                 placeholder="https://example.com/very/long/url"
                                                 value={url}
                                                 onChange={(e) => setUrl(e.target.value)}
                                                 className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                          />
                                   </div>

                                   <div className="space-y-2">
                                          <div className="flex justify-between items-center">
                                                 <label htmlFor="alias" className="text-sm font-medium text-slate-700">
                                                        Custom Alias <span className="text-slate-400 font-normal">(Optional)</span>
                                                 </label>
                                          </div>
                                          <input
                                                 id="alias"
                                                 type="text"
                                                 placeholder="my-custom-link"
                                                 value={alias}
                                                 onChange={(e) => setAlias(e.target.value)}
                                                 pattern="^[a-zA-Z0-9-_]+$"
                                                 title="Alphanumeric characters, hyphens, and underscores only"
                                                 className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                          />
                                   </div>

                                   {error && (
                                          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100 animate-pulse">
                                                 {error}
                                          </div>
                                   )}

                                   <button
                                          type="submit"
                                          disabled={isLoading}
                                          className={cn(
                                                 "w-full py-4 px-6 rounded-lg text-white font-bold text-lg shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                                                 isLoading
                                                        ? "bg-slate-400 cursor-not-allowed"
                                                        : "bg-indigo-600 hover:bg-indigo-700"
                                          )}
                                   >
                                          {isLoading ? (
                                                 <span className="flex items-center justify-center space-x-2">
                                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>Shortening...</span>
                                                 </span>
                                          ) : (
                                                 "Shorten URL"
                                          )}
                                   </button>
                            </form>

                            {shortUrl && (
                                   <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                          <div className="space-y-1">
                                                 <label className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                                                        Your Short Link
                                                 </label>
                                                 <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-slate-200">
                                                        <a
                                                               href={shortUrl}
                                                               target="_blank"
                                                               rel="noopener noreferrer"
                                                               className="flex-1 text-indigo-600 font-medium truncate hover:underline"
                                                        >
                                                               {shortUrl}
                                                        </a>
                                                 </div>
                                          </div>

                                          <button
                                                 onClick={copyToClipboard}
                                                 className={cn(
                                                        "w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2",
                                                        copied
                                                               ? "bg-green-100 text-green-700 border border-green-200"
                                                               : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                                                 )}
                                          >
                                                 {copied ? (
                                                        <>
                                                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                               <span>Copied!</span>
                                                        </>
                                                 ) : (
                                                        <>
                                                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z"></path></svg>
                                                               <span>Copy to Clipboard</span>
                                                        </>
                                                 )}
                                          </button>
                                   </div>
                            )}
                     </div>
              </main>
       );
}
