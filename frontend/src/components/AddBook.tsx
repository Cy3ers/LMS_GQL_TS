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
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

interface TaskFormInputs {
  title: string;
  description: string;
  status: string;
  priority: string;
}

const schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string().required("Status is required"),
  priority: Yup.string().required("Priority is required")
});

const AddTask: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields }
  } = useForm<TaskFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange"
  });
  const { save: addTask, loading: addTaskLoading } = useGqlQuery({ query: ALL_TASKS, mutation: CREATE_TASK });

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { data: subscriptionData, error: subscriptionError } = useSubscription<Notification>(
    NOTIFICATION_SUBSCRIPTION,
    {
      onSubscriptionData: ({ subscriptionData: { data }, ...rest }) => {
        const notification = data?.taskAdded;
        if (notification) {
          showToast(notification.message);
          setIsPopupOpen(true);
        }
      }
    }
  );

  subscriptionError && console.log(subscriptionError);

  const onSubmit: SubmitHandler<TaskFormInputs> = async (data) => {
    try {
      await addTask(data);
      // showToast("Task added successfully!");
      // navigate("/dashboard");
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  if (addTaskLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Add Task</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type='text'
          {...register("title")}
          placeholder='Title'
        />
        {errors.title && touchedFields.title && <p>{errors.title.message}</p>}
        <input
          type='text'
          {...register("description")}
          placeholder='Description'
        />
        {errors.description && touchedFields.description && <p>{errors.description.message}</p>}
        <input
          type='text'
          {...register("status")}
          placeholder='Status'
        />
        {errors.status && touchedFields.status && <p>{errors.status.message}</p>}
        <input
          type='text'
          {...register("priority")}
          placeholder='Priority'
        />
        {errors.priority && touchedFields.priority && <p>{errors.priority.message}</p>}
        <button
          className={`submit-btn ${!isValid ? "disabled" : ""}`}
          type='submit'
          disabled={!isValid}
        >
          Add Task
        </button>
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
