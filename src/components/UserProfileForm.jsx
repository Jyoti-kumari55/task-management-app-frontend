import React, { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const UserProfileForm = ({
  formData,
  setFormData,
  editableUserId,
  isAdminEditingOtherUser,
  onUpdateSuccess,
}) => {
  const [loading, setLoading] = useState(false);

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
    try {
      let profileImageUrl = formData.profileImageUrl;

      // Upload image if file
      if (formData.profileImageUrl && typeof profileImageUrl === "object") {
        const imgData = new FormData();
        imgData.append("image", formData.profileImageUrl);

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
      };

      // Only include password fields if they're provided
      if (formData.currentPassword && formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const apiPath = isAdminEditingOtherUser
        ? API_PATHS.USERS.UPDATE_ADMIN(editableUserId)
        : API_PATHS.USERS.UPDATE_USER(editableUserId);

      const response = await axiosInstance.put(apiPath, payload);

      toast.success(response.data.message || "Profile updated successfully!");

      // Clear password fields after successful update
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));

      // Call parent success handler
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-8 gap-4 mt-4">
        <div className="col-span-8 md:col-span-4">
          <label className="input-label">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="form-input"
            type="text"
            required
          />
        </div>

        <div className="col-span-8 md:col-span-4">
          <label className="input-label">Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="form-input"
            type="text"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 md:col-span-4">
          <label className="input-label">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="form-input"
            type="email"
            required
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="input-label">Current Password</label>
          <input
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Current Password "
            className="form-input"
            type="password"
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="input-label">New Password</label>
          <input
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password "
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
          placeholder="Write your thoughts about yourself..."
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
          accept="image/*"
          className="form-input"
        />
        {formData.profileImageUrl &&
          typeof formData.profileImageUrl === "string" && (
            <div className="mt-2">
              <img
                src={formData.profileImageUrl}
                alt="Profile"
                className="w-20 h-20 object-cover rounded-full"
              />
            </div>
          )}
      </div>

      <div className="flex justify-end mt-7">
        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Updating..." : "UPDATE DETAILS"}
        </button>
      </div>
    </form>
  );
};

export default UserProfileForm;
