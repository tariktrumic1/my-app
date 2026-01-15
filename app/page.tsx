"use client";

import { useEffect, useMemo, useState } from "react";
import Herotemp from "@/components/Herotemp";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

export default function Home() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Save whenever todos changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const remaining = useMemo(
    () => todos.filter((t) => !t.done).length,
    [todos]
  );

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

        <div className="flex justify-between text-sm text-gray-600">
          <span>{todos.length} total</span>
          <button className="underline hover:opacity-80" onClick={clearDone}>
            Clear done
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between rounded-xl border px-4 py-3"
            >
              <button
                className="flex items-center gap-3 text-left"
                onClick={() => toggleTodo(t.id)}
              >
                <span
                  className={[
                    "h-5 w-5 rounded border",
                    t.done ? "bg-black" : "bg-white",
                  ].join(" ")}
                />
                <span className={t.done ? "line-through text-gray-500" : ""}>
                  {t.text}
                </span>
              </button>

              <button
                className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                onClick={() => deleteTodo(t.id)}
              >
                Delete
              </button>
            </li>
          ))}

          {todos.length === 0 && (
            <li className="text-gray-600">No todos yet. Add your first one.</li>
          )}
        </ul>
      </section>
    </main>
  );
}
