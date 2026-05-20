import { useMutation } from "@apollo/client";
import {
  DELETE_TODO_MUTATION,
  TOGGLE_TODO_MUTATION,
  TODOS_QUERY,
} from "../graphql/operations";
import type { Todo } from "../types";

type TodoItemProps = {
  todo: Todo;
};

export function TodoItem({ todo }: TodoItemProps) {
  const [toggleTodo, { loading: toggling }] = useMutation(TOGGLE_TODO_MUTATION, {
    refetchQueries: [{ query: TODOS_QUERY }],
  });

  const [deleteTodo, { loading: deleting }] = useMutation(DELETE_TODO_MUTATION, {
    refetchQueries: [{ query: TODOS_QUERY }],
  });

  const busy = toggling || deleting;

  return (
    <li className="group flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition hover:border-stone-300">
      <button
        type="button"
        disabled={busy}
        onClick={() => toggleTodo({ variables: { id: todo.id } })}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
          todo.completed
            ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
            : "border-stone-300 bg-white hover:border-[var(--color-accent)]"
        } disabled:opacity-50`}
      >
        {todo.completed && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
            <path
              d="M2 6l2.5 2.5L10 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm leading-relaxed ${
            todo.completed
              ? "text-[var(--color-muted)] line-through"
              : "text-[var(--color-ink)]"
          }`}
        >
          {todo.title}
        </p>
        <time
          dateTime={todo.createdAt}
          className="mt-1 block text-xs text-[var(--color-muted)]"
        >
          {new Date(todo.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={() => deleteTodo({ variables: { id: todo.id } })}
        aria-label={`Delete ${todo.title}`}
        className="shrink-0 rounded px-2 py-1 text-xs text-[var(--color-muted)] opacity-0 transition hover:bg-red-50 hover:text-[var(--color-danger)] group-hover:opacity-100 disabled:opacity-50"
      >
        Delete
      </button>
    </li>
  );
}
