import TeamCard from "./Cards/TeamCard";

const TeamList = ({ teams, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
    {teams.map((team) => (
      <TeamCard
        key={team._id}
        teamInfo={team}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);

export default TeamList;
