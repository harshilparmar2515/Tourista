import { motion } from "framer-motion";

const ChartCard = ({ title, children, description }) => {
  return (
    <motion.div
      className="chart-card card-elevated"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="chart-card-header">
        <div>
          <h4>{title}</h4>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
      <div className="chart-card-body">{children}</div>
    </motion.div>
  );
};

export default ChartCard;
