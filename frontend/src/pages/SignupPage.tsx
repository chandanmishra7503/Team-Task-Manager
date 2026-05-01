import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";
import { Button, ErrorText, Input, Label, Select } from "../components/ui";

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 animate-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Start managing your team tasks 🚀</p>
        </div>
        <div className="bg-slate-950/40 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl p-8">
          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);

              try {
                await signup(email, password, role);
                navigate("/dashboard");
              } catch (err: any) {
                setError(err?.response?.data?.message || "Signup failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                minLength={8}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Your Role</Label>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="MEMBER" className="bg-slate-900">Team Member</option>
                <option value="ADMIN" className="bg-slate-900">Project Admin</option>
              </Select>
              <p className="text-[10px] text-slate-500 italic ml-1">
                Admins can create projects and assign tasks.
              </p>
            </div>
            {error && (
              <div className="pt-1">
                <ErrorText>{error}</ErrorText>
              </div>
            )}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-6 text-lg font-bold"
              disabled={loading}
            >
              {loading ? "Creating..." : "Join the Team"}
            </Button>
            <div className="text-center text-sm text-slate-500 pt-2">
              Already have an account?{" "}
              <Link
                className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4"
                to="/login"
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-8 uppercase tracking-[0.3em] font-black">
          Secure Registration • TeamTask
        </p>
      </div>
    </div>
  );
}