"use client";

import Image from "next/image";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { CircleX, Sun } from "lucide-react";
import axios from "axios";

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Récupération des todos lors du chargement
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:3003/todos");
        setTodos(response.data);
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };

    fetchTodos();
  }, []);
  console.log(todos);

  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;

    try {
      const response = await axios.post(
        "http://localhost:3003/todos",
        { text: newTodo },
        { headers: { "Content-Type": "application/json" } }
      );
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleTodoCompletion = async (_id: string) => {
    try {
      const todo = todos.find((todo) => todo._id === _id);
      if (!todo) return;

      const updatedTodo = { ...todo, completed: !todo.completed };
      const response = await axios.put(`http://localhost:3003/todos/${_id}`, {
        completed: updatedTodo.completed,
      });

      setTodos(todos.map((todo) => (todo._id === _id ? response.data : todo)));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const handleDeleteTodo = async (_id: string) => {
    try {
      await axios.delete(`http://localhost:3003/todos/${_id}`);
      setTodos(todos.filter((todo) => todo._id !== _id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const clearCompleted = async () => {
    try {
      const completedTodos = todos.filter((todo) => todo.completed);
      for (const todo of completedTodos) {
        await axios.delete(`http://localhost:3003/todos/${todo._id}`);
      }
      setTodos(todos.filter((todo) => !todo.completed));
    } catch (err) {
      console.error("Error clearing completed todos:", err);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <>
      <main className="relative w-full h-[400px]">
        <Image
          src="/bg-desktop-dark.jpg"
          alt="Chaise haute Chicco"
          fill
          priority
          style={{ objectFit: "cover" }}
          className="absolute"
        />
      </main>
      <div className="max-w-2xl mx-auto relative z-10 mt-[-200px]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-5xl font-black text-white">TODO</h1>
          <Sun className="text-white" />
        </div>
        <div className="bg-gray-800 mx-auto shadow-2xs flex items-center cursor-pointer py-5 pb-7 mb-7 text-white">
          <input className="peer w-5 h-5 ml-3" type="radio" disabled />
          <form onSubmit={handleAddTodo} className="flex w-full">
            <input
              type="text"
              className="ml-2 bg-gray-800 p-2 rounded text-white w-full focus:outline-none"
              value={newTodo}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewTodo(e.target.value)
              }
              placeholder="Create a new todo..."
            />
          </form>
        </div>
        <div className="bg-gray-800 mx-auto">
          <ul>
            {filteredTodos.map((todo) => (
              <li
                key={todo._id}
                className={`flex items-center cursor-pointer py-5 text-white border-b border-gray-600 ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                <input
                  className="peer w-5 h-5 ml-3 rounded-full bg-gray-700 border-2 border-gray-600 checked:bg-blue-600 focus:outline-none"
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoCompletion(todo._id)}
                />
                <label
                  htmlFor={`todo-${todo._id}`}
                  className="ml-2 text-xl cursor-pointer"
                >
                  {todo.text}
                </label>
                <button
                  onClick={() => handleDeleteTodo(todo._id)}
                  className="ml-auto mr-4 text-red-500 hover:text-red-700"
                >
                  <CircleX />
                </button>
              </li>
            ))}
            <li className="bg-gray-800 flex justify-between items-center py-5 px-4 text-white">
              <p>
                {filteredTodos.filter((todo) => !todo.completed).length} items
                lefts
              </p>
              <ul className="flex space-x-4">
                <li
                  className={`cursor-pointer ${
                    filter === "all" ? "text-blue-600" : ""
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All
                </li>
                <li
                  className={`cursor-pointer ${
                    filter === "active" ? "text-blue-600" : ""
                  }`}
                  onClick={() => setFilter("active")}
                >
                  Active
                </li>
                <li
                  className={`cursor-pointer ${
                    filter === "completed" ? "text-blue-600" : ""
                  }`}
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </li>
              </ul>
              <button className="text-blue-600" onClick={clearCompleted}>
                Clear Completed
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
