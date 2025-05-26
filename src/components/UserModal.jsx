import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const UserModal = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const isAdminEditingOtherUser =
    user?.role === "admin" && id && user._id !== id;
  const editableUserId = isAdminEditingOtherUser ? id : user._id;

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    profileImageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.USERS.GET_USER_BY_ID(editableUserId)
        );
        const data = response.data?.user;
        setFormData((prev) => ({
          ...prev,
          name: data.name,
          username: data.username,
          email: data.email,
          bio: data.bio,
          profileImageUrl: data.profileImageUrl,
        }));
      } catch (err) {
        toast.error("Failed to load user data.");
      }
    };

    fetchUser();
  }, [editableUserId]);

  const backClickHandler = () => {
    navigate("/admin/dashboard");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImageUrl") {
      setFormData((prev) => ({ ...prev, profileImageUrl: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      let profileImageUrl = formData.profileImageUrl;

      // Upload image if file
      if (formData.profileImageUrl && typeof profileImageUrl === "object") {
        const imgData = new FormData();
        imgData.append("image", formData.profileImageUrl);
        console.log("Uploading image file: ", formData.profileImageUrl);
        console.log("Is file?", formData.profileImageUrl instanceof File);

        const uploadRes = await axiosInstance.post(
          API_PATHS.IMAGE.UPLOAD_IMAGE,
          imgData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        profileImageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        profileImageUrl: profileImageUrl,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      const apiPath = isAdminEditingOtherUser
        ? API_PATHS.USERS.UPDATE_ADMIN(editableUserId)
        : API_PATHS.USERS.UPDATE_USER(editableUserId);

      const response = await axiosInstance.put(apiPath, payload);

      setSuccessMsg(response.data.message || "Profile updated successfully!");
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/admin/dashboard",  {replace: true});
      window.location.reload();

      }, 1000);

      //    navigate("/admin/dashboard", { replace: true });
      // window.location.reload();
    } catch (error) {
      const msg = error.response?.data?.message || "Update failed.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout activeMenu="User Profile">
      <div className="mt-6">
        <button className="card-btn bg-primary" onClick={backClickHandler}>
          <LuArrowLeft className="text-base" />
          Go Back
        </button>
        <div className="grid grid-cols-1 md:grid-cols-4 mt-5">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">Update Profile</h2>
            </div>

            {successMsg && (
              <div className="text-green-600 my-2">{successMsg}</div>
            )}
            {errorMsg && <div className="text-red-600 my-2">{errorMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-8 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <label className="input-label">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="form-input"
                    type="text"
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="input-label">Username</label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="form-input"
                    type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <label className="input-label">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="form-input"
                    type="email"
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="input-label">Current Password</label>
                  <input
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Current Password"
                    className="form-input"
                    type="password"
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="input-label">New Password</label>
                  <input
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="New Password"
                    className="form-input"
                    type="password"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="input-label">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write your thought, about yourself..."
                  className="form-input"
                  rows={4}
                ></textarea>
              </div>

              <div className="mt-4">
                <label className="input-label">Profile Image</label>
                <input
                  type="file"
                  name="profileImageUrl"
                  onChange={handleChange}
                  placeholder="Upload your image"
                  className="form-input"
                />
                {/* <img src={formData.profileImageUrl} alt="Profile" width={100} /> */}
              </div>

              <div className="flex justify-end mt-7">
                <button
                  type="submit"
                  className="add-btn"
                  // onClick={taskSubmitHandler}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "UPDATE DETAILS"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserModal;
