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
  const [show, setShow] = useState(false);

  // タスク一覧取得
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

  // タスク追加
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

  // タスク更新
  const updateTask = () => {
    setShow(true);
  };

  // タスク削除
  const deleteTask = (id: number) => {
    setShow(false);
    fetch(`http://localhost:4000/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("タスクの削除に失敗しました");
        }
        setTasks((tasks) => tasks.filter((task) => task.id !== id));
      })
      .catch((error) => console.error("エラーが発生しました", error));
  };

  const closeEditTask = () => {
    setShow(false);
  };

  return (
    <div className="flex flex-col gap-7 items-center justify-center pt-10 max-w-3xl mx-auto">
      <div className="flex flex-col gap-4 bg-slate-700 p-7 rounded-lg shadow-lg w-full">
        <h1 className="text-2xl font-bold text-white">タスク管理</h1>
        {tasks.length === 0 ? (
          <p className="text-white">タスクがありません</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-slate-800 p-4 rounded-lg shadow flex justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {task.title}
                  </h2>
                  <p className="text-white">{task.description}</p>
                  <p
                    className={`text-sm ${
                      task.completed ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {task.completed ? "完了" : "未完了"}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-28 font-bold"
                    onClick={() => deleteTask(task.id)}
                  >
                    削除
                  </button>
                  <button
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-28 font-bold"
                    onClick={updateTask}
                  >
                    編集
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* タスク編集 */}
      {show && (
        <div className="bg-slate-700 p-7 rounded-lg shadow-lg w-full">
          <h2 className="text-xl font-bold text-white mb-4">タスク編集</h2>
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-white mb-1">タイトル</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-200 text-gray-900"
                onChange={(e) => console.log(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-white mb-1">説明</label>
              <textarea
                className="w-full p-2 rounded bg-gray-200 text-gray-900"
                onChange={(e) => console.log(e.target.value)}
              />
            </div>
            <div className="flex gap-4 flex-1">
              <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-28 font-bold">
                タスク更新
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-28 font-bold"
                onClick={closeEditTask}
              >
                閉じる
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 新しいタスクを作成 */}
      <div className="bg-slate-700 p-7 rounded-lg shadow-lg w-full mt-5">
        <h2 className="text-xl font-bold text-white mb-4">
          新しいタスクを作成
        </h2>
        <form className="flex flex-col gap-4" onSubmit={addTask}>
          <div>
            <label className="block text-white mb-1">タイトル</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-200 text-gray-900"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-white mb-1">説明</label>
            <textarea
              className="w-full p-2 rounded bg-gray-200 text-gray-900"
              value={newTask.description}
              onChange={(e) => {
                setNewTask({ ...newTask, description: e.target.value });
              }}
            />
          </div>
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-500 disabled:hover:cursor-not-allowed font-bold"
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
