const StatusCard = ({ icon, label, value, accent }) => {
  return (
    <div className={`status-card ${accent}`}>
      <div className="status-card-icon">{icon}</div>
      <div className="status-card-copy">
        <p>{label}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
};

export default StatusCard;
