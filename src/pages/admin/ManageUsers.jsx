import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuSquarePlus, LuX } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import TeamCard from "../../components/Cards/TeamCard";
import toast from "react-hot-toast";
import SelectUsers from "../../components/Cards/SelectUsers";
import TeamModal from "../../components/TeamModal";
import UserList from "../../components/UserList";
import TeamList from "../../components/TeamList";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (res.data?.users?.length) setAllUsers(res.data.users);
    } catch (error) {
      console.error("Error in fetching users:", error.message);
      toast.error(error?.response?.data?.error || "Failed to fetch users");
    }
  };

  const getAllTeams = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TEAMS.GET_ALL_TEAMS);
      if (res.data?.teams) setAllTeams(res.data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error.message);
      toast.error(error?.response?.data?.error || "Failed to fetch team");
    }
  };

  const handleSubmit = async () => {
    try {
      if (modalMode === "create") {
        const res = await axiosInstance.post(API_PATHS.TEAMS.CREATE_TEAM, {
          teamName,
          description,
          members: selectedUsers,
        });
        toast.success(res?.data?.message || "Team created");
      } else {
        const res = await axiosInstance.put(
          API_PATHS.TEAMS.UPDATE_TEAM(selectedTeam._id),
          {
            teamName,
            description,
            members: selectedUsers,
          }
        );
        toast.success(res?.data?.message || "Team updated");
      }
      resetModal();
      getAllTeams();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to save team");
    }
  };

  const handleDelete = async (teamId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await axiosInstance.delete(
        API_PATHS.TEAMS.DELETE_TEAM(teamId)
      );
      toast.success(res?.data?.message || "Team deleted");
      getAllTeams();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to delete team");
    }
  };

  const openModalForEdit = (team) => {
    setSelectedTeam(team);
    setTeamName(team.teamName);
    setDescription(team.description);
    setSelectedUsers(team.members.map((m) => m._id));
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const resetModal = () => {
    setSelectedTeam(null);
    setTeamName("");
    setDescription("");
    setSelectedUsers([]);
    setModalMode("create");
    setIsModalOpen(false);
  };

  useEffect(() => {
    getAllUsers();
    getAllTeams();
  }, []);

  return (
    <DashboardLayout activeMenu="Team">
      <div className="mt-5 mb-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Team Members</h2>
          <button
            className="flex add-btn2"
            onClick={() => setIsModalOpen(true)}
          >
            <LuSquarePlus className="text-lg" />
            Create Team
          </button>
        </div>

        <UserList users={allUsers} />
        <h2 className="text-xl font-medium pt-6">Teams</h2>
        <TeamList
          teams={allTeams}
          onEdit={openModalForEdit}
          onDelete={handleDelete}
        />

        <TeamModal
          isOpen={isModalOpen}
          mode={modalMode}
          teamName={teamName}
          description={description}
          selectedUsers={selectedUsers}
          setTeamName={setTeamName}
          setDescription={setDescription}
          setSelectedUsers={setSelectedUsers}
          onClose={resetModal}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
