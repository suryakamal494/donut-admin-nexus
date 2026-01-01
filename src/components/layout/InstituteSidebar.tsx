import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  FileQuestion,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Database,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface InstituteSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/institute/dashboard" },
  { title: "Batches", icon: BookOpen, href: "/institute/batches" },
  { title: "Teachers", icon: Users, href: "/institute/teachers" },
  { title: "Students", icon: GraduationCap, href: "/institute/students" },
  { title: "Timetable", icon: Calendar, href: "/institute/timetable" },
  { title: "Question Bank", icon: FileQuestion, href: "/institute/questions" },
  { title: "Exams", icon: ClipboardList, href: "/institute/exams" },
  { title: "Master Data", icon: Database, href: "/institute/master-data" },
  { title: "Settings", icon: Settings, href: "/institute/settings" },
];

const InstituteSidebar = ({ collapsed, onToggle }: InstituteSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (href: string) => {
    if (href === "/institute/dashboard") {
      return currentPath === href;
    }
    return currentPath.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-card border-r border-border/50 shadow-xl transition-all duration-300 ease-in-out z-50 flex flex-col",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        <button 
          onClick={() => navigate("/")}
          className={cn(
            "flex items-center gap-3 transition-all duration-300",
            collapsed && "justify-center"
          )}
        >
          <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center shadow-lg flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold gradient-text whitespace-nowrap">DonutAI</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Institute Panel</p>
            </div>
          )}
        </button>
        
        <button
          onClick={onToggle}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground",
            collapsed && "absolute -right-4 top-6 bg-card border border-border shadow-md"
          )}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            const linkContent = (
              <button
                onClick={() => navigate(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  active
                    ? "gradient-button shadow-md"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-white" : "")} />
                {!collapsed && (
                  <span className={cn(
                    "font-medium text-sm whitespace-nowrap",
                    active ? "text-white" : ""
                  )}>
                    {item.title}
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span className={cn(
                    "ml-auto text-xs font-semibold px-2 py-0.5 rounded-full",
                    active 
                      ? "bg-white/20 text-white" 
                      : "bg-primary/10 text-primary"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </div>
      </nav>

      {/* Help Card */}
      {!collapsed && (
        <div className="p-4">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-4 border border-primary/20">
            <h4 className="font-semibold text-sm text-foreground mb-1">Need Help?</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Get assistance with platform features
            </p>
            <button className="w-full py-2 rounded-lg text-sm font-medium gradient-button">
              Contact Support
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default InstituteSidebar;
