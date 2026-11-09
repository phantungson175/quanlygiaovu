// src/components/common/StatCard.jsx
const StatCard = ({ num, label, variant = 'primary' }) => (
  <div className={`stat-card ${variant}`}>
    <div className="stat-num">{num ?? '—'}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export default StatCard;
