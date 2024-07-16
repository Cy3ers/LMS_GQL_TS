// ./containers/UserListContainer.tsx

import React, { useEffect } from "react";
import UserList from "../components/UserList";
import { useToast } from "../contexts/ToastContext";
import { User } from "../types";
import { useMutation } from "@apollo/client";
import { ALL_USERS } from "../GQL/queries";
import { REGISTER_USER, DELETE_USER } from "../GQL/mutations";
import client from "../config/apollo/apollo";
import useGraphQL from "../hooks/useGraphQL";

const UserListContainer: React.FC = () => {
  const { showToast } = useToast();
  const { data: allUsersData, loading: allUsersLoading, refetch: refetchAllUsers } = useGraphQL({ query: ALL_USERS });
  const [addUserMutation] = useMutation(REGISTER_USER, { client });
  const [deleteUserMutation] = useMutation(DELETE_USER, { client });

  useEffect(() => {
    refetchAllUsers();
  }, [refetchAllUsers]);

  const addUser = async (user: { username: string; password: string }) => {
    try {
      await addUserMutation({ variables: user });
      refetchAllUsers();
      showToast("User Added Successfully!");
    } catch (err) {
      console.error("Error adding user:", err);
      showToast("Failed to add user.");
    }
  };

  const removeUser = async (username: string) => {
    const user = allUsersData?.users.find((user: User) => user.username === username);
    if (!user) {
      showToast("User not found.");
      return;
    }

    try {
      await deleteUserMutation({ variables: { id: user.id } });
      refetchAllUsers();
      showToast("User Deleted Successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      showToast("Failed to delete user.");
    }
  };

  if (allUsersLoading) return <p>Loading...</p>;

  return (
    <UserList
      users={allUsersData?.users || []}
      addUser={addUser}
      removeUser={removeUser}
    />
  );
};

export default UserListContainer;
