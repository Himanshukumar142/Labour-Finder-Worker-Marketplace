import React, { useState } from "react";
import { Link } from "react-router-dom";

// --- ICONS ---
const Search = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const MapPin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const Star = ({ className, fill }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const ShieldCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);
const Heart = ({ className, fill }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);
const SlidersHorizontal = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>
);

// --- BACKGROUND (Consistent Theme) ---
const BackgroundMesh = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50">
    <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px] animate-blob"></div>
    <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
    <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-purple-100/40 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
  </div>
);

// --- MOCK DATA ---
const freelancers = [
  {
    id: 1,
    name: "Aarav Patel",
    role: "Senior Full Stack Developer",
    location: "Mumbai, India",
    rating: 5.0,
    reviews: 53,
    rate: 35,
    bio: "Expert in MERN stack with 8+ years of experience building scalable SaaS platforms. I focus on clean code and performance optimization.",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    verified: true,
    img: "bg-gradient-to-br from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "UI/UX Designer",
    location: "London, UK",
    rating: 4.9,
    reviews: 120,
    rate: 55,
    bio: "Award-winning designer specializing in mobile-first interfaces and user research. I turn complex logic into simple, beautiful designs.",
    skills: ["Figma", "Prototyping", "User Research", "Adobe XD"],
    verified: true,
    img: "bg-gradient-to-br from-purple-500 to-pink-600",
  },
  {
    id: 3,
    name: "David Chen",
    role: "DevOps Engineer",
    location: "San Francisco, USA",
    rating: 4.8,
    reviews: 34,
    rate: 70,
    bio: "Automating your infrastructure with Docker, Kubernetes, and CI/CD pipelines. I ensure your app stays up 99.9% of the time.",
    skills: ["Docker", "Kubernetes", "Jenkins", "Python"],
    verified: false,
    img: "bg-gradient-to-br from-emerald-500 to-teal-600",
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Content Strategist",
    location: "Bangalore, India",
    rating: 4.9,
    reviews: 89,
    rate: 25,
    bio: "Crafting compelling narratives for tech startups. I help brands find their voice and increase organic traffic through SEO.",
    skills: ["SEO", "Copywriting", "Blog Writing", "Social Media"],
    verified: true,
    img: "bg-gradient-to-br from-orange-500 to-red-600",
  },
  {
    id: 5,
    name: "Michael Ross",
    role: "Mobile App Developer",
    location: "Toronto, Canada",
    rating: 4.7,
    reviews: 42,
    rate: 45,
    bio: "Flutter and React Native specialist. I build cross-platform apps that feel native and perform beautifully on iOS and Android.",
    skills: ["Flutter", "React Native", "Firebase", "Dart"],
    verified: true,
    img: "bg-gradient-to-br from-cyan-500 to-blue-600",
  },
  {
    id: 6,
    name: "Elena Rodriguez",
    role: "Graphic Designer",
    location: "Madrid, Spain",
    rating: 5.0,
    reviews: 15,
    rate: 40,
    bio: "Visual storyteller with a passion for branding and illustration. I help businesses stand out with unique visual identities.",
    skills: ["Illustrator", "Photoshop", "Branding", "Logo Design"],
    verified: false,
    img: "bg-gradient-to-br from-rose-500 to-pink-500",
  },
];

const categories = ["All Talent", "Development", "Design", "Marketing", "Writing", "Admin Support", "AI Services"];

export default function FreelancerMarketplace() {
  const [activeCategory, setActiveCategory] = useState("All Talent");

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      <BackgroundMesh />

      {/* NAVBAR (Simplified Version) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-xl font-bold text-white">W</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Worker<span className="text-blue-600">Hub</span>
                </h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/search" className="text-sm font-medium text-slate-500 hover:text-blue-600">Find Workers</Link>
            <Link to="/freelancers" className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Freelancers</Link>
            <Link to="/post-job" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl font-bold transition-all text-sm">Post a Job</Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* HERO / SEARCH HEADER */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Hire Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Freelance Talent</span>
          </h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-lg text-slate-500 max-w-xl">
              Connect with verified professionals. View portfolios, read reviews, and hire the best match for your project.
            </p>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                <Search className="w-5 h-5 text-slate-400 ml-4" />
                <input 
                  type="text" 
                  placeholder="Search by skill or name..." 
                  className="w-full py-3.5 px-4 bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400 rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 overflow-x-auto pb-4 sm:pb-0 hide-scrollbar">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                  activeCategory === cat 
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all text-sm whitespace-nowrap">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* FREELANCER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((f, index) => (
            <div 
              key={f.id}
              className="group relative bg-white rounded-[2rem] border border-slate-100 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
              style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
            >
              {/* Header: Avatar, Name, Rate */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <div className={`w-14 h-14 rounded-2xl ${f.img} flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20`}>
                    {f.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      {f.name}
                      {f.verified && <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-500/10" />}
                    </h3>
                    <p className="text-sm font-medium text-slate-500">{f.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-bold text-slate-900">${f.rate}<span className="text-sm text-slate-400 font-normal">/hr</span></span>
                  <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 mb-4 text-sm border-y border-slate-50 py-3">
                 <div className="flex items-center gap-1">
                   <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                   <span className="font-bold text-slate-800">{f.rating.toFixed(1)}</span>
                   <span className="text-slate-400">({f.reviews})</span>
                 </div>
                 <div className="w-px h-4 bg-slate-200"></div>
                 <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[100px]">{f.location}</span>
                 </div>
              </div>

              {/* Bio */}
              <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-3">
                {f.bio}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6 h-16 overflow-hidden content-start">
                {f.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link to={`/profile/${f.id}`} className="flex items-center justify-center py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm transition-all">
                  View Profile
                </Link>
                <button className="flex items-center justify-center py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5">
                  Hire Now
                </button>
              </div>

            </div>
          ))}
        </div>
        
        {/* Pagination / Load More */}
        <div className="mt-12 text-center">
            <button className="px-8 py-3 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-white hover:shadow-lg transition-all">
                Load More Talent
            </button>
        </div>

      </main>

      {/* Global Animation Styles */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}