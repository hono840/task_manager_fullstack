"use client";

import React, { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const Page = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetch("http://localhost:4000/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("APIリクエストに失敗しました");
        }
        return response.json();
      })
      .then((data) => setTasks(data))
      .catch((error) => console.error("エラーが発生", error));
  }, []);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: newTask }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("タスク作成に失敗しました");
        }
        return response.json();
      })
      .then((createdTask) => {
        setTasks([...tasks, createdTask]);
        setNewTask({ title: "", description: "" });
      })
      .catch((error) => console.error("エラーが発生しました", error));
  };

  return (
    <div className="flex flex-col gap-7 flex-direwction-col items-center justify-center pt-10">
      <div>
        <h1>タスク管理</h1>
        {tasks.length === 0 ? (
          <p>タスクがありません</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <p>{task.completed ? "完了" : "未完了"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2>新しいタスクを作成</h2>
        <form className="flex flex-col gap-4" onSubmit={addTask}>
          <div>
            <label>タイトル</label>
            <input
              type="text"
              className="text-gray-900 p-1"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
          </div>
          <div>
            <label>説明</label>
            <textarea
              className="text-gray-900 p-1"
              value={newTask.description}
              onChange={(e) => {
                setNewTask({ ...newTask, description: e.target.value });
              }}
            />
          </div>
          <button
            className="bg-green-500 disabled:bg-gray-500 disabled:hover:cursor-not-allowed"
            type="submit"
            disabled={!newTask.title || !newTask.description}
          >
            タスク追加
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
