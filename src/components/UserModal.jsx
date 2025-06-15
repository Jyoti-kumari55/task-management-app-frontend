import React, { useContext, useEffect, useState } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";
import { useUserAuth } from "../hooks/useUserAuth";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import DashboardLayout from "./layouts/DashboardLayout";
import UserProfileForm from "./UserProfileForm";
import DeleteProfile from "./DeleteProfile";

const UserModal = () => {
  useUserAuth();

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fix: Ensure we always have a user ID
  const isAdminEditingOtherUser =
    user?.role === "admin" && id && user._id !== id;
  const editableUserId = isAdminEditingOtherUser ? id : user?._id;

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    profileImageUrl: "",
  });

  const [fetchingUser, setFetchingUser] = useState(true);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setFetchingUser(true);
        const response = await axiosInstance.get(
          API_PATHS.USERS.GET_USER_BY_ID(editableUserId)
        );
        const data = response.data?.user;

        if (data) {
          setUserToEdit(data);
          setFormData((prev) => ({
            ...prev,
            name: data.name || "",
            username: data.username || "",
            email: data.email || "",
            bio: data.bio || "",
            profileImageUrl: data.profileImageUrl || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error(
          error.response?.data?.message || "Failed to load user data."
        );
      } finally {
        setFetchingUser(false);
      }
    };

    if (user?._id) {
      fetchUser();
    }
  }, [editableUserId, user?._id]);

  const backClickHandler = () => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  const handleUpdateSuccess = () => {
    setTimeout(() => {
      if (user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    }, 1500);
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
              <h2 className="text-xl md:text-xl font-medium">
                {isAdminEditingOtherUser
                  ? "Edit User Profile"
                  : "Update Profile"}
              </h2>
            </div>

            {/* Profile Update Form */}
            <UserProfileForm
              formData={formData}
              setFormData={setFormData}
              editableUserId={editableUserId}
              isAdminEditingOtherUser={isAdminEditingOtherUser}
              onUpdateSuccess={handleUpdateSuccess}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserModal;
