import { useQuery } from "@apollo/client";
import { useCallback, useState } from "react";
import { ME_QUERY } from "./graphql/operations";
import { clearToken, getToken } from "./lib/auth";
import type { User } from "./types";
import { AuthPage } from "./pages/AuthPage";
import { TodosPage } from "./pages/TodosPage";

export function App() {
  const [hasToken, setHasToken] = useState(() => Boolean(getToken()));

  const { data, loading, refetch } = useQuery<{ me: User | null }>(ME_QUERY, {
    skip: !hasToken,
  });

  const handleAuthSuccess = useCallback(() => {
    setHasToken(true);
    void refetch();
  }, [refetch]);

  const handleLogout = useCallback(() => {
    setHasToken(false);
  }, []);

  if (hasToken) {
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <p className="text-sm text-[var(--color-muted)]">Loading...</p>
        </div>
      );
    }

    if (!data?.me) {
      clearToken();
      setHasToken(false);
      return <AuthPage onSuccess={handleAuthSuccess} />;
    }

    return <TodosPage onLogout={handleLogout} email={data.me.email} />;
  }

  return <AuthPage onSuccess={handleAuthSuccess} />;
}
