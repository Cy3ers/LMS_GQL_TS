// ./frontend/src/components/AddTask.tsx

import React, { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { ALL_TASKS } from "../GQL/queries";
import { CREATE_TASK } from "../GQL/mutations";
import { useGqlQuery } from "../hooks/useGraphQL";
import { NOTIFICATION_SUBSCRIPTION } from "../GQL/subscriptions";
import { Notification } from "../types/Notification";
import { useSubscription } from "@apollo/client";

const AddTask: React.FC = () => {
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const navigate = useNavigate();
  const { save: addTask, loading: addTaskLoading } = useGqlQuery({ query: ALL_TASKS, mutation: CREATE_TASK });

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { data: subscriptionData, error: subscriptionError } = useSubscription<Notification>(
    NOTIFICATION_SUBSCRIPTION,
    {
      onSubscriptionData: ({ subscriptionData: { data }, ...rest }) => {
        console.log(data); // Log the data part of subscriptionData
        console.log(rest); // Log the rest part
        const notification = data?.taskAdded;
        console.log(`Notification: ${notification?.message}`); // Log the message to check if it's correct
        if (notification) {
          showToast(notification.message);
          setIsPopupOpen(true); // Open the popup when a new notification is received
        }
      }
    }
  );

  subscriptionError && console.log(subscriptionError);

  const handleAddTask = async () => {
    try {
      await addTask({ title, description, status, priority });
      // showToast("Task added successfully!");
      // navigate("/dashboard");
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    } catch (err) {
      console.error("Failed to add task", err);
      // showToast("Failed to add task");
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
      {isPopupOpen && (
        <div className='notification-popup'>
          <h3>New Notifications</h3>
          <ul>{subscriptionData?.taskAdded && <li>{subscriptionData.taskAdded.message}</li>}</ul>
          <button onClick={() => setIsPopupOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default AddTask;
