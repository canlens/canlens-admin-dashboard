export default function StatCard({ icon, value, label, color = 'blue', trend }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-header">
        <div className={`stat-card-icon stat-card-icon--${color}`}>{icon}</div>
        {trend !== undefined && (
          <span className={`stat-card-trend ${trend >= 0 ? 'stat-card-trend--up' : 'stat-card-trend--down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-glow" />
    </div>
  );
}
