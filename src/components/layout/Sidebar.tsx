import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Shield,
  FileQuestion,
  ClipboardList,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  Crown,
  GraduationCap,
  BookOpen,
  Layers,
  FileText,
  Target,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: { title: string; href: string; icon?: React.ElementType }[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/superadmin/dashboard",
  },
  {
    title: "Institutes",
    icon: Building2,
    children: [
      { title: "All Institutes", href: "/superadmin/institutes", icon: Building2 },
      { title: "Create Institute", href: "/superadmin/institutes/create", icon: Plus },
      { title: "Tier Management", href: "/superadmin/institutes/tiers", icon: Crown },
    ],
  },
  {
    title: "Users & Batches",
    icon: Users,
    children: [
      { title: "Direct Users", href: "/superadmin/users", icon: Users },
      { title: "Batch Management", href: "/superadmin/batches", icon: GraduationCap },
    ],
  },
  {
    title: "Parameters",
    icon: Settings,
    children: [
      { title: "Classes", href: "/superadmin/parameters/classes", icon: BookOpen },
      { title: "Courses", href: "/superadmin/parameters/courses", icon: Target },
      { title: "Curriculum", href: "/superadmin/parameters/curriculum", icon: Layers },
      { title: "Subjects", href: "/superadmin/parameters/subjects", icon: FileText },
      { title: "Chapters", href: "/superadmin/parameters/chapters", icon: BookOpen },
      { title: "Topics", href: "/superadmin/parameters/topics", icon: Target },
    ],
  },
  {
    title: "Roles & Access",
    icon: Shield,
    children: [
      { title: "Role Types", href: "/superadmin/roles/types", icon: Shield },
      { title: "All Roles", href: "/superadmin/roles", icon: Users },
    ],
  },
  {
    title: "Question Bank",
    icon: FileQuestion,
    children: [
      { title: "All Questions", href: "/superadmin/questions", icon: FileQuestion },
      { title: "Create Question", href: "/superadmin/questions/create", icon: Plus },
      { title: "AI Generator", href: "/superadmin/questions/ai", icon: Sparkles },
    ],
  },
  {
    title: "Exams",
    icon: ClipboardList,
    children: [
      { title: "All Exams", href: "/superadmin/exams", icon: ClipboardList },
      { title: "Create Exam", href: "/superadmin/exams/create", icon: Plus },
    ],
  },
  {
    title: "Content Library",
    icon: FolderOpen,
    children: [
      { title: "All Content", href: "/superadmin/content", icon: FolderOpen },
      { title: "Upload Content", href: "/superadmin/content/upload", icon: Plus },
    ],
  },
];

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>(["Institutes", "Parameters"]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActiveRoute = (href: string) => location.pathname === href;
  const isActiveParent = (children?: { href: string }[]) =>
    children?.some((child) => location.pathname.startsWith(child.href));

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
        "border-r",
        collapsed ? "w-16" : "w-64"
      )}
      style={{
        background: "linear-gradient(180deg, hsl(30 40% 96%) 0%, hsl(30 35% 94%) 100%)",
        borderColor: "hsl(30 25% 88%)",
      }}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor: "hsl(30 25% 88%)" }}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-button flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-primary">DonutAI</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "text-muted-foreground hover:text-primary hover:bg-primary/10",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isOpen = openMenus.includes(item.title);
          const isActive = item.href ? isActiveRoute(item.href) : isActiveParent(item.children);

          if (item.href) {
            return (
              <NavLink
                key={item.title}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "text-foreground/70 hover:text-primary hover:bg-primary/10",
                  isActive && "bg-primary/15 text-primary font-semibold"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                {!collapsed && <span className="font-medium">{item.title}</span>}
              </NavLink>
            );
          }

          return (
            <Collapsible
              key={item.title}
              open={!collapsed && isOpen}
              onOpenChange={() => !collapsed && toggleMenu(item.title)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "text-foreground/70 hover:text-primary hover:bg-primary/10",
                    isActive && "text-primary"
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                  {!collapsed && (
                    <>
                      <span className="font-medium flex-1 text-left">{item.title}</span>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </>
                  )}
                </button>
              </CollapsibleTrigger>
              {!collapsed && (
                <CollapsibleContent className="pl-4 mt-1 space-y-1">
                  {item.children?.map((child) => {
                    const ChildIcon = child.icon;
                    const isChildActive = isActiveRoute(child.href);
                    return (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                          "text-foreground/60 hover:text-primary hover:bg-primary/10",
                          isChildActive && "bg-primary/15 text-primary font-semibold"
                        )}
                      >
                        {ChildIcon && <ChildIcon className={cn("w-4 h-4", isChildActive && "text-primary")} />}
                        <span>{child.title}</span>
                      </NavLink>
                    );
                  })}
                </CollapsibleContent>
              )}
            </Collapsible>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;