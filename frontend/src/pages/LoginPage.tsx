import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";
import { Button, ErrorText, Input, Label } from "../components/ui";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 animate-in">
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Enter your credentials to manage your tasks
          </p>
        </div>
        <div className="bg-slate-950/40 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl p-8">
          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);

              try {
                await login(email, password);
                navigate("/dashboard");
              } catch (err: any) {
                setError(err?.response?.data?.message || "Login failed");
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
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>
            {error && <ErrorText>{error}</ErrorText>}
            <Button
              type="submit"
              className="w-full py-6 text-lg"
              disabled={loading}
              variant="primary"
            >
              {loading ? "Signing in..." : "Login to Account"}
            </Button>
            <div className="text-center text-sm text-slate-500">
              Don’t have an account?{" "}
              <Link
                className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors underline underline-offset-4"
                to="/signup"
              >
                Create one
              </Link>
            </div>
          </form>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-8 uppercase tracking-[0.3em] font-black">
          Secure Enterprise Access
        </p>
      </div>
    </div>
  );
}