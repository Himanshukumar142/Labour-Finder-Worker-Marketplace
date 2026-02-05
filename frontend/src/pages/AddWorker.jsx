import { useState } from "react";
import API from "../../utils/api";

const AddWorker = ({ refresh }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: [],
    dailyWage: "",
    latitude: "",
    longitude: "",
    address: "",
    otp: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    try {
      // 1. Get the token from storage
      const token = localStorage.getItem("token"); 

      // 2. Send the request with the Authorization header
      // Note: Headers are the 3rd argument in axios.post
      await API.post("/agent/workers", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Worker Added");
      refresh(); // Refresh the list
      
      // Optional: Clear the form after success
      setForm({
        name: "", phone: "", category: [], dailyWage: "", 
        latitude: "", longitude: "", address: "", otp: "" 
      });

    } catch (error) {
      console.error("Error adding worker:", error);
      alert("Failed to add worker. You might be logged out.");
    }
  };
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Add Worker</h2>

      <input name="name" placeholder="Name" onChange={handleChange} className="input" />
      <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
      <input name="dailyWage" placeholder="Daily Wage" onChange={handleChange} className="input" />
      <input name="otp" placeholder="OTP" onChange={handleChange} className="input" />
      <input name="latitude" placeholder="Latitude" onChange={handleChange} className="input" />
      <input name="longitude" placeholder="Longitude" onChange={handleChange} className="input" />
      <input name="address" placeholder="Address" onChange={handleChange} className="input" />

      <select
        multiple
        onChange={(e) =>
          setForm({
            ...form,
            category: [...e.target.selectedOptions].map((o) => o.value),
          })
        }
        className="input"
      >
        <option>Plumber</option>
        <option>Electrician</option>
        <option>Labor</option>
        <option>Driver</option>
      </select>

      <button onClick={handleAdd} className="btn mt-2">
        Add Worker
      </button>
    </div>
  );
};

export default AddWorker;
