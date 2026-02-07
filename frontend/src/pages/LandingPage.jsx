import React from "react";
import { Link } from "react-router-dom";

// --- ICONS ---
const ArrowRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const Briefcase = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);
const Building = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M16 18h.01"/></svg>
);
const GraduationCap = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
);
const UserPlus = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
);

// --- BACKGROUND (Consistent Theme) ---
const BackgroundMesh = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50">
    <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px] animate-blob"></div>
    <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <BackgroundMesh />

      {/* 1. NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-xl font-bold text-white">W</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Worker<span className="text-blue-600">Hub</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/search" className="font-medium text-slate-600 hover:text-blue-600 transition-colors">Find Workers</Link>
            <Link to="/freelancers" className="font-medium text-slate-600 hover:text-blue-600 transition-colors">For Freelancers</Link>
            <Link to="/companies" className="font-medium text-slate-600 hover:text-blue-600 transition-colors">For Companies</Link>
            <Link to="/mentorship" className="font-medium text-slate-600 hover:text-blue-600 transition-colors">Mentorship</Link>
          </div>

          <div className="flex items-center gap-4">
             <Link to="/login" className="hidden md:block font-semibold text-slate-600 hover:text-slate-900">Log In</Link>
             <Link 
               to="/post-job" 
               className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5"
             >
               Post a Job
             </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          The #1 Marketplace for Local Talent
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight animate-fade-in-up delay-100">
          Find the perfect hand <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            for any job, anywhere.
          </span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
          From daily laborers to skilled freelancers and corporate hiring. 
          Connect directly, hire instantly, and grow together.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link 
            to="/search" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
          >
            <SearchIcon className="w-5 h-5" />
            Search Workers
          </Link>
          <Link 
            to="/freelancers" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg shadow-sm transition-all hover:border-slate-300"
          >
            <UserPlus className="w-5 h-5" />
            Join as Worker
          </Link>
        </div>
      </section>

      {/* 3. SEGMENT SELECTION (Freelancer, Company, Mentor) */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: For Freelancers */}
          <div className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-4 -mt-4 transition-all group-hover:bg-blue-100"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">For Freelancers</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Create your profile, showcase your skills, and get hired by locals and companies nearby. No commission fees.
              </p>
              <Link to="/freelancers" className="inline-flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all">
                Create Profile <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Card 2: For Companies */}
          <div className="group relative bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 hover:shadow-slate-900/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-bl-[100px] -mr-4 -mt-4"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform border border-indigo-500/20">
                <Building className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">For Companies</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Bulk hiring made easy. Post unlimited jobs, verify candidate backgrounds, and manage payroll all in one place.
              </p>
              <Link to="/companies" className="inline-flex items-center gap-2 text-indigo-400 font-bold group-hover:gap-4 transition-all">
                Start Hiring <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Card 3: For Mentors */}
          <div className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] -mr-4 -mt-4 transition-all group-hover:bg-purple-100"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Find a Mentor</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                New to the field? Connect with experienced professionals to upgrade your skills and get career guidance.
              </p>
              <Link to="/mentorship" className="inline-flex items-center gap-2 text-purple-600 font-bold group-hover:gap-4 transition-all">
                Explore Mentors <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. POST A JOB (CTA Banner) */}
      <section className="py-10 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-[3rem] bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden shadow-2xl shadow-blue-900/30">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply"></div>
          {/* Decorative Circles */}
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/40 rounded-full blur-3xl"></div>

          <div className="relative z-10 px-8 py-20 md:px-20 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Need to get a job done?
            </h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Post your requirements and let skilled workers come to you. 
              It's free, fast, and secure.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link 
                 to="/post-job" 
                 className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
               >
                 Post a Job for Free
               </Link>
               <Link 
                 to="/how-it-works" 
                 className="bg-blue-700/50 text-white border border-white/20 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all backdrop-blur-md"
               >
                 How it Works
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="border-t border-slate-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
               <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">W</span>
                </div>
                <span className="text-xl font-bold text-slate-900">WorkerHub</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Connecting skilled hands with the people who need them. Building a better future for local labor.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/search" className="hover:text-blue-600">Search Workers</Link></li>
                <li><Link to="/post-job" className="hover:text-blue-600">Post a Job</Link></li>
                <li><Link to="/mentorship" className="hover:text-blue-600">Find Mentors</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-blue-600">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© 2026 WorkerHub Inc. All rights reserved.</p>
            <div className="flex gap-4">
               {/* Social placeholders */}
               <div className="w-8 h-8 bg-slate-100 rounded-full hover:bg-blue-100 cursor-pointer transition-colors"></div>
               <div className="w-8 h-8 bg-slate-100 rounded-full hover:bg-blue-100 cursor-pointer transition-colors"></div>
               <div className="w-8 h-8 bg-slate-100 rounded-full hover:bg-blue-100 cursor-pointer transition-colors"></div>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Animations Style */}
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
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}