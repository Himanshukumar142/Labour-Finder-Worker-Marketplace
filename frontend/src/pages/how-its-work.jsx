import React from "react";

// --- ICONS ---
const MapPin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const UserCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
);
const PhoneCall = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a9 9 0 0 1 8 7.94"/><path d="M14.05 6A5 5 0 0 1 18 10"/></svg>
);
const CheckCircle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const ShieldCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);
const Zap = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

// --- BACKGROUND COMPONENT (Same as Main Page for Consistency) ---
const BackgroundMesh = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50">
    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/60 rounded-full blur-[100px] animate-blob"></div>
    <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-indigo-100/60 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
  </div>
);

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Set Your Location",
      desc: "Click 'Detect Location' or enter your area. We use precise geolocation to match you with workers in your immediate neighborhood.",
      icon: <MapPin className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-100",
    },
    {
      id: 2,
      title: "Choose Service",
      desc: "Select the category of work you need—Plumber, Electrician, Carpenter, or Daily Labor. Our database filters the best matches.",
      icon: <SearchIcon className="w-6 h-6 text-indigo-600" />,
      color: "bg-indigo-50 border-indigo-100",
    },
    {
      id: 3,
      title: "Compare Profiles",
      desc: "View verified profiles. Check their daily wage rates, past job ratings, and distance from your home to make an informed choice.",
      icon: <UserCheck className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50 border-purple-100",
    },
    {
      id: 4,
      title: "Direct Connect",
      desc: "No middlemen. Click to Call or WhatsApp the worker directly to negotiate and finalize the job details instantly.",
      icon: <PhoneCall className="w-6 h-6 text-green-600" />,
      color: "bg-green-50 border-green-100",
    },
  ];

  return (
    <div className="min-h-screen text-slate-800 font-sans relative selection:bg-blue-100 selection:text-blue-900">
      <BackgroundMesh />

      {/* HEADER (Simplified for Subpage) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-xl font-bold text-white">W</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Worker<span className="text-blue-600">Hub</span>
            </h1>
          </div>
          <a href="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            ← Back to Search
          </a>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Hiring made <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Simple.</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Forget the hassle of finding local help. WorkerHub connects you with skilled professionals in four simple steps.
          </p>
        </div>

        {/* WORKFLOW STEPS GRID */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-100 via-indigo-100 to-green-100 border-t-2 border-dashed border-slate-300 -z-10"></div>

          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="relative flex flex-col items-center text-center group"
              style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200 border-2 ${step.color} bg-white transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110`}>
                {step.icon}
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all h-full">
                <div className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 rounded-full">
                  Step 0{step.id}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* WHY CHOOSE US SECTION */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900">Why choose WorkerHub?</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Verified Profiles</h4>
                <p className="text-slate-500 text-sm">Every worker's identity and phone number is verified for your safety.</p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Zero Commission</h4>
                <p className="text-slate-500 text-sm">We don't charge a cut. You pay the worker directly what they deserve.</p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Fast Connection</h4>
                <p className="text-slate-500 text-sm">No waiting for quotes. Connect instantly via Phone or WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Ready to get work done?</h3>
          <a 
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-slate-900/20 transform transition-all hover:scale-105 active:scale-95"
          >
            <SearchIcon className="w-5 h-5" />
            Find Workers Now
          </a>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-slate-400 text-sm font-medium">© 2026 WorkerHub Inc. • Designed for Community</p>
        </div>
      </footer>

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
        .animation-delay-4000 {
          animation-delay: 4s;
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