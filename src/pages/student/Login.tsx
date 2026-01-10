// Student Login Page - Beautiful warm design with asymmetric layout
// Completely separate from other portal logins

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Sparkles, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import loginIllustration from "@/assets/student/login-illustration.png";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // For now, just navigate to dashboard
    navigate("/student/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50/80 to-rose-50/60">
      {/* Soft decorative blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-donut-coral/15 to-donut-pink/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-200/20 to-orange-200/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      <div className="absolute top-1/2 right-10 w-32 h-32 bg-rose-200/20 rounded-full blur-2xl" />
      
      {/* Floating particles */}
      <div className="absolute top-20 left-[15%] w-2 h-2 bg-donut-coral/40 rounded-full animate-pulse" />
      <div className="absolute top-40 right-[20%] w-3 h-3 bg-amber-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 left-[25%] w-2.5 h-2.5 bg-rose-300/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Back button */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 z-20 flex items-center gap-2 text-muted-foreground/80 hover:text-foreground transition-colors p-2"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Main content - asymmetric layout */}
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-16 pb-8 max-w-md mx-auto w-full">
        
        {/* Illustration section - takes more visual space */}
        <div className="flex-1 flex items-center justify-center mb-4 min-h-[200px] md:min-h-[280px]">
          <div className="relative">
            {/* Glow behind illustration */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-200/40 to-transparent rounded-full blur-3xl scale-110" />
            <img 
              src={loginIllustration} 
              alt="Student learning with AI companion" 
              className="relative w-full max-w-[280px] md:max-w-[320px] h-auto drop-shadow-xl"
            />
          </div>
        </div>

        {/* Welcome text - left aligned for asymmetry */}
        <div className="mb-6 pl-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-donut-coral to-donut-pink flex items-center justify-center shadow-lg shadow-donut-coral/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-donut-coral">Donut AI</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Continue your personalized learning journey
          </p>
        </div>

        {/* Login form - glassmorphic card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-xl shadow-orange-100/30">
          {/* Phone number input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground/80 mb-2 pl-1">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                +91
              </span>
              <Input
                type="tel"
                placeholder="Enter your mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-14 pl-14 pr-4 rounded-2xl border-muted/30 bg-white/80 text-base placeholder:text-muted-foreground/50 focus:border-donut-coral focus:ring-donut-coral/20"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground/80 mb-2 pl-1">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 px-4 pr-12 rounded-2xl border-muted/30 bg-white/80 text-base placeholder:text-muted-foreground/50 focus:border-donut-coral focus:ring-donut-coral/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login button - slightly asymmetric with offset shadow */}
          <div className="pl-2">
            <Button 
              onClick={handleLogin}
              className="w-full h-14 rounded-2xl text-base font-semibold gradient-button shadow-lg shadow-donut-coral/30 hover:shadow-xl hover:shadow-donut-coral/40 transition-all duration-300 hover:scale-[1.02]"
            >
              Start Learning
            </Button>
          </div>

          {/* Forgot password link */}
          <div className="mt-4 text-center">
            <button className="text-sm text-muted-foreground hover:text-donut-coral transition-colors">
              Forgot password?
            </button>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground/70">
            Need help? Contact your institute admin
          </p>
        </div>

        {/* Bottom safe area for mobile */}
        <div className="h-4" />
      </div>
    </div>
  );
};

export default StudentLogin;
