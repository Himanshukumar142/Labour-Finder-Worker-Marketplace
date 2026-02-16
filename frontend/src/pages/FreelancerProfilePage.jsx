import React, { useState, useEffect } from "react";
import api from "../../utils/api"; // Your custom API helper
import { 
  User, Mail, MapPin, Globe, Github, Linkedin, Save, Loader, 
  Plus, Trash2, Briefcase, ExternalLink 
} from "lucide-react";

const FreelancerProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // User Basic Data (Read-only from AuthUser)
  const [userData, setUserData] = useState({
    name: "",
    email: ""
  });

  // Form Data (Matches your Mongoose Schema)
  const [formData, setFormData] = useState({
    title: "",
    bio: "",
    hourlyRate: "",
    experienceLevel: "BEGINNER", // Enum default
    skills: "", // We handle this as string in UI, Array in DB
    location: { country: "", city: "" },
    socialLinks: { github: "", linkedin: "", portfolio: "" },
    projects: [], // Array of objects { title, description, link }
    profileImage: ""
  });

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/freelancer/profile/me");
        
        if (response.data) {
          const data = response.data;
          
          // 1. Set Auth User Data (Display Only)
          setUserData({
            name: data.userId?.name || "",
            email: data.userId?.email || ""
          });

          // 2. Set Profile Data
          setFormData({
            title: data.title || "",
            bio: data.bio || "",
            hourlyRate: data.hourlyRate || "",
            experienceLevel: data.experienceLevel || "BEGINNER",
            skills: data.skills ? data.skills.join(", ") : "", // Convert Array to String
            location: data.location || { country: "", city: "" },
            socialLinks: data.socialLinks || { github: "", linkedin: "", portfolio: "" },
            projects: data.projects || [], 
            profileImage: data.profileImage || ""
          });
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- 2. HANDLERS ---

  // Handle simple inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Nested Objects (Location, SocialLinks)
  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [name]: value }
    });
  };

  // --- PROJECT HANDLERS (Dynamic Array) ---
  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProjects = [...formData.projects];
    updatedProjects[index][name] = value;
    setFormData({ ...formData, projects: updatedProjects });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { title: "", description: "", link: "" }]
    });
  };

  const removeProject = (index) => {
    const updatedProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updatedProjects });
  };

  // --- 3. SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare payload for Mongoose Schema
      const payload = {
        ...formData,
        // Convert skills string back to Array
        skills: formData.skills.split(",").map(skill => skill.trim()).filter(skill => skill !== "")
      };

      const response = await api.post("/freelancer/profile", payload);
      alert("Profile Updated Successfully! ✅");
      console.log("Updated Profile:", response.data);
      
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to update profile ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader className="animate-spin text-purple-600 w-10 h-10" /></div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 flex flex-col md:flex-row items-center gap-6 border border-gray-100">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
           {formData.profileImage ? (
             <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
           ) : (
             <span className="text-3xl font-bold text-purple-600">{userData.name?.charAt(0).toUpperCase() || "U"}</span>
           )}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">{userData.name || "Freelancer Name"}</h1>
          <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
            <Mail className="w-4 h-4" /> {userData.email || "email@example.com"}
          </p>
          <div className="mt-2 flex gap-2 justify-center md:justify-start">
             <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-bold">
               {formData.experienceLevel}
             </span>
             {formData.location.city && (
               <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                 <MapPin className="w-3 h-3" /> {formData.location.city}, {formData.location.country}
               </span>
             )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. PROFESSIONAL INFO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" /> Professional Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleChange}
                  placeholder="e.g. MERN Stack Developer"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                <input 
                  type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange}
                  placeholder="e.g. 30"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea 
                name="bio" rows="4" value={formData.bio} onChange={handleChange}
                placeholder="Describe your expertise and experience..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Comma Separated)</label>
              <input 
                type="text" name="skills" value={formData.skills} onChange={handleChange}
                placeholder="React, Node.js, MongoDB, Figma"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* 2. PROJECTS SECTION (Dynamic Array) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                 <Briefcase className="w-5 h-5 text-purple-600" /> Portfolio Projects
               </h3>
               <button type="button" onClick={addProject} className="text-sm bg-purple-50 text-purple-600 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-purple-100">
                 <Plus className="w-4 h-4" /> Add Project
               </button>
            </div>

            {formData.projects.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No projects added yet.</p>
            )}

            <div className="space-y-4">
              {formData.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                  <button 
                    type="button" 
                    onClick={() => removeProject(index)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <input 
                      type="text" name="title" placeholder="Project Title"
                      value={project.title} onChange={(e) => handleProjectChange(index, e)}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <input 
                      type="text" name="link" placeholder="Project Link (URL)"
                      value={project.link} onChange={(e) => handleProjectChange(index, e)}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <textarea 
                    name="description" placeholder="Project Description" rows="2"
                    value={project.description} onChange={(e) => handleProjectChange(index, e)}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  ></textarea>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Settings & Social */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* LOCATION & EXPERIENCE */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Details</h3>
            
            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
               <select 
                 name="experienceLevel" 
                 value={formData.experienceLevel} 
                 onChange={handleChange}
                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
               >
                 <option value="BEGINNER">Beginner</option>
                 <option value="INTERMEDIATE">Intermediate</option>
                 <option value="EXPERT">Expert</option>
               </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input 
                type="text" name="city" placeholder="City"
                value={formData.location.city} onChange={(e) => handleNestedChange(e, "location")}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input 
                type="text" name="country" placeholder="Country"
                value={formData.location.country} onChange={(e) => handleNestedChange(e, "location")}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" /> Social Links
            </h3>
            
            <div className="space-y-4">
              <div className="relative">
                <Github className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                <input 
                  type="text" name="github" value={formData.socialLinks.github} onChange={(e) => handleNestedChange(e, "socialLinks")}
                  placeholder="GitHub URL"
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div className="relative">
                <Linkedin className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                <input 
                  type="text" name="linkedin" value={formData.socialLinks.linkedin} onChange={(e) => handleNestedChange(e, "socialLinks")}
                  placeholder="LinkedIn URL"
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div className="relative">
                <ExternalLink className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                <input 
                  type="text" name="portfolio" value={formData.socialLinks.portfolio} onChange={(e) => handleNestedChange(e, "socialLinks")}
                  placeholder="Portfolio URL"
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            disabled={saving}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 hover:shadow-xl hover:-translate-y-1"}`}
          >
            {saving ? (
              <>Saving...</>
            ) : (
              <><Save className="w-5 h-5" /> Save Changes</>
            )}
          </button>

        </div>
      </form>
    </div>
  );
};

export default FreelancerProfile;