// ./frontend/src/components/AddTask.tsx

import React, { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { ALL_TASKS } from "../GQL/queries";
import { CREATE_TASK } from "../GQL/mutations";
import { useGqlQuery } from "../hooks/useGraphQL";

const AddTask: React.FC = () => {
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const navigate = useNavigate();
  const { save: addTask, loading: addTaskLoading } = useGqlQuery({ query: ALL_TASKS, mutation: CREATE_TASK });

  const handleAddTask = async () => {
    try {
      await addTask({ title, description, status, priority });
      showToast("Task added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to add task", err);
      showToast("Failed to add task");
    }
  };

  if (addTaskLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Add Task</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTask();
        }}
      >
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Title'
          required
        />
        <input
          type='text'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Description'
          required
        />
        <input
          type='text'
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder='Status'
          required
        />
        <input
          type='text'
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          placeholder='Priority'
          required
        />
        <button type='submit'>Add Task</button>
      </form>
    </div>
  );
};

export default AddTask;
