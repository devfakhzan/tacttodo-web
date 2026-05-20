import { useApolloClient } from "@apollo/client";
import { Layout } from "../components/Layout";
import { TodoList } from "../components/TodoList";
import { clearToken } from "../lib/auth";

type TodosPageProps = {
  onLogout: () => void;
};

export function TodosPage({ onLogout }: TodosPageProps) {
  const client = useApolloClient();

  function handleLogout() {
    clearToken();
    void client.clearStore();
    onLogout();
  }

  return (
    <Layout
      title="TactTodo"
      subtitle="Your personal task list."
      actions={
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-muted)] transition hover:border-stone-300 hover:text-[var(--color-ink)]"
        >
          Log out
        </button>
      }
    >
      <TodoList />
    </Layout>
  );
}
