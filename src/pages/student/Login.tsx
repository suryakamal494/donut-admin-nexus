// Student Login Page - Phase 1B will add full UI
// This is completely separate from other portal logins

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";

const StudentLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Soft decorative blobs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-donut-coral/20 to-donut-pink/20 rounded-full blur-3xl" />
      <div className="absolute bottom-32 left-10 w-48 h-48 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-2xl" />
      
      {/* Back button */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Logo placeholder */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-donut-coral to-donut-pink flex items-center justify-center mb-6 shadow-xl shadow-donut-coral/25">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Donut AI</h1>
        <p className="text-muted-foreground text-center mb-8">Your personalized learning journey starts here</p>

        {/* Placeholder login button */}
        <Button 
          onClick={() => navigate("/student/dashboard")}
          className="w-full h-14 rounded-2xl text-lg font-semibold gradient-button shadow-lg shadow-donut-coral/25"
        >
          Enter as Arjun
        </Button>
        
        <p className="mt-6 text-xs text-muted-foreground text-center">
          Full login UI coming in Phase 1B
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
