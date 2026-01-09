import { Bell, Search, User, LogOut, Settings, ChevronDown, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

const Header = ({ onMobileMenuClick }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Mobile Menu Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden shrink-0"
        onClick={onMobileMenuClick}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Search Bar - Responsive */}
      <div className="relative flex-1 max-w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-10 h-10 rounded-xl bg-muted/50 border-border/50 focus:bg-white focus:border-primary transition-all w-full"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px] gradient-button border-0">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b border-border">
              <h4 className="font-semibold">Notifications</h4>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium">New institute registered</span>
                <span className="text-sm text-muted-foreground">Modern School - Basic plan</span>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium">Subscription expiring</span>
                <span className="text-sm text-muted-foreground">St. Xavier's - 5 days left</span>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium">Payment received</span>
                <span className="text-sm text-muted-foreground">DPS - ₹2,50,000</span>
                <span className="text-xs text-muted-foreground">3 hours ago</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 md:gap-3 hover:bg-muted/50 px-2 md:px-3">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full gradient-button flex items-center justify-center">
                <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium">Super Admin</p>
                <p className="text-xs text-muted-foreground">admin@donutai.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
