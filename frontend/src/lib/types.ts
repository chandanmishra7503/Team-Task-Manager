export type Role = "ADMIN" | "MEMBER";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type AuthResponse = {
  token: string;
  userId: number;
  email: string;
  role: Role;
};

export type UserSummary = { id: number; email: string; role: Role };

export type Project = {
  id: number;
  title: string;
  description: string | null;
  createdBy: UserSummary;
  teamMembers: UserSummary[];
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  projectId: number;
  projectTitle: string;
  assignedTo: UserSummary;
  status: TaskStatus;
  dueDate: string | null;
  overdue: boolean;
};

export type DashboardResponse = {
  totalTasks: number;
  statusCounts: Record<TaskStatus, number>;
  overdueTasks: number;
  tasks: Task[];
  overdue: Task[];
};

