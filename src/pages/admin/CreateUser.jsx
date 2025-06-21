import React, { useState } from "react";
import { LuX } from "react-icons/lu";
import UserProfileForm from "../../components/UserProfileForm";

const CreateUser = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    newPassword: "",
    role: "member",
    bio: "",
    profileImageUrl: "",
  });

  const handleClose = () => {
    // Reset form data when closing
    setFormData({
      name: "",
      username: "",
      email: "",
      newPassword: "",
      role: "member",
      bio: "",
      profileImageUrl: "",
    });
    onClose();
  };

  const handleUserCreated = (newUser) => {
    // Reset form data
    setFormData({
      name: "",
      username: "",
      email: "",
      newPassword: "",
      role: "member",
      bio: "",
      profileImageUrl: "",
    });

    // Call parent callback with new user data
    if (onUserCreated) {
      onUserCreated(newUser);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Create New User</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <LuX size={24} />
          </button>
        </div>

        <div className="p-6">
          <UserProfileForm
            formData={formData}
            setFormData={setFormData}
            isCreateMode={true}
            onUpdateSuccess={handleUserCreated}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
