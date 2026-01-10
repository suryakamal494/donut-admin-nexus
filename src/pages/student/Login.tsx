// Student Login Page - Premium warm design with blended illustration
// Responsive: Side-by-side (desktop/tablet), Blended top (mobile)

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import aiCompanionIllustration from "@/assets/student/ai-companion-illustration.png";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/student/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden">
      {/* ========== LEFT SIDE: Illustration Area (Desktop/Tablet) ========== */}
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] xl:w-[55%] relative bg-gradient-to-br from-amber-100 via-orange-100/90 to-rose-100/80 items-center justify-center overflow-hidden">
        {/* Organic gradient blobs */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-gradient-to-br from-donut-coral/25 to-donut-pink/15 rounded-full blur-3xl" />
          <div className="absolute bottom-[-15%] right-[-5%] w-[70%] h-[60%] bg-gradient-to-tl from-amber-200/30 to-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-rose-200/25 rounded-full blur-2xl" />
        </div>
        
        {/* Floating sparkle particles */}
        <div className="absolute top-[15%] left-[20%] w-2 h-2 bg-donut-coral/50 rounded-full animate-pulse" />
        <div className="absolute top-[25%] right-[25%] w-3 h-3 bg-amber-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
        <div className="absolute bottom-[30%] left-[15%] w-2.5 h-2.5 bg-rose-300/50 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute top-[60%] right-[15%] w-2 h-2 bg-orange-300/40 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
        
        {/* Main illustration - blended with gradient overlay at edges */}
        <div className="relative z-10 w-full max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] px-8">
          <div className="relative">
            {/* Soft glow behind illustration */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-100/60 via-transparent to-transparent rounded-full blur-3xl scale-125" />
            <img 
              src={aiCompanionIllustration} 
              alt="Student with AI learning companion" 
              className="relative w-full h-auto drop-shadow-2xl"
              style={{
                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
              }}
            />
          </div>
          
          {/* Brand text below illustration */}
          <div className="text-center mt-4">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground/90">Your AI Learning Companion</h2>
            <p className="text-sm lg:text-base text-muted-foreground/80 mt-1">Personalized learning, just for you</p>
          </div>
        </div>
        
        {/* Curved edge transition to form area */}
        <div className="absolute right-0 top-0 h-full w-16 lg:w-20 bg-gradient-to-l from-white to-transparent" />
      </div>

      {/* ========== MOBILE: Blended Top Illustration ========== */}
      <div className="md:hidden relative w-full h-[35vh] min-h-[220px] bg-gradient-to-b from-amber-100 via-orange-100/90 to-transparent overflow-hidden">
        {/* Organic gradient blobs */}
        <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[80%] bg-gradient-to-br from-donut-coral/20 to-donut-pink/10 rounded-full blur-3xl" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-gradient-to-tl from-amber-200/25 to-transparent rounded-full blur-3xl" />
        
        {/* Floating particles */}
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-donut-coral/50 rounded-full animate-pulse" />
        <div className="absolute top-[30%] right-[20%] w-2 h-2 bg-amber-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        {/* Illustration - blended into gradient */}
        <div className="absolute inset-0 flex items-center justify-center pt-8">
          <img 
            src={aiCompanionIllustration} 
            alt="Student with AI companion" 
            className="w-[60%] max-w-[240px] h-auto drop-shadow-xl"
            style={{
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 95%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 95%)'
            }}
          />
        </div>
        
        {/* Curved bottom edge for seamless blend */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white"
          style={{
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0'
          }}
        />
      </div>

      {/* ========== RIGHT SIDE: Login Form ========== */}
      <div className="flex-1 flex flex-col bg-white relative">
        {/* Back button */}
        <button 
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-1.5 text-muted-foreground/70 hover:text-foreground transition-colors p-2 rounded-xl hover:bg-muted/30"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>

        {/* Form container - centered with max-width */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 md:px-10 lg:px-16">
          <div className="w-full max-w-[380px]">
            
            {/* Branding - small and elegant */}
            <div className="flex items-center gap-2 mb-6 md:mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-donut-coral to-donut-pink flex items-center justify-center shadow-lg shadow-donut-coral/25">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-base font-bold bg-gradient-to-r from-donut-coral to-donut-pink bg-clip-text text-transparent">Donut AI</span>
            </div>

            {/* Heading - simple and clear */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Login
              </h1>
              <p className="text-muted-foreground text-base">
                Your AI learning companion awaits
              </p>
            </div>

            {/* Login form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Phone number input */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 text-sm font-medium border-r border-muted/30 pr-3">
                    +91
                  </span>
                  <Input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-14 pl-16 pr-4 rounded-2xl border-muted/40 bg-muted/20 text-base placeholder:text-muted-foreground/40 focus:border-donut-coral focus:ring-2 focus:ring-donut-coral/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 px-4 pr-12 rounded-2xl border-muted/40 bg-muted/20 text-base placeholder:text-muted-foreground/40 focus:border-donut-coral focus:ring-2 focus:ring-donut-coral/20 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot password - aligned right */}
              <div className="flex justify-end">
                <button 
                  type="button"
                  className="text-sm text-donut-coral hover:text-donut-pink transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login button - asymmetric, pill-shaped, right-aligned on desktop */}
              <div className="pt-2 flex justify-end">
                <Button 
                  type="submit"
                  className="h-14 px-8 md:px-10 rounded-full text-base font-semibold gradient-button shadow-xl shadow-donut-coral/30 hover:shadow-2xl hover:shadow-donut-coral/40 transition-all duration-300 hover:scale-[1.02] group w-full md:w-auto"
                >
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>

            {/* Help text - subtle at bottom */}
            <div className="mt-10 text-center md:text-left">
              <p className="text-xs text-muted-foreground/60">
                Need help? <span className="text-donut-coral/80 hover:text-donut-coral cursor-pointer transition-colors">Contact your institute</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom safe area for mobile */}
        <div className="h-6 md:h-0" />
      </div>
    </div>
  );
};

export default StudentLogin;
