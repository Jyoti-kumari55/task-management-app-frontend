import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import axios from "axios";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context/userContext";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState("");

//   const { updateUser } = useContext(UserContext);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     if (!password) {
//       setError("Please enter the password.");
//       return;
//     }

//     setError("");

//     try {
//       const response = await axios.post(BASE_URL +
//         API_PATHS.AUTH.LOGIN,
//         { email, password },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );
//       console.log(
//         "1212: ",
//         response.data.user,
//         "1313: ",
//         response.data.message
//       );
//       const { role } = response.data.user;
//       const { token } = response.data;
//       if (token) {
//         localStorage.setItem("token", token);
//         updateUser(response.data.user);
//       }

//       if (role === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/user/dashboard");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.message
//       ) {
//         setError(error.response.data.message);
//       } else if (error.code === "ECONNABORTED") {
//         setError("Request timed out. Please try again.");
//       } else {
//         setError("An unexpected error occured. Please try some time later.");
//       }
//     }
//   };

//   return (
//     <AuthLayout>
//       <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
//         <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
//         <p className="text-xs text-slate-700 mt-[5px] mb-6">
//           Please enter your details to log in.
//         </p>
//         {successMsg && (
//           <p className="text-green-700 text-base mb-3">{successMsg}</p>
//         )}
//         <form onSubmit={handleLogin}>
//           <Input
//             value={email}
//             label="Email"
//             type="email"
//             placeholder="john@example.com"
//             onChange={({ target }) => setEmail(target.value)}
//           />

//           <Input
//             value={password}
//             label="Password"
//             type="password"
//             placeholder="Your Password"
//             onChange={({ target }) => setPassword(target.value)}
//           />
//           {error && <p className="text-red-500 text-sm pb-2.5">{error}</p>}
//           <button type="submit" className="btn-primary">
//             LOGIN
//           </button>
//           <p className="text-[15px] text-slate-800 mt-3">
//             Don't have an account?
//             <Link
//               className="font-medium text-primary underline ml-2"
//               to="/signup"
//             >
//               SignUp
//             </Link>
//           </p>
//         </form>
//       </div>
//     </AuthLayout>
//   );
// };

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
      const response = await axios.post(
        BASE_URL + API_PATHS.AUTH.LOGIN,
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
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        <div className="min-h-screen flex flex-col justify-center py-8 sm:py-12">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-black mb-2">
              Welcome Back
            </h3>
            <p className="text-sm sm:text-base text-slate-700">
              Please enter your details to log in.
            </p>
          </div>

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 text-sm sm:text-base">
                {successMsg}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <Input
                value={email}
                label="Email"
                type="email"
                placeholder="john@example.com"
                onChange={({ target }) => setEmail(target.value)}
                className="w-full"
              />

              <Input
                value={password}
                label="Password"
                type="password"
                placeholder="Your Password"
                onChange={({ target }) => setPassword(target.value)}
                className="w-full"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-base font-medium rounded-md transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              LOGIN
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-sm sm:text-base text-slate-800">
                Don't have an account?
                <Link
                  className="font-medium text-primary underline ml-2 hover:text-primary-dark transition-colors duration-200"
                  to="/signup"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
