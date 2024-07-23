// ./components/UserList.tsx

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { User, UserListProps } from "../types";

interface UserFormInputs {
  username: string;
  password: string;
  search?: string;
}

const schema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  search: Yup.string()
});

const UserList: React.FC<UserListProps> = ({ users, addUser, removeUser }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
    reset
  } = useForm<UserFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const onSubmit: SubmitHandler<UserFormInputs> = (data) => {
    addUser({ username: data.username, password: data.password });
    reset({ username: "", password: "", search: data.search });
  };

  const searchQuery = watch("search", "");

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery ? searchQuery.toLowerCase() : "")
  );

  return (
    <div>
      <h2 className='input-header'>Add Users:</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username:</label>
          <input
            type='text'
            {...register("username")}
          />
          {errors.username && touchedFields.username && <p>{errors.username.message}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type='password'
            {...register("password")}
          />
          {errors.password && touchedFields.password && <p>{errors.password.message}</p>}
        </div>
        <button
          className={`submit-btn ${!isValid ? "disabled" : ""}`}
          type='submit'
          disabled={!isValid}
        >
          Add User
        </button>
      </form>
      <div>
        <h2 className='input-header'>Search Users:</h2>
        <div style={{ padding: "20px" }}>
          <input
            className='search-box'
            type='text'
            placeholder='Search by username'
            {...register("search")}
          />
        </div>
      </div>
      <div className='user-list'>
        <h2 className='li-header'>Users</h2>
        <ul>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user: User) => (
              <li key={user.username}>
                {user.username}{" "}
                <button
                  className='del-button'
                  onClick={() => user.id && removeUser(user.id)}
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <li>No users found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserList;
