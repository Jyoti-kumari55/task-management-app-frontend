import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const DeleteProfile = ({
  userId,
  userName,
  isAdminDeleting = false,
  onDeleteSuccess,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteProfile = async () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(userId));

      toast.success("Profile deleted successfully");
      setShowConfirmModal(false);

      // Call parent success handler
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("Delete error:", error);
      const msg = error.response?.data?.message || "Failed to delete profile.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = () => {
    setShowConfirmModal(true);
    setConfirmText("");
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmText("");
  };

  return (
    <>
      <div className="mt-8 p-4 border border-red-200 rounded-lg bg-red-50">
        <h3 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h3>
        <p className="text-red-600 text-sm mb-4">
          {isAdminDeleting
            ? `Delete this user's account permanently. This action cannot be undone.`
            : "Delete your account permanently. This action cannot be undone and will remove all your data."}
        </p>
        <button
          onClick={openConfirmModal}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          <MdDeleteOutline className="text-lg" />
          {isAdminDeleting ? "Delete User" : "Delete My Account"}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              Confirm Account Deletion
            </h3>

            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                {isAdminDeleting
                  ? `Are you sure you want to delete ${userName}'s account?`
                  : "Are you sure you want to delete your account?"}
              </p>
              <p className="text-red-600 text-sm mb-4">
                This action is permanent and cannot be undone. All data
                associated with this account will be lost.
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-red-600">DELETE</span> to
                confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeConfirmModal}
                disabled={loading}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                disabled={loading || confirmText !== "DELETE"}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteProfile;
