import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import axios from "axios";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError("");

    try {
      const response = await axios.post(BASE_URL + 
        API_PATHS.AUTH.LOGIN,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(
        "1212: ",
        response.data.user,
        "1313: ",
        response.data.message
      );
      const { role } = response.data.user;
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data.user);
      }

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else {
        setError("An unexpected error occured. Please try some time later.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in.
        </p>
        {successMsg && (
          <p className="text-green-700 text-base mb-3">{successMsg}</p>
        )}
        <form onSubmit={handleLogin}>
          <Input
            value={email}
            label="Email"
            type="email"
            placeholder="john@example.com"
            onChange={({ target }) => setEmail(target.value)}
          />

          <Input
            value={password}
            label="Password"
            type="password"
            placeholder="Your Password"
            onChange={({ target }) => setPassword(target.value)}
          />
          {error && <p className="text-red-500 text-sm pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">
            LOGIN
          </button>
          <p className="text-[15px] text-slate-800 mt-3">
            Don't have an account?
            <Link
              className="font-medium text-primary underline ml-2"
              to="/signup"
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
