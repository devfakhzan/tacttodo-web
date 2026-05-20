import { useMutation } from "@apollo/client";
import { SubmitEvent, useState } from "react";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../graphql/operations";
import { setToken } from "../lib/auth";
import { getErrorMessage } from "../lib/errors";
import type { AuthPayload } from "../types";

type AuthFormProps = {
  onSuccess: () => void;
};

type AuthMode = "login" | "signup";

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [login, { loading: loginLoading }] = useMutation<{ login: AuthPayload }>(
    LOGIN_MUTATION,
  );
  const [signup, { loading: signupLoading }] = useMutation<{ signup: AuthPayload }>(
    SIGNUP_MUTATION,
  );

  const loading = loginLoading || signupLoading;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      if (mode === "login") {
        const { data } = await login({
          variables: { email: email.trim(), password },
        });
        if (!data?.login) {
          setError("Something went wrong. Try again.");
          return;
        }
        setToken(data.login.token);
      } else {
        const { data } = await signup({
          variables: { email: email.trim(), password },
        });
        if (!data?.signup) {
          setError("Something went wrong. Try again.");
          return;
        }
        setToken(data.signup.token);
      }

      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong. Try again."));
    }
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex rounded-lg bg-[var(--color-canvas)] p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "login"
              ? "bg-[var(--color-surface)] text-[var(--color-ink)] shadow-sm"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
          }}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "signup"
              ? "bg-[var(--color-surface)] text-[var(--color-ink)] shadow-sm"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          }`}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15"
          />
          {mode === "signup" && (
            <p className="mt-1.5 text-xs text-[var(--color-muted)]">
              At least 6 characters.
            </p>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--color-danger)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Working..." : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
