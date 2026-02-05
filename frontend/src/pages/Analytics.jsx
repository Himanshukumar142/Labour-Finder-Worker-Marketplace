const Analytics = ({ workers }) => {
  const today = new Date().toDateString();

  const todayCount = workers.filter(
    (w) => new Date(w.createdAt).toDateString() === today
  ).length;

  const weekCount = workers.filter(
    (w) =>
      new Date(w.createdAt) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="flex gap-4 mb-4">
      <div className="bg-green-100 p-4 rounded">
        <h3>Today Added</h3>
        <p className="text-xl">{todayCount}</p>
      </div>

      <div className="bg-blue-100 p-4 rounded">
        <h3>Last 7 Days</h3>
        <p className="text-xl">{weekCount}</p>
      </div>
    </div>
  );
};

export default Analytics;
