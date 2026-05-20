import { useMutation, useQuery } from "@apollo/client";
import { SubmitEvent, useState } from "react";
import {
  CREATE_TODO_MUTATION,
  TODOS_QUERY,
} from "../graphql/operations";
import { getErrorMessage } from "../lib/errors";
import type { Todo } from "../types";
import { TodoItem } from "./TodoItem";

type TodoListProps = {
  email: string;
};

export function TodoList({ email }: TodoListProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const {
    data: todosData,
    loading: todosLoading,
    error: todosError,
  } = useQuery<{ todos: Todo[] }>(TODOS_QUERY);

  const [createTodo, { loading: creating }] = useMutation(CREATE_TODO_MUTATION, {
    refetchQueries: [{ query: TODOS_QUERY }],
  });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    setError(null);
    try {
      await createTodo({ variables: { title: trimmed } });
      setTitle("");
    } catch (err) {
      setError(getErrorMessage(err, "Could not create todo."));
    }
  }

  const todos = todosData?.todos ?? [];

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm sm:p-5"
      >
        <label htmlFor="todo-title" className="sr-only">
          New todo
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="todo-title"
            type="text"
            placeholder="What needs doing?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15"
          />
          <button
            type="submit"
            disabled={creating || !title.trim()}
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:shrink-0"
          >
            {creating ? "Adding..." : "Add"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-[var(--color-danger)]">{error}</p>
        )}
      </form>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-medium text-[var(--color-ink)]">
            Your todos
          </h2>
          {email && (
            <span className="truncate text-xs text-[var(--color-muted)]">
              {email}
            </span>
          )}
        </div>

        {todosLoading && (
          <p className="text-sm text-[var(--color-muted)]">Loading todos...</p>
        )}

        {todosError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--color-danger)]">
            {todosError.message}
          </p>
        )}

        {!todosLoading && !todosError && todos.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 text-center">
            <p className="text-sm text-[var(--color-muted)]">
              No todos yet. Add one above.
            </p>
          </div>
        )}

        {!todosLoading && todos.length > 0 && (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
