// ./containers/LoginContainer.tsx

import React, { useState } from "react";
import Login from "../components/Login";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
// import useGraphQL from "../hooks/useGraphQL";
import client from "../config/apollo/apollo";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../GQL/mutations";

interface LoginContainerProps {
  setError: (error: string) => void;
  usernameError?: string | null;
  passwordError?: string | null;
  invalidError?: string | null;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ setError, usernameError, passwordError, invalidError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();
  // const { gqlRequest } = useGraphQL("/graphql");
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER, { client });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username.trim() === "") {
      setError("Username is required");
      return;
    }

    if (password.trim() === "") {
      setError("Password is required");
      return;
    }

    try {
      const { data } = await loginUser({ variables: { username, password } });
      const token = data?.login?.token;

      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
        showToast("Login Successful!");
      } else {
        setError("Invalid credentials");
        showToast("Login Failed!");
      }
    } catch (err) {
      console.error("Failed to login", err);
      setError("Failed to login");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <Login
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      usernameError={usernameError}
      passwordError={passwordError}
      invalidError={invalidError}
    />
  );
};

export default LoginContainer;
