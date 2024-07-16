// ./frontend/src/components/AddTask.tsx

import React, { useState } from "react";
// import useApi from "../hooks/useApi";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import client from "../config/apollo/apollo";
import { useMutation } from "@apollo/client";
import { CREATE_TASK } from "../GQL/mutations";

const AddTask: React.FC = () => {
  // const { apiCall } = useApi();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const navigate = useNavigate();

  const [addTask, { loading, error }] = useMutation(CREATE_TASK, { client });

  const handleAddTask = async () => {
    try {
      await addTask({ variables: { title, description, status, priority } });
      showToast("Task added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to add task", err);
      showToast("Failed to add task");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

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
