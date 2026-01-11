import { useState, useMemo, useCallback } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import NotificationFilters, { FilterType } from "@/components/student/notifications/NotificationFilters";
import NotificationList from "@/components/student/notifications/NotificationList";
import { Notification, NotificationType } from "@/components/student/notifications/NotificationCard";

// Mock notifications data
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "class",
    title: "Physics Live Class Starting",
    message: "Dr. Sharma's class on Electromagnetic Waves starts in 15 minutes",
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
    read: false,
  },
  {
    id: "2",
    type: "test",
    title: "Weekly Math Test Tomorrow",
    message: "Don't forget to prepare for Chapter 5: Quadratic Equations test at 10:00 AM",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
  },
  {
    id: "3",
    type: "achievement",
    title: "🎉 New Achievement Unlocked!",
    message: "You've earned 'Week Warrior' badge for maintaining a 7-day study streak!",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false,
  },
  {
    id: "4",
    type: "class",
    title: "Chemistry Class Recording Available",
    message: "The recording for today's Organic Chemistry session is now available to watch",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
  },
  {
    id: "5",
    type: "test",
    title: "Physics Test Results Published",
    message: "Your score: 87/100. Great improvement from last test!",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000), // 1 day + 3 hours ago
    read: true,
  },
  {
    id: "6",
    type: "achievement",
    title: "Math Master Badge Earned",
    message: "Congratulations! You scored 90%+ in 3 consecutive math tests",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
  },
  {
    id: "7",
    type: "class",
    title: "Biology Doubt Session Scheduled",
    message: "Special doubt clearing session for Cell Biology on Saturday at 4 PM",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    read: true,
  },
  {
    id: "8",
    type: "general",
    title: "Holiday Notice",
    message: "Classes will be suspended on Monday, January 20th for Republic Day preparations",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    read: true,
  },
];

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Filter notifications based on active filter
  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  // Count notifications by type
  const counts = useMemo(() => ({
    all: notifications.filter(n => !n.read).length,
    class: notifications.filter(n => n.type === "class" && !n.read).length,
    test: notifications.filter(n => n.type === "test" && !n.read).length,
    achievement: notifications.filter(n => n.type === "achievement" && !n.read).length,
  }), [notifications]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    toast.success("Marked as read");
  }, []);

  const handleDismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification dismissed");
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full pb-24 lg:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-400/25">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          <p className="text-xs text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              bg-white/60 border border-white/50 text-muted-foreground hover:bg-white/80 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </motion.button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <NotificationFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
      </motion.div>

      {/* Notification List */}
      <NotificationList
        notifications={filteredNotifications}
        onMarkAsRead={handleMarkAsRead}
        onDismiss={handleDismiss}
      />
    </div>
  );
};

export default StudentNotifications;
