import { motion } from "framer-motion";

const DashboardCard = ({ icon, title, value, subtitle, accent }) => {
  return (
    <motion.div
      className={`dashboard-stat-card ${accent || "accent-neutral"}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="stat-card-icon">{icon}</div>
      <div>
        <p className="stat-card-label">{title}</p>
        <h3 className="stat-card-value">{value}</h3>
        {subtitle ? <small className="stat-card-subtitle">{subtitle}</small> : null}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
