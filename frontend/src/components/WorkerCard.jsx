import API from "../../utils/api";

const WorkerCard = ({ worker, refresh }) => {
  const deleteWorker = async () => {
    const otp = prompt("Enter OTP to delete worker");
    await API.delete(`/agent/workers/${worker._id}`, { data: { otp } });
    refresh();
  };

  return (
    <div className="border p-3 rounded">
      <h3 className="font-bold">{worker.name}</h3>
      <p>{worker.phone}</p>
      <p>₹{worker.dailyWage}/day</p>
      <p>{worker.category.join(", ")}</p>

      <button onClick={deleteWorker} className="text-red-500 mt-2">
        Delete
      </button>
    </div>
  );
};

export default WorkerCard;
