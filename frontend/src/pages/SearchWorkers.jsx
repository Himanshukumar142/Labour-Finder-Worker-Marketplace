import React, { useState } from "react";
import api from "../utils/api";

// --- ICONS (Clean Stroke Style) ---
const MapPin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
const Phone = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);
const Star = ({ className, fill }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
const Briefcase = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);

// --- COMPONENTS ---

const BackgroundMesh = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/60 rounded-full blur-[100px] animate-blob"></div>
    <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/60 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-purple-100/60 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-multiply"></div>
  </div>
);

const SkeletonCard = () => (
  <div className="relative overflow-hidden p-6 rounded-3xl bg-white border border-slate-100 shadow-sm h-64">
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-slate-100/50 to-transparent"></div>
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-4">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
        <div className="space-y-2">
          <div className="h-5 w-32 bg-slate-100 rounded-md"></div>
          <div className="h-4 w-20 bg-slate-100 rounded-md"></div>
        </div>
      </div>
    </div>
    <div className="space-y-3 mt-4">
      <div className="h-4 w-full bg-slate-100 rounded-md"></div>
      <div className="h-4 w-2/3 bg-slate-100 rounded-md"></div>
    </div>
    <div className="mt-8 flex gap-3">
      <div className="h-10 flex-1 bg-slate-100 rounded-xl"></div>
      <div className="h-10 flex-1 bg-slate-100 rounded-xl"></div>
    </div>
  </div>
);

export default function WorkerHubLight() {
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [category, setCategory] = useState("");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  const categories = ["Plumber", "Electrician", "Labor", "Painter", "Carpenter", "Driver", "Cleaner", "Other"];

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError("");
        setLocationLoading(false);
      },
      () => {
        setError("Location permission denied");
        setLocationLoading(false);
      }
    );
  };

  const searchWorkers = async () => {
    if (!coords.lat || !coords.lng) {
      setError("Please detect your location first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // --- REAL API CALL ---
      const res = await api.post("/workers/nearby", {
        latitude: coords.lat,
        longitude: coords.lng,
        category,
      });
      setWorkers(res.data.workers);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch workers. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const getDistance = (lat1, lng1, lat2, lng2) => {
    if (!lat1 || !lat2) return "N/A";
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      <BackgroundMesh />

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-xl font-bold text-white">W</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Worker<span className="text-blue-600">Hub</span>
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href="/how-it-works" className="text-lg font-medium text-slate-500 hover:text-blue-600 transition-colors">How it Works</a>
              <a href="/freelancers" className="text-lg font-medium text-slate-500 hover:text-blue-600 transition-colors">Freelancers</a>
              <a href="#" className="text-lg font-medium text-slate-500 hover:text-blue-600 transition-colors">Find a Job</a>

            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Active in your area
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            Local talent, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x">
              within reach.
            </span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Connect with verified professionals instantly. Safe, reliable, and fast.
          </p>
        </div>

        {/* SEARCH BAR CARD */}
        <div className="max-w-4xl mx-auto relative group z-20 mb-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>

          <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-3 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row gap-3">

            {/* Location Button */}
            <button
              onClick={getLocation}
              disabled={locationLoading}
              className={`flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 text-left group/btn ${coords.lat
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
            >
              <div className={`p-2.5 rounded-xl transition-colors ${coords.lat ? "bg-green-100 text-green-600" : "bg-white text-slate-400 group-hover/btn:text-blue-500 shadow-sm"}`}>
                {locationLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider mb-0.5">Location</span>
                <span className="font-semibold text-sm truncate">{coords.lat ? "Location Set" : "Detect Location"}</span>
              </div>
            </button>

            {/* Category Select */}
            <div className="flex-[1.5] relative bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group/select border border-transparent">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-slate-400 group-hover/select:text-blue-500 transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-full pl-16 pr-10 py-4 bg-transparent text-slate-900 font-semibold appearance-none focus:outline-none cursor-pointer rounded-2xl z-10 relative"
              >
                <option value="">All Services</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={searchWorkers}
              disabled={loading}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-slate-900/20 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <SearchIcon className="w-5 h-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="absolute top-full left-0 right-0 mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-shake shadow-lg shadow-red-500/5">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </div>
          )}
        </div>

        {/* RESULTS GRID */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : workers.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  Results
                  <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-bold border border-slate-200">{workers.length}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workers.map((w, index) => (
                  <div
                    key={w._id}
                    className="group relative bg-white border border-slate-100 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Header */}
                    <div className="relative flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                          <span className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{w.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 leading-tight">{w.name}</h4>
                          <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                            {/* Assuming API returns rating/jobs, if not, use placeholder logic or conditional rendering */}
                            {w.rating ? (
                              <>
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" fill={true} />
                                <span className="font-bold text-slate-700">{w.rating}</span>
                                <span className="text-slate-400 text-xs">({w.jobs || 0} jobs)</span>
                              </>
                            ) : (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-medium">New Joiner</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Daily Rate</div>
                        <div className="text-xl font-bold text-slate-900">₹{w.dailyWage}</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {w.category.map((cat, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Location Info */}
                    <div className="flex items-center gap-3 text-slate-500 text-sm mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="truncate flex-1 font-medium">{w.location.address}</span>
                      {coords.lat && (
                        <span className="bg-white px-2 py-1 rounded-lg text-blue-600 font-bold text-xs shadow-sm border border-slate-100 whitespace-nowrap">
                          {getDistance(coords.lat, coords.lng, w.location.coordinates[1], w.location.coordinates[0])} km
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={`tel:${w.phone}`}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
                      >
                        <Phone className="w-4 h-4" /> Call
                      </a>
                      <a
                        href={`https://wa.me/${w.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            !loading && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg">Ready to search</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">Set your location and choose a category to find workers near you.</p>
              </div>
            )
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm font-medium">© 2026 WorkerHub Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors">Privacy</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* STYLES */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}