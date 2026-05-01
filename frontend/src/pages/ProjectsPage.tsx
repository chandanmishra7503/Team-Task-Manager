import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { Project, UserSummary } from "../lib/types";
import { useAuth } from "../state/auth";
import { Button, Card, Input, Label, Select, Textarea } from "../components/ui";

export function ProjectsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [memberIds, setMemberIds] = useState<number[]>([]);

  const selectableUsers = useMemo(
    () => users.filter((u) => u.id !== user?.userId),
    [users, user?.userId],
  );

  async function load() {
    setLoading(true);
    try {
      const pRes = await api.get<Project[]>("/api/projects");
      setProjects(pRes.data);
      if (isAdmin) {
        const uRes = await api.get<UserSummary[]>("/api/users");
        setUsers(uRes.data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [isAdmin]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold">Projects</div>
        <div className="text-sm text-slate-600">
          {isAdmin
            ? "Create projects and manage team membership."
            : "Projects you are a member of."}
        </div>
      </div>

      {isAdmin && (
        <Card title="Create project">
          <form
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              await api.post("/api/projects", {
                title,
                description,
                memberIds,
              });
              setTitle("");
              setDescription("");
              setMemberIds([]);
              await load();
            }}
          >
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label>Team members (optional)</Label>
              <Select
                multiple
                value={memberIds.map(String)}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
                  setMemberIds(selected);
                }}
                className="h-28"
              >
                {selectableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.email} ({u.role})
                  </option>
                ))}
              </Select>
              <div className="mt-1 text-xs text-slate-500">Hold Ctrl/Cmd to select multiple.</div>
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>
                Create project
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {projects.map((p) => (
          <Card
            key={p.id}
            title={p.title}
            right={
              isAdmin ? (
                <Button
                  variant="danger"
                  onClick={async () => {
                    await api.delete(`/api/projects/${p.id}`);
                    await load();
                  }}
                >
                  Delete
                </Button>
              ) : null
            }
          >
            {p.description ? <div className="text-sm text-slate-700">{p.description}</div> : null}
            <div className="mt-3 text-xs text-slate-500">
              Created by {p.createdBy.email} ({p.createdBy.role})
            </div>

            <div className="mt-4">
              <div className="mb-2 text-sm font-semibold">Team members</div>
              <div className="flex flex-wrap gap-2">
                {p.teamMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs"
                  >
                    <span>
                      {m.email} ({m.role})
                    </span>
                    {isAdmin && m.id !== p.createdBy.id && (
                      <button
                        className="text-rose-600 hover:underline"
                        onClick={async () => {
                          await api.delete(`/api/projects/${p.id}/members/${m.id}`);
                          await load();
                        }}
                        title="Remove member"
                      >
                        remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isAdmin && (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    defaultValue=""
                    onChange={async (e) => {
                      const uid = Number(e.target.value);
                      if (!uid) return;
                      await api.post(`/api/projects/${p.id}/members`, { userId: uid });
                      e.currentTarget.value = "";
                      await load();
                    }}
                  >
                    <option value="">Add member...</option>
                    {users
                      .filter((u) => !p.teamMembers.some((m) => m.id === u.id))
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.email} ({u.role})
                        </option>
                      ))}
                  </Select>
                  <div className="text-xs text-slate-500">
                    Members must exist as users (signup first).
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}

        {!projects.length && (
          <Card title="No projects">
            <div className="text-sm text-slate-600">
              {isAdmin
                ? "Create your first project above."
                : "You haven’t been added to any projects yet."}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

