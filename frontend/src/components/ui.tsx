import React from "react";

/**
 * Corrected Card: 
 * Title is now bright white, and description text is light slate for high contrast.
 */
export function Card({
  title,
  children,
  right,
  className = "",
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl transition-all hover:border-slate-700 ${className}`}>
      {(title || right) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="text-lg font-bold tracking-tight text-white">
              {title}
            </h2>
          ) : (
            <div />
          )}
          {right}
        </div>
      )}
      <div className="text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
}

/**
 * Corrected Label: 
 * Brightened to slate-400 so it is clearly visible against the dark background[cite: 1].
 */
export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 ${className}`}>
      {children}
    </label>
  );
}

/**
 * Corrected Input: 
 * Text color is now slate-100 (near white) with a deeper background for better focus[cite: 1].
 */
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600",
        "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:bg-[#111827]",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 min-h-[120px]",
        "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:bg-[#111827]",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

/**
 * Corrected Button: 
 * Enhanced secondary variant with lighter text for better visibility[cite: 1].
 */
export function Button({
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const styles =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/40"
      : variant === "danger"
        ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white"
        : "border border-slate-800 bg-slate-900 text-slate-100 hover:bg-slate-800 hover:border-slate-600";

  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold transition-all active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        styles,
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition-all appearance-none cursor-pointer",
        "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function ErrorText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-400 border border-rose-500/20 animate-in ${className}`}>
      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {children}
    </div>
  );
}