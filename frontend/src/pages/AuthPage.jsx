import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";

// --- ICONS ---
const Mail = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
const Lock = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const User = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const Building = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M16 18h.01" /></svg>;
const GraduationCap = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>;
const ArrowLeft = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>;
const Eye = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("freelancer");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const imageRef = useRef(null);

  // --- GSAP ANIMATIONS ---
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      gsap.from(imageRef.current, {
        x: -20,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out"
      });

      gsap.fromTo(".gsap-input",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, delay: 0.3, ease: "back.out(1.2)" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLogin]);

  // --- HANDLE SUBMIT ---
  const handleAuth = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');

    try {
      if (isLogin) {
        // LOGIN API CALL
        const response = await fetch('http://localhost:5000/api/freelancer/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || 'Login failed');
          return;
        }

        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('userId', data.user._id);

        console.log('Login successful:', data);

        // Redirect based on role
        if (data.user.role === 'FREELANCER') {
          navigate('/freelancer/dashboard');
        } else if (data.user.role === 'CLIENT') {
          navigate('/client/dashboard');
        } else {
          navigate('/dashboard/freelancer');
        }

      } else {
        // REGISTRATION API CALL
        const response = await fetch('http://localhost:5000/api/freelancer/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            role: role.toUpperCase()
          })
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || 'Registration failed');
          return;
        }

        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('userId', data.user._id);

        console.log('Registration successful:', data);

        // Redirect based on role
        if (data.user.role === 'FREELANCER') {
          navigate('/freelancer/dashboard');
        } else if (data.user.role === 'CLIENT') {
          navigate('/client/dashboard');
        } else {
          navigate('/dashboard/freelancer');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 font-sans text-slate-800 bg-slate-50 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-100/50 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-100/50 rounded-full blur-[120px]"></div>

      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors z-50">
        <ArrowLeft className="w-5 h-5" /> <span className="hidden sm:inline">Back to Home</span>
      </Link>

      {/* MAIN CARD */}
      <div ref={containerRef} className="relative z-10 w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row min-h-[650px] border border-white overflow-hidden">

        {/* LEFT SIDE (Branding) */}
        <div className="hidden md:flex w-5/12 relative bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 z-0"></div>
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

          <div ref={imageRef} className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center mb-8">
                <span className="text-2xl font-bold text-white">W</span>
              </div>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                {isLogin ? "Welcome back to the Hub." : "Start your journey."}
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed max-w-sm">
                {isLogin
                  ? "Connect with opportunities, manage your work, and grow your career."
                  : "Join thousands of professionals and companies building the future of work."}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl">
              <div className="flex -space-x-2 mb-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px]`}></div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-bold">+2k</div>
              </div>
              <p className="text-sm font-medium text-slate-300">Trusted by over 2,000+ companies and freelancers worldwide.</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Form) */}
        <div ref={formRef} className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-md mx-auto w-full">

            <div className="text-center md:text-left mb-8">
              <h3 className="text-3xl font-black text-slate-900 mb-2">{isLogin ? "Sign In" : "Create Account"}</h3>
              <p className="text-slate-500">
                {isLogin ? "Enter your credentials to access your account." : "Fill in your details to get started."}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleAuth}>

              {/* --- ROLE SELECTOR (Register Only) --- */}
              {!isLogin && (
                <div className="gsap-input mb-6">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">I want to join as a...</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'freelancer', icon: User, label: 'Freelancer' },
                      { id: 'company', icon: Building, label: 'Company' },
                      { id: 'mentor', icon: GraduationCap, label: 'Mentor' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRole(item.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${role === item.id
                            ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm transform scale-[1.02]'
                            : 'border-slate-100 hover:border-slate-300 text-slate-500 hover:bg-slate-50'
                          }`}
                      >
                        <item.icon className={`w-6 h-6 mb-2 ${role === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* INPUTS */}
              {!isLogin && (
                <div className="gsap-input group">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white hover:bg-white hover:border-slate-200 focus:border-blue-600 rounded-xl outline-none font-medium text-slate-700 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              <div className="gsap-input group">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white hover:bg-white hover:border-slate-200 focus:border-blue-600 rounded-xl outline-none font-medium text-slate-700 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="gsap-input group">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white hover:bg-white hover:border-slate-200 focus:border-blue-600 rounded-xl outline-none font-medium text-slate-700 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* FORGOT PASSWORD (Login Only) */}
              {isLogin && (
                <div className="flex justify-end gsap-input">
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</a>
                </div>
              )}

              {/* MAIN BUTTON */}
              <button className="gsap-input w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl shadow-xl shadow-blue-500/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] mt-2">
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* TOGGLE MODE */}
            <div className="mt-8 text-center gsap-input pt-4 border-t border-slate-100">
              <p className="text-slate-500 text-sm">
                {isLogin ? "New to WorkerHub?" : "Already have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-700 font-bold hover:underline ml-1"
                >
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}