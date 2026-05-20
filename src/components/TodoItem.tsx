import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  DELETE_TODO_MUTATION,
  TODOS_QUERY,
  TOGGLE_TODO_MUTATION,
  UPDATE_TODO_MUTATION,
} from "../graphql/operations";
import type { Todo } from "../types";

type TodoItemProps = {
  todo: Todo;
};

export function TodoItem({ todo }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  const [toggleTodo, { loading: toggling }] = useMutation(TOGGLE_TODO_MUTATION, {
    refetchQueries: [{ query: TODOS_QUERY }],
  });

  const [deleteTodo, { loading: deleting }] = useMutation(DELETE_TODO_MUTATION, {
    refetchQueries: [{ query: TODOS_QUERY }],
  });

  const [updateTodo, { loading: updating }] = useMutation(UPDATE_TODO_MUTATION, {
    refetchQueries: [{ query: TODOS_QUERY }],
  });

  useEffect(() => {
    if (!editing) {
      setDraft(todo.title);
    }
  }, [todo.title, editing]);

  const busy = toggling || deleting || updating;

  async function saveEdit() {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(todo.title);
      setEditing(false);
      return;
    }

    if (trimmed !== todo.title) {
      await updateTodo({ variables: { id: todo.id, title: trimmed } });
    }

    setEditing(false);
  }

  function cancelEdit() {
    setDraft(todo.title);
    setEditing(false);
  }

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
        {editing ? (
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => void saveEdit()}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void saveEdit();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                cancelEdit();
              }
            }}
            autoFocus
            disabled={busy}
            className="w-full rounded border border-[var(--color-border)] bg-white px-2 py-1 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={`block w-full text-left text-sm leading-relaxed ${
              todo.completed
                ? "text-[var(--color-muted)] line-through"
                : "text-[var(--color-ink)]"
            }`}
          >
            {todo.title}
          </button>
        )}
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

      <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
        {!editing && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setEditing(true)}
            className="rounded px-2 py-1 text-xs text-[var(--color-muted)] hover:bg-stone-100 hover:text-[var(--color-ink)] disabled:opacity-50"
          >
            Edit
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => deleteTodo({ variables: { id: todo.id } })}
          aria-label={`Delete ${todo.title}`}
          className="rounded px-2 py-1 text-xs text-[var(--color-muted)] hover:bg-red-50 hover:text-[var(--color-danger)] disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
