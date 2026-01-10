// Student Header - Clean desktop header with search and profile
// Completely separate from other portal headers

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Search, 
  LogOut, 
  User,
  Settings,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { studentProfile } from "@/data/student/profile";

interface StudentHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const StudentHeader = ({ onMenuClick, showMenuButton }: StudentHeaderProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const initials = studentProfile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-orange-100/50 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        
        {/* Greeting - Desktop only */}
        <div className="hidden lg:block">
          <p className="text-sm text-muted-foreground">{getGreeting()},</p>
          <p className="text-base font-semibold text-foreground">
            {studentProfile.name.split(" ")[0]}! 👋
          </p>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-auto hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/60 border-orange-100/50 focus:border-donut-coral/50 focus:ring-donut-coral/20"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Button */}
        <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground">
          <Search className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/student/notifications")}
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full px-1 bg-gradient-to-br from-red-500 to-rose-500 text-white">
            3
          </span>
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 h-auto hover:bg-transparent">
              <Avatar className="h-9 w-9 border-2 border-donut-coral/30 shadow-md cursor-pointer hover:border-donut-coral/50 transition-colors">
                <AvatarFallback className="bg-gradient-to-br from-donut-coral to-donut-pink text-white font-bold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold">{studentProfile.name}</p>
              <p className="text-xs text-muted-foreground">{studentProfile.grade}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => navigate("/student/login")}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default StudentHeader;
