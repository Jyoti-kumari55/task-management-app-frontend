import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Input from "../../components/inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";

// const SignUp = () => {
//   const [profilePic, setProfilePic] = useState(null);
//   const [fullname, setFullName] = useState("");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [bio, setBio] = useState("");
//   const [password, setPassword] = useState("");
//   const [adminInviteToken, setAdminInviteToken] = useState("");
//   const [error, setError] = useState(null);

//   const { updateUser } = useContext(UserContext);

//   const navigate = useNavigate();

//   const handleSignUp = async (e) => {
//     e.preventDefault();

//     let profileImageUrl = "";
//     if (!fullname) {
//       setError("Please enter full name.");
//       return;
//     }

//     if (!username) {
//       setError("Please enter unique username.");
//       return;
//     }

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
//       if (profilePic) {
//         const imgUploadRes = await uploadImage(profilePic);
//         profileImageUrl = imgUploadRes.imageUrl || "";
//       }
//       const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
//         name: fullname,
//         username,
//         email,
//         password,
//         bio,
//         profileImageUrl,
//         adminInviteToken,
//       });

//       const { role } = response.data.user;
//       const { token } = response.data;
//       if (token) {
//         localStorage.setItem("token", token);
//         updateUser(response.data);

//         if (role === "admin") {
//           navigate("/admin/dashboard");
//         } else {
//           navigate("/user/dashboard");
//         }
//       }
//     } catch (error) {
//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.message
//       ) {
//         setError(error.response.data.message);
//       } else {
//         setError("An unexpected error occured. Please try some time later.");
//       }
//     }
//   };

//   return (
//     <AuthLayout>
//       <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
//         <h3 className="text-xl font-semibold text-black ">Create an Account</h3>
//         <p className="text-xs text-slate-700 mt-[5px] mb-6">
//           Join us today by entering your detailsbelow.
//         </p>
//         <form onSubmit={handleSignUp}>
//           <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               value={fullname}
//               onChange={({ target }) => setFullName(target.value)}
//               label="Full Name"
//               placeholder="John"
//               type="text"
//             />
//             <Input
//               value={username}
//               onChange={({ target }) => setUsername(target.value)}
//               label="Username"
//               placeholder="john00_walk"
//               type="text"
//             />
//             <Input
//               value={email}
//               onChange={({ target }) => setEmail(target.value)}
//               label="Email"
//               placeholder="john@example.com"
//               type="text"
//             />
//             <Input
//               value={password}
//               onChange={({ target }) => setPassword(target.value)}
//               label="Password"
//               placeholder="Min 8 Characters"
//               type="password"
//             />

//             <Input
//               value={bio}
//               onChange={({ target }) => setBio(target.value)}
//               label="Bio"
//               placeholder="Write about yourself."
//               type="text"
//             />

//             <Input
//               value={adminInviteToken}
//               onChange={({ target }) => setAdminInviteToken(target.value)}
//               label="Admin Invite Token"
//               placeholder="6 Digit Code"
//               type="text"
//             />
//           </div>

//           {error && <p className="text-red-500 text-sm pb-2.5">{error}</p>}
//           <button type="submit" className="btn-primary">
//             SIGNUP
//           </button>
//           <p className="text-[15px] text-slate-800 mt-3">
//             Already have an account?
//             <Link
//               className="font-medium text-primary underline ml-2"
//               to="/login"
//             >
//               Login
//             </Link>
//           </p>
//         </form>
//       </div>
//     </AuthLayout>
//   );
// };

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";
    if (!fullname) {
      setError("Please enter full name.");
      return;
    }

    if (!username) {
      setError("Please enter unique username.");
      return;
    }

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
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullname,
        username,
        email,
        password,
        bio,
        profileImageUrl,
        adminInviteToken,
      });
      toast.success(response.data.message);
      navigate("/login");
      // const { role } = response.data.user;
      // const { token } = response.data;
      // if (token) {
      //   localStorage.setItem("token", token);
      //   updateUser(response.data);

      //   if (role === "admin") {
      //     navigate("/admin/dashboard");
      //   } else {
      //     navigate("/user/dashboard");
      //   }
      // }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occured. Please try some time later.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-4xl">
        <div className="min-h-screen flex flex-col justify-center py-8 sm:py-12">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h3 className="text-base md:text-lg  font-semibold text-black mb-2">
              Create an Account
            </h3>
            <p className="text-xs md:text-sm text-slate-700">
              Join us today by entering your details below.
            </p>
          </div>

          {/* SignUp Form */}
          <form onSubmit={handleSignUp} className="space-y-6 sm:space-y-8">
            {/* Profile Photo Selector */}
            <div className="flex justify-center sm:justify-start">
              <ProfilePhotoSelector
                image={profilePic}
                setImage={setProfilePic}
                className="mb-4 sm:mb-6"
              />
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <Input
                  value={fullname}
                  onChange={({ target }) => setFullName(target.value)}
                  label="Full Name"
                  placeholder="John"
                  type="text"
                  className="w-full"
                />

                <Input
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  label="Email"
                  placeholder="john@example.com"
                  type="email"
                  className="w-full"
                />

                <Input
                  value={bio}
                  onChange={({ target }) => setBio(target.value)}
                  label="Bio"
                  placeholder="Write about yourself."
                  type="text"
                  className="w-full"
                />
              </div>

              <div className="space-y-4 sm:space-y-6">
                <Input
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                  label="Username"
                  placeholder="john00_walk"
                  type="text"
                  className="w-full"
                />

                <Input
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  label="Password"
                  placeholder="Min 8 Characters"
                  type="password"
                  className="w-full"
                />

                <Input
                  value={adminInviteToken}
                  onChange={({ target }) => setAdminInviteToken(target.value)}
                  label="Admin Invite Token"
                  placeholder="6 Digit Code"
                  type="text"
                  className="w-full"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-base font-medium rounded-md transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                SIGN UP
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-sm sm:text-base text-slate-800">
                Already have an account?
                <Link
                  className="font-medium text-primary underline ml-2 hover:text-primary-dark transition-colors duration-200"
                  to="/login"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
