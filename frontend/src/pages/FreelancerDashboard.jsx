import { useState, useEffect } from "react";
import api from "../../utils/api";
import {
  Home,
  Search,
  FileText,
  MessageSquare,
  BarChart3,
  Newspaper,
  Menu,
  X,
  MapPin,
  SlidersHorizontal,
  Bell,
  Mail,
  User,
  Briefcase,
  Clock,
  DollarSign,
  Grid3x3,
  List,
  ChevronDown,
  CheckCheck,
  Wallet,
  LogOut // Added LogOut Icon
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import FreelancerProfile from "./FreelancerProfilePage"; // Integrated Profile Page

export default function FreelancerDashboard() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("Around You");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("newest");

  // Job filters
  const [jobType, setJobType] = useState("all"); // fulltime, freelance
  const [showDetails, setShowDetails] = useState(false);
  const [salaryRange, setSalaryRange] = useState(false);

  // Data states
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [news, setNews] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(false);

  // Notification counts
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]); // Store actual notifications
  const [showNotifications, setShowNotifications] = useState(false); // Toggle dropdown
  const [messageCount, setMessageCount] = useState(0);

  // Application Modal State
  const [jobToApply, setJobToApply] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    coverLetter: "",
    bidAmount: "",
    estimatedDuration: "1 Week"
  });

  // Wallet State
  const [wallet, setWallet] = useState({ balance: 0, currency: "INR", transactions: [] });
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [walletAmount, setWalletAmount] = useState("");

  // Socket State
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // ============================================
  // API CONFIGURATION
  // ============================================
  const API_BASE_URL = "http://localhost:5000/api"; // Your backend API
  const PUBLIC_JOB_API = "https://api.publicapis.org/jobs"; // Example public API
  const SOCKET_URL = "http://localhost:5000";

  // ============================================
  // SOCKET CONNECTION
  // ============================================
  useEffect(() => {
    // 1. Get User ID from Profile or Token (Here assuming we fetch profile first)
    // Or we can decode token
    const token = localStorage.getItem("token");
    if (userProfile.name && token) {
      // We need user ID for socket
      // Ideally userProfile should have _id
      const newSocket = io(SOCKET_URL, {
        query: {
          userId: userProfile._id || userProfile.userId?._id || userProfile.userId // Adjust based on your profile structure
        }
      });

      setSocket(newSocket);

      // Listen for online users
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Listen for new messages
      newSocket.on("newMessage", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        setMessageCount((prev) => prev + 1); // Increment unread count
        // Optional: Show toast notification
      });

      // Listen for new notifications (if backend emits it)
      // Backend: io.to(userId).emit("newNotification", notification);
      newSocket.on("newNotification", (notification) => {
        setNotificationCount((prev) => prev + 1);
        // Optional: Show toast
      });

      return () => newSocket.close();
    }
  }, [userProfile]);

  // ============================================
  // FETCH USER PROFILE
  // ============================================
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Use correct endpoint & 'api' instance (Token handled automatically)
      // api.js adds /api prefix, so we call /freelancer/profile/me
      const response = await api.get("/freelancer/profile/me");

      console.log("Profile Response:", response.data); // Debug log

      // Map backend data to UI format
      // Backend always sends userId with name, email, role
      const profileData = response.data;

      // Backend now always returns user data, even if FreelancerProfile doesn't exist
      setUserProfile({
        name: profileData.userId?.name || "User",
        email: profileData.userId?.email || "No email",
        role: profileData.userId?.role || "FREELANCER",
        avatar: profileData.profileImage || null,
        title: profileData.title || "Complete your profile",
        _id: profileData.userId?._id
      });

    } catch (error) {
      console.error("Error fetching user profile:", error);
      console.error("Error details:", error.response?.data);

      // Fallback if request fails
      setUserProfile({
        name: "Guest User",
        role: "Freelancer",
        avatar: null,
        title: "Welcome!"
      });
    }
  };

  // ============================================
  // LOGOUT HANDLER
  // ============================================
  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to login page
    window.location.href = "/freelancer/login";
  };

  // ============================================
  // FETCH JOBS (Dashboard View)
  // ============================================
  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchJobs();
    }
  }, [activeTab, searchQuery, locationFilter, selectedCategories, sortBy]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // TODO: Replace with your actual jobs API endpoint
      // This endpoint should support query parameters for filtering
      const params = {
        search: searchQuery,
        location: locationFilter,
        categories: selectedCategories.join(","),
        sort: sortBy,
        page: 1,
        limit: 20
      };

      const response = await api.get("/jobs", { params });
      setJobs(response.data.jobs || []);

      // Alternative: Fetch from public API
      // const publicResponse = await axios.get(PUBLIC_JOB_API);
      // setJobs(publicResponse.data);

    } catch (error) {
      console.error("Error fetching jobs:", error);
      // Fallback to dummy data for demo
      setJobs(dummyJobs);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FETCH APPLICATIONS
  // ============================================
  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications();
    }
  }, [activeTab]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // TODO: Replace with your actual applications API endpoint
      // UPDATED: Use the correct endpoint for fetching MY proposals
      const response = await api.get("/proposals/my-proposals");
      setApplications(response.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FETCH MESSAGES
  // ============================================
  useEffect(() => {
    if (activeTab === "message") {
      fetchMessages();
    }
  }, [activeTab]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // TODO: Replace with your actual messages API endpoint
      const response = await api.get("/messages");
      setMessages(response.data.messages || []);
      setMessageCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FETCH STATISTICS
  // ============================================
  useEffect(() => {
    if (activeTab === "statistics") {
      fetchStatistics();
    }
  }, [activeTab]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // TODO: Replace with your actual statistics API endpoint
      const response = await api.get("/statistics");
      setStatistics(response.data || {});
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStatistics({
        totalApplications: 0,
        activeJobs: 0,
        totalEarnings: 0,
        successRate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FETCH NEWS (Public API)
  // ============================================
  useEffect(() => {
    if (activeTab === "news") {
      fetchNews();
    }
  }, [activeTab]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // TODO: Replace with your preferred news API
      // Example: NewsAPI, GNews API, or your custom news endpoint
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=technology&apiKey=YOUR_API_KEY`
      );
      setNews(response.data.articles || []);

      // Or use your custom news endpoint
      // const response = await axios.get(`${API_BASE_URL}/news`);
      // setNews(response.data.news || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FETCH NOTIFICATIONS
  // ============================================
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // TODO: Replace with your actual notifications API endpoint
      const response = await api.get("/notifications");
      // Backend returns { notifications: [], unreadCount: 0 }
      setNotificationCount(response.data.unreadCount || 0);
      setNotifications(response.data.notifications || []); // Store full list
      // Optional: Store notifications in a separate state if you want to show list
      // For now we just update count
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotificationCount(10); // Dummy data
    }
  };

  // ============================================
  // WALLET HANDLERS
  // ============================================
  useEffect(() => {
    if (activeTab === "wallet") {
      fetchWallet();
    }
  }, [activeTab]);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const response = await api.get("/wallet");
      setWallet(response.data);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    try {
      await api.post("/wallet/add", { amount: walletAmount, paymentDetails: "Mock Payment" });
      alert("Funds added successfully!");
      setShowAddFundsModal(false);
      setWalletAmount("");
      fetchWallet();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add funds");
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      await api.post("/wallet/withdraw", { amount: walletAmount, bankDetails: { accountNumber: "1234567890" } });
      alert("Withdrawal successful!");
      setShowWithdrawModal(false);
      setWalletAmount("");
      fetchWallet();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to withdraw");
    }
  };

  // ============================================
  // APPLY TO JOB HANDLER
  // ============================================
  const handleApplyClick = (job) => {
    setJobToApply(job);
    setApplicationForm({ coverLetter: "", bidAmount: "", estimatedDuration: "1 Week" });
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!jobToApply) return;
    setLoading(true);
    try {
      await api.post("/proposals", {
        jobId: jobToApply._id,
        coverLetter: applicationForm.coverLetter,
        bidAmount: Number(applicationForm.bidAmount),
        estimatedDuration: applicationForm.estimatedDuration
      });
      alert("Application submitted successfully!");
      setJobToApply(null); // Close modal
      fetchApplications(); // Refresh applications list
    } catch (error) {
      console.error("Error applying to job:", error);
      alert(error.response?.data?.message || "Failed to apply to job");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CATEGORY DATA
  // ============================================
  const categories = [
    { name: "Your Skill", color: "bg-white text-purple-600 border-purple-200" },
    { name: "Programmer", color: "bg-purple-600 text-white" },
    { name: "Software Engineer", color: "bg-purple-600 text-white" },
    { name: "Photographer", color: "bg-purple-600 text-white" },
    { name: "Digital Marketing", color: "bg-purple-600 text-white" },
  ];

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // ============================================
  // DUMMY DATA FOR DEMO (Remove when API is ready)
  // ============================================
  const dummyJobs = [
    {
      id: 1,
      company: "Maximoz Team",
      title: "Database Programmer",
      salary: "$14,000 - $25,000",
      type: "REMOTE",
      location: "London, England",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      logo: "blue",
      postedAt: "2 days ago"
    },
    {
      id: 2,
      company: "Colo Colo Studios",
      title: "Intern Programmer",
      salary: "$14,000 - $25,000",
      type: "REMOTE",
      location: "London, England",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      logo: "orange",
      postedAt: "3 days ago"
    },
    {
      id: 3,
      company: "Kleanity Ltd.",
      title: "PHP Programmer",
      salary: "$14,000 - $25,000",
      type: "REMOTE",
      location: "London, England",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      logo: "pink",
      postedAt: "1 week ago"
    },
    {
      id: 4,
      company: "Kitakita Crew Ltd.",
      title: "Frontend Programmer",
      salary: "$14,000 - $25,000",
      type: "REMOTE",
      location: "London, England",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      logo: "green",
      postedAt: "5 days ago"
    },
    {
      id: 5,
      company: "Madju Djaja Studios",
      title: "Backend Programmer",
      salary: "$14,000 - $25,000",
      type: "REMOTE",
      location: "London, England",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      logo: "cyan",
      postedAt: "1 day ago"
    },
    {
      id: 6,
      company: "Junaidis Team",
      title: "Full-Stack Programmer",
      salary: "$14,000 - $25,000",
      type: "REMOTE",
      location: "London, England",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      logo: "lime",
      postedAt: "3 days ago"
    }
  ];

  // ============================================
  // LOGO COLOR MAPPING
  // ============================================
  const logoColors = {
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    green: "bg-green-500",
    cyan: "bg-cyan-500",
    lime: "bg-lime-500"
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ============================================ */}
      {/* SIDEBAR */}
      {/* ============================================ */}
      <aside
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-700 to-purple-900 text-white transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-purple-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
            </div>
            <span className="text-2xl font-bold">Labour Finder</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Dashboard */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === "dashboard"
              ? "bg-white/20 shadow-lg"
              : "hover:bg-white/10"
              }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          {/* Search Job */}
          <button
            onClick={() => setActiveTab("search")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === "search"
              ? "bg-white/20 shadow-lg"
              : "hover:bg-white/10"
              }`}
          >
            <Search className="w-5 h-5" />
            <span className="font-medium">Search Job</span>
          </button>

          {/* Applications */}
          <button
            onClick={() => setActiveTab("applications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === "applications"
              ? "bg-white/20 shadow-lg"
              : "hover:bg-white/10"
              }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Applications</span>
          </button>

          {/* Payments/Wallet */}
          <button
            onClick={() => { setActiveTab("wallet"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === "wallet"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
              : "text-gray-500 hover:bg-purple-50 hover:text-purple-600"
              }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="font-medium">Payments/Wallet</span>
          </button>

          {/* Message */}
          <button
            onClick={() => setActiveTab("message")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === "message"
              ? "bg-white/20 shadow-lg"
              : "hover:bg-white/10"
              }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Message</span>
            {messageCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {messageCount}
              </span>
            )}
          </button>

          {/* Statistics */}
          <button
            onClick={() => setActiveTab("statistics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === "statistics"
              ? "bg-white/20 shadow-lg"
              : "hover:bg-white/10"
              }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Statistics</span>
          </button>

          {/* News */}
          <button
            onClick={() => setActiveTab("news")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === "news"
              ? "bg-white/20 shadow-lg"
              : "hover:bg-white/10"
              }`}
          >
            <Newspaper className="w-5 h-5" />
            <span className="font-medium">News</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/20 text-red-100 hover:text-white mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-purple-600 space-y-2 text-xs text-purple-200">
          <p>Jobie Job Portal Admin Dashboard</p>
          <p>© 2026 All Rights Reserved</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-red-400">❤️</span> by Himanshu
          </p>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Search Jobs</h1>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search something here..."
                  className="bg-transparent border-none outline-none px-3 w-full text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6 text-gray-600" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif, index) => (
                          <div key={index} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <p className="text-sm text-gray-800">{notif.text || notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No new notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <button
                onClick={() => setActiveTab("message")}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Mail className="w-6 h-6 text-gray-600" />
                {messageCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {messageCount}
                  </span>
                )}
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block cursor-pointer" onClick={() => setActiveTab("profile")}>
                  <p className="text-sm font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                    {userProfile.name || "Loading..."}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userProfile.role || "User"}
                  </p>
                </div>
                <div
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-purple-200 transition-all"
                  onClick={() => setActiveTab("profile")}
                >
                  {userProfile.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt="User"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ============================================ */}
        {/* SEARCH FILTERS SECTION */}
        {/* ============================================ */}
        {activeTab === "dashboard" && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            {/* Location & Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Location Dropdown */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 min-w-[200px]">
                <MapPin className="w-5 h-5 text-purple-600" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
                >
                  <option>Around You</option>
                  <option>Remote</option>
                  <option>London</option>
                  <option>New York</option>
                  <option>San Francisco</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              {/* Main Search Input */}
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search by Title, Company or any job keyword..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Filter Button */}
                <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors">
                  <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">FILTER</span>
                </button>

                {/* Find Button */}
                <button className="flex items-center gap-2 bg-purple-600 text-white rounded-lg px-6 py-2.5 hover:bg-purple-700 transition-colors shadow-lg">
                  <Search className="w-5 h-5" />
                  <span className="text-sm font-semibold">FIND</span>
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-gray-500 py-2">Suggestions</span>
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => toggleCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategories.includes(category.name)
                    ? category.color + " shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Results Info & View Controls */}
            <div className="flex items-center justify-between">
              {/* Left: Results count and filters */}
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    Showing {jobs.length} Jobs Results
                  </p>
                  <p className="text-sm text-gray-500">Based on your preferences</p>
                </div>

                {/* Toggle Filters */}
                <div className="flex items-center gap-4 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobType === "fulltime"}
                      onChange={(e) => setJobType(e.target.checked ? "fulltime" : "all")}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Fulltime</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobType === "freelance"}
                      onChange={(e) => setJobType(e.target.checked ? "freelance" : "all")}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Freelance</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDetails}
                      onChange={(e) => setShowDetails(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700">Details</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Salary</span>
                  </label>
                </div>
              </div>

              {/* Right: Sort and View Mode */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="salary-low">Salary: Low to High</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>

                {/* View Mode Buttons */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${viewMode === "list"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-colors ${viewMode === "grid"
                      ? "bg-purple-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* CONTENT AREA */}
        {/* ============================================ */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* DASHBOARD TAB - JOB LISTINGS */}
          {activeTab === "dashboard" && (
            <div className={`grid gap-6 ${viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
              }`}>
              {loading ? (
                <div className="col-span-full text-center py-20">
                  <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-500">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No jobs found. Try adjusting your filters.</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 ${logoColors[job.logo] || "bg-gray-200"} rounded-xl flex items-center justify-center text-white font-bold text-xl`}>
                        {job.company.charAt(0)}
                      </div>
                      <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {job.type}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{job.company} • {job.location}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {job.salary}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {job.postedAt}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex gap-3">
                      <button className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                        Details
                      </button>
                      <button
                        onClick={() => handleApplyClick(job)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SEARCH TAB */}
          {activeTab === "search" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Advanced Job Search</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    Search Jobs
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* APPLICATIONS TAB */}
          {/* TODO: Fetch and display user's job applications */}
          {activeTab === "applications" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No applications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                      <h3 className="font-semibold text-gray-800">{app.jobTitle}</h3>
                      <p className="text-sm text-gray-500">{app.company}</p>
                      <p className="text-xs text-gray-400 mt-2">Status: {app.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MESSAGES TAB */}
          {/* TODO: Fetch and display messages */}
          {activeTab === "message" && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-3 h-[600px]">
                {/* Message List */}
                <div className="border-r border-gray-200 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                  </div>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No messages</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {messages.map((msg, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 truncate">{msg.sender}</p>
                              <p className="text-sm text-gray-600 truncate">{msg.preview}</p>
                              <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="md:col-span-2 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a conversation to view messages</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATISTICS TAB */}
          {/* TODO: Fetch and display user statistics */}
          {activeTab === "statistics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Statistics</h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Stat Cards */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <BarChart3 className="w-10 h-10 mb-3 opacity-80" />
                    <p className="text-3xl font-bold mb-1">{statistics.totalApplications || 0}</p>
                    <p className="text-blue-100">Total Applications</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <Briefcase className="w-10 h-10 mb-3 opacity-80" />
                    <p className="text-3xl font-bold mb-1">{statistics.activeJobs || 0}</p>
                    <p className="text-green-100">Active Jobs</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <DollarSign className="w-10 h-10 mb-3 opacity-80" />
                    <p className="text-3xl font-bold mb-1">${statistics.totalEarnings || 0}</p>
                    <p className="text-purple-100">Total Earnings</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                    <Clock className="w-10 h-10 mb-3 opacity-80" />
                    <p className="text-3xl font-bold mb-1">{statistics.successRate || 0}%</p>
                    <p className="text-orange-100">Success Rate</p>
                  </div>
                </div>
              )}

              {/* Additional Statistics Charts */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Activity Overview</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">Chart will be displayed here</p>
                  {/* TODO: Integrate charting library (Chart.js, Recharts, etc.) */}
                </div>
              </div>
            </div>
          )}

          {/* NEWS TAB */}
          {/* TODO: Fetch news from public API */}
          {activeTab === "news" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Latest News</h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : news.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                  <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No news available at the moment</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((article, index) => (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{article.source}</span>
                          <span>{article.publishedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB (Integrated) */}
          {activeTab === "profile" && (
            <div className="h-full overflow-y-auto">
              <FreelancerProfile />
            </div>
          )}

          {/* WALLET TAB */}
          {activeTab === "wallet" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">My Wallet</h2>

              {/* Balance Card */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Available Balance</p>
                  <h3 className="text-4xl font-bold">
                    {wallet.currency} {wallet.balance?.toLocaleString()}
                  </h3>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAddFundsModal(true)}
                    className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg"
                  >
                    + Add Funds
                  </button>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="bg-purple-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-800 transition-colors shadow-lg border border-purple-500"
                  >
                    Withdraw
                  </button>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Transaction History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-gray-400 text-sm border-b border-gray-100">
                        <th className="font-medium py-3">Description</th>
                        <th className="font-medium py-3">Type</th>
                        <th className="font-medium py-3">Date</th>
                        <th className="font-medium py-3 text-right">Amount</th>
                        <th className="font-medium py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wallet.transactions?.length > 0 ? (
                        wallet.transactions.map((txn, index) => (
                          <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-4 text-gray-800 font-medium">{txn.description}</td>
                            <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${txn.type === "CREDIT" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                {txn.type}
                              </span>
                            </td>
                            <td className="py-4 text-gray-500 text-sm">
                              {new Date(txn.createdAt).toLocaleDateString()}
                            </td>
                            <td className={`py-4 text-right font-bold ${txn.type === "CREDIT" ? "text-green-600" : "text-gray-800"
                              }`}>
                              {txn.type === "CREDIT" ? "+" : "-"} {wallet.currency} {txn.amount}
                            </td>
                            <td className="py-4 text-right">
                              <span className={`px-2 py-1 rounded text-xs ${txn.status === "COMPLETED" ? "text-green-600 bg-green-50" : "text-yellow-600 bg-yellow-50"
                                }`}>
                                {txn.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-gray-400">
                            No transactions yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main >

      {/* ADD FUNDS MODAL */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add Funds to Wallet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Enter the amount you want to add. (This is a simulation, mock payment will be processed immediately).
            </p>
            <input
              type="number"
              value={walletAmount}
              onChange={(e) => setWalletAmount(e.target.value)}
              placeholder="Amount (e.g. 500)"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {/* Admin Payment Details Display (Mock) */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-bold text-yellow-800 mb-1">Make Payment To:</p>
              <p className="text-xs text-yellow-700">UPI ID: admin@upi</p>
              <p className="text-xs text-yellow-700">Bank: HDFC Bank, Acc: 12345678, IFSC: HDFC0001234</p>
              <p className="text-xs text-gray-500 mt-2 italic">* System will auto-detect payment after you click confirming.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddFundsModal(false)}
                className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFunds}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg hover:bg-purple-700"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )
      }
      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Withdraw Funds</h3>
            <input
              type="number"
              value={walletAmount}
              onChange={(e) => setWalletAmount(e.target.value)}
              placeholder="Amount to Withdraw"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <input
              type="text"
              placeholder="Your Bank Account / UPI ID"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-6 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700"
              >
                Request Withdrawal
              </button>
            </div>
          </div>
        </div>
      )
      }

      {/* APPLICATION MODAL */}
      {jobToApply && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden transform transition-all scale-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Apply for Job</h3>
                <p className="text-sm text-gray-500">{jobToApply.title} at {jobToApply.company}</p>
              </div>
              <button
                onClick={() => setJobToApply(null)}
                className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={submitApplication} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                <textarea
                  required
                  rows="4"
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  placeholder="Explain why you are the best fit for this job..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bid Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={applicationForm.bidAmount}
                    onChange={(e) => setApplicationForm({ ...applicationForm, bidAmount: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    placeholder="e.g. 500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                  <select
                    value={applicationForm.estimatedDuration}
                    onChange={(e) => setApplicationForm({ ...applicationForm, estimatedDuration: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  >
                    <option>Less than 1 week</option>
                    <option>1 Week</option>
                    <option>2 Weeks</option>
                    <option>1 Month</option>
                    <option>More than 1 month</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setJobToApply(null)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Send Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div >
  );
}
