import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

interface LoginFormInputs {
  username: string;
  password: string;
}

interface LoginProps {
  handleSubmit: SubmitHandler<LoginFormInputs>;
  invalidError?: string | null;
}

const schema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required")
});

const Login: React.FC<LoginProps> = ({ handleSubmit, invalidError }) => {
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors, isValid, touchedFields }
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  return (
    <div>
      <h2 className='navbar'>Login</h2>
      <form onSubmit={formSubmit(handleSubmit)}>
        <label>Username:</label>
        <input
          type='text'
          {...register("username")}
        />
        {errors.username && touchedFields.username && <div className='error-msg'>{errors.username.message}</div>}
        <label>Password:</label>
        <input
          type='password'
          {...register("password")}
        />
        {errors.password && touchedFields.password && <div className='error-msg'>{errors.password.message}</div>}
        {invalidError && <div className='error-msg'>{invalidError}</div>}
        <button
          className={`submit-btn ${!isValid ? "disabled" : ""}`}
          type='submit'
          disabled={!isValid}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
