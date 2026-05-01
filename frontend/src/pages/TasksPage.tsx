import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { Project, Task, TaskStatus, UserSummary } from "../lib/types";
import { useAuth } from "../state/auth";
import { Button, Card, Input, Label, Select, Textarea } from "../components/ui";

const allStatuses: TaskStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED"];

export function TasksPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const [projectId, setProjectId] = useState<number | "">("");
  const [status, setStatus] = useState<TaskStatus | "">("");

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newProjectId, setNewProjectId] = useState<number | "">("");
  const [newAssignedTo, setNewAssignedTo] = useState<number | "">("");
  const [newDueDate, setNewDueDate] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (projectId !== "") params.set("projectId", String(projectId));
    return params.toString() ? `?${params.toString()}` : "";
  }, [status, projectId]);

  async function load() {
    setLoading(true);
    try {
      const [pRes, tRes] = await Promise.all([
        api.get<Project[]>("/api/projects"),
        api.get<Task[]>(`/api/tasks${query}`),
      ]);

      setProjects(pRes.data);
      setTasks(tRes.data);

      if (isAdmin) {
        const uRes = await api.get<UserSummary[]>("/api/users");
        setUsers(uRes.data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [query, isAdmin]);

  const grouped = useMemo(() => {
    const g: Record<TaskStatus, Task[]> = {
      PENDING: [],
      IN_PROGRESS: [],
      COMPLETED: [],
    };
    tasks.forEach((t) => g[t.status].push(t));
    return g;
  }, [tasks]);

  async function updateStatus(taskId: number, next: TaskStatus) {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status: next });
      await load();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Update failed");
    }
  }

  async function deleteTask(taskId: number) {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      await load();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Delete failed");
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-end">
        <div>
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="text-sm text-gray-500">
            {isAdmin
              ? "Assign tasks across projects."
              : "Manage your assigned tasks."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={projectId}
            onChange={(e) =>
              setProjectId(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </Select>

          <Select
            value={status}
            onChange={(e) => setStatus((e.target.value as any) || "")}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </Select>

          <Button onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>
      {isAdmin && (
        <Card title="Create Task">
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={async (e) => {
              e.preventDefault();

              if (!newProjectId || !newAssignedTo) return;

              await api.post("/api/tasks", {
                title: newTitle,
                description: newDesc,
                projectId: newProjectId,
                assignedToUserId: newAssignedTo,
                dueDate: newDueDate || null,
              });

              setNewTitle("");
              setNewDesc("");
              setNewProjectId("");
              setNewAssignedTo("");
              setNewDueDate("");

              await load();
            }}
          >
            <div>
              <Label>Title</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>

            <div>
              <Label>Project</Label>
              <Select
                value={newProjectId}
                onChange={(e) =>
                  setNewProjectId(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                required
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Assign To</Label>
              <Select
                value={newAssignedTo}
                onChange={(e) =>
                  setNewAssignedTo(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                required
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.email} ({u.role})
                  </option>
                ))}
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </Card>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {allStatuses.map((s) => (
          <Card key={s} title={s}>
            {grouped[s].length ? (
              grouped[s].map((t) => (
                <div key={t.id} className="border p-3 rounded mb-2">

                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{t.title}</div>
                      <div className="text-xs text-gray-500">
                        {t.projectTitle} • {t.assignedTo.email}
                      </div>
                    </div>

                    {t.overdue && (
                      <span className="text-xs text-red-600">OVERDUE</span>
                    )}
                  </div>

                  {t.description && (
                    <div className="text-sm mt-1">{t.description}</div>
                  )}

                  {t.dueDate && (
                    <div className="text-xs text-gray-500 mt-1">
                      Due: {t.dueDate}
                    </div>
                  )}

                  <div className="mt-3 space-y-2">
                    <Select
                      value={t.status}
                      onChange={(e) =>
                        updateStatus(t.id, e.target.value as TaskStatus)
                      }
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </Select>

                    {isAdmin && (
                      <Button
                        className="bg-red-500 text-white w-full"
                        onClick={() => deleteTask(t.id)}
                      >
                        Delete Task
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No tasks</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}