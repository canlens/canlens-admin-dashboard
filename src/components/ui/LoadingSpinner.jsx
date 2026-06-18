export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-spinner-wrapper">
      <div className="loading-spinner">
        <div className="loading-spinner-ring" />
        <div className="loading-spinner-core" />
      </div>
      {message && <p className="loading-spinner-message">{message}</p>}
    </div>
  );
}
