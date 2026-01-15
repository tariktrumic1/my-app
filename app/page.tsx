"use client";

import { useEffect, useMemo, useState } from "react";
import Herotemp from "@/components/Herotemp";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

type Filter = "all" | "active" | "done";

export default function Home() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Load once
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const remaining = useMemo(() => todos.filter((t) => !t.done).length, [todos]);

  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "done") return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) return;

    setTodos((prev) => [
      { id: crypto.randomUUID(), text: clean, done: false },
      ...prev,
    ]);
    setText("");
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearDone() {
    setTodos((prev) => prev.filter((t) => !t.done));
  }

  function startEdit(t: Todo) {
    setEditingId(t.id);
    setEditText(t.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  function saveEdit(id: string) {
    const clean = editText.trim();
    if (!clean) return; // keep it simple: don't allow empty
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: clean } : t)));
    cancelEdit();
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <Herotemp
        title="My First Next.js App 🚀"
        subtitle={`Todo list with localStorage (remaining: ${remaining})`}
      />

      <section className="rounded-2xl border p-6 space-y-4">
        <form onSubmit={addTodo} className="flex gap-3">
          <input
            className="flex-1 rounded-xl border px-4 py-2 outline-none"
            placeholder="Add a todo…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90">
            Add
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <Tab label="All" active={filter === "all"} onClick={() => setFilter("all")} />
            <Tab
              label="Active"
              active={filter === "active"}
              onClick={() => setFilter("active")}
            />
            <Tab label="Done" active={filter === "done"} onClick={() => setFilter("done")} />
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{todos.length} total</span>
            <button className="underline hover:opacity-80" onClick={clearDone}>
              Clear done
            </button>
          </div>
        </div>

        <ul className="space-y-2">
          {visibleTodos.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
            >
              {/* Left side */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <button
                  className="h-5 w-5 shrink-0 rounded border"
                  aria-label="Toggle done"
                  onClick={() => toggleTodo(t.id)}
                  style={{ background: t.done ? "black" : "white" }}
                />

                {editingId === t.id ? (
                  <input
                    className="w-full rounded-lg border px-3 py-2 outline-none"
                    value={editText}
                    autoFocus
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(t.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                  />
                ) : (
                  <button
                    className="min-w-0 text-left"
                    onClick={() => toggleTodo(t.id)}
                    onDoubleClick={() => startEdit(t)}
                    title="Double-click to edit"
                  >
                    <span className={t.done ? "line-through text-gray-500" : ""}>
                      {t.text}
                    </span>
                  </button>
                )}
              </div>

              {/* Right side */}
              <div className="flex shrink-0 gap-2">
                {editingId === t.id ? (
                  <>
                    <button
                      className="rounded-lg bg-black px-3 py-1 text-sm text-white hover:opacity-90"
                      onClick={() => saveEdit(t.id)}
                    >
                      Save
                    </button>
                    <button
                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                      onClick={() => startEdit(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                      onClick={() => deleteTodo(t.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}

          {visibleTodos.length === 0 && (
            <li className="text-gray-600">Nothing here for this filter.</li>
          )}
        </ul>
      </section>
    </main>
  );
}

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl border px-3 py-1 text-sm",
        active ? "bg-black text-white" : "hover:bg-gray-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
