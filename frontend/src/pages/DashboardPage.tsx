import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { DashboardResponse, Project, TaskStatus } from "../lib/types";
import { Button, Card, Select } from "../components/ui";

const statuses: Array<{ label: string; value: TaskStatus | "" }> = [
  { label: "All statuses", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
];

export function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<number | "">("");
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (projectId !== "") params.set("projectId", String(projectId));
    const s = params.toString();
    return s ? `?${s}` : "";
  }, [status, projectId]);

  async function load() {
    setLoading(true);
    try {
      const [pRes, dRes] = await Promise.all([
        api.get<Project[]>("/api/projects"),
        api.get<DashboardResponse>(`/api/dashboard${query}`),
      ]);
      setProjects(pRes.data);
      setData(dRes.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [query]);

  const counts = data?.statusCounts;

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-slate-400 font-medium">
            Monitor team progress and task distribution.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md p-1 rounded-xl border border-slate-800">
            <Select 
              value={projectId} 
              onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : "")}
              className="border-none bg-transparent focus:ring-0 text-sm font-semibold text-slate-200"
            >
              <option value="" className="bg-slate-900">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900">{p.title}</option>
              ))}
            </Select>
            <div className="h-4 w-[1px] bg-slate-700" />
            <Select 
              value={status} 
              onChange={(e) => setStatus((e.target.value as any) || "")}
              className="border-none bg-transparent focus:ring-0 text-sm font-semibold text-slate-200"
            >
              {statuses.map((s) => (
                <option key={s.label} value={s.value} className="bg-slate-900">{s.label}</option>
              ))}
            </Select>
          </div>
          <Button 
            onClick={() => load()} 
            disabled={loading}
            variant="primary"
            className="rounded-xl px-6"
          >
            {loading ? "..." : "Refresh"}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Tasks", value: data?.totalTasks, color: "border-indigo-500", glow: "shadow-indigo-500/10" },
          { label: "Pending", value: counts?.PENDING, color: "border-amber-500", glow: "shadow-amber-500/10" },
          { label: "In Progress", value: counts?.IN_PROGRESS, color: "border-blue-500", glow: "shadow-blue-500/10" },
          { label: "Completed", value: counts?.COMPLETED, color: "border-emerald-500", glow: "shadow-emerald-500/10" }
        ].map((stat) => (
          <div key={stat.label} className={`bg-slate-950/40 backdrop-blur-xl rounded-2xl border-l-4 ${stat.color} p-6 border-y border-r border-slate-800 shadow-2xl ${stat.glow} transition-all group`}>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-white">{stat.value ?? "0"}</span>
              <div className={`w-2 h-2 rounded-full ${stat.color.replace('border-', 'bg-')} opacity-20 group-hover:opacity-100 transition-opacity`} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-slate-950/40 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            Recent Activity
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase">Live</span>
          </h2>
          <div className="space-y-4">
            {data?.tasks?.length ? (
              data.tasks.slice(0, 10).map((t) => (
                <div key={t.id} className="group rounded-xl border border-slate-800/50 bg-slate-900/20 p-4 hover:border-slate-700 hover:bg-slate-900/40 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{t.title}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span className="text-slate-400">{t.projectTitle}</span>
                        <span>•</span>
                        <span>{t.assignedTo.email.split('@')[0]}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight border ${
                        t.status === 'COMPLETED' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {t.status}
                      </span>
                      {t.overdue && (
                        <span className="text-[10px] font-bold bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full border border-rose-500/20 animate-pulse">
                          OVERDUE
                        </span>
                      )}
                    </div>
                  </div>
                  {t.dueDate && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {t.dueDate}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-600 text-sm italic">No recent activity.</div>
            )}
          </div>
        </div>
        <div className="bg-rose-950/10 backdrop-blur-xl rounded-2xl border border-rose-900/30 p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-rose-500 mb-6 flex items-center gap-2">
            Priority Alerts
            <span className="text-xs font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">{data?.overdueTasks ?? "0"}</span>
          </h2>
          <div className="space-y-4">
            {data?.overdue?.length ? (
              data.overdue.slice(0, 10).map((t) => (
                <div key={t.id} className="rounded-xl border border-rose-900/50 bg-slate-900/40 p-4 hover:border-rose-500/30 transition-all">
                  <div className="text-sm font-bold text-slate-100 mb-1">{t.title}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-medium text-rose-400/80 uppercase tracking-wide">
                      {t.projectTitle} • {t.assignedTo.email.split('@')[0]}
                    </div>
                    <div className="text-[11px] font-bold text-rose-500 bg-rose-500/10 px-2 rounded-md">
                      {t.dueDate ?? "—"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-600 text-sm italic font-medium">All caught up!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}