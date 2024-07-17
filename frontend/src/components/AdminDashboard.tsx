// ./components/AdminDashboard.tsx

import React, { useEffect } from "react";
import { logout } from "../auth";
import { Task } from "../types";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { ALL_TASKS } from "../GQL/queries";
import { DELETE_TASK } from "../GQL/mutations";
import { useGqlQuery } from "../hooks/useGraphQL";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading, data, refetch } = useGqlQuery<{ tasks: Task[] }, { input: Task }>({ query: ALL_TASKS });
  const { save: deleteTask } = useGqlQuery({ query: ALL_TASKS, mutation: DELETE_TASK });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDeleteTask = async (id: number) => {
    await deleteTask({ id: id });
    refetch();
    showToast("Task deleted successfully!");
  };

  if (loading) return <p>Loading...</p>;

  const tasks: Task[] = data?.tasks || [];

  return (
    <div>
      <h1 className='navbar'>Admin Dashboard</h1>
      <br />
      {/* Route Here */}
      <button
        className='nav-button'
        onClick={() => {
          navigate("/dashboard/book");
        }}
      >
        Add Tasks
      </button>
      <button
        className='nav-button'
        onClick={() => {
          navigate("/dashboard/user");
        }}
      >
        Add Users
      </button>
      <button
        className='nav-button'
        onClick={() => {
          navigate("/dashboard/pass");
        }}
      >
        Change Password
      </button>
      <button
        className='nav-button'
        onClick={logout}
      >
        Logout
      </button>
      <div className='book-list'>
        <h2 className='li-header'>Task List</h2>
        <ul>
          {tasks &&
            tasks.map((task: Task) => (
              <li key={task.id}>
                <div className='title'>{task.title}</div>
                <div className='description'>{task.description}</div>
                <div className='status'>{task.status}</div>
                <div className='priority'>{task.priority}</div>
                <div>
                  <button
                    className='submit-btn'
                    onClick={() => {
                      handleDeleteTask(task.id);
                    }}
                  >
                    Delete Task
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
