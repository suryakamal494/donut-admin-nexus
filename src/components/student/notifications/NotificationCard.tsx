import { memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Video, FileText, Trophy, Bell, Check, X, LucideIcon } from "lucide-react";

export type NotificationType = "class" | "test" | "achievement" | "general";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const typeConfig: Record<NotificationType, { icon: LucideIcon, color: string, bgColor: string }> = {
  class: { icon: Video, color: "#3B82F6", bgColor: "bg-blue-100" },
  test: { icon: FileText, color: "#EF4444", bgColor: "bg-red-100" },
  achievement: { icon: Trophy, color: "#F59E0B", bgColor: "bg-amber-100" },
  general: { icon: Bell, color: "#8B5CF6", bgColor: "bg-violet-100" },
};

const NotificationCard = memo(function NotificationCard({ notification, onMarkAsRead, onDismiss }: NotificationCardProps) {
  const config = typeConfig[notification.type];
  const IconComponent = config.icon;
  
  // Memoize formatted time
  const formattedTime = useMemo(() => {
    const now = new Date();
    const diffMs = now.getTime() - notification.timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notification.timestamp.toLocaleDateString();
  }, [notification.timestamp]);

  // Memoize handlers
  const handleMarkAsRead = useCallback(() => {
    onMarkAsRead(notification.id);
  }, [onMarkAsRead, notification.id]);

  const handleDismiss = useCallback(() => {
    onDismiss(notification.id);
  }, [onDismiss, notification.id]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`
        relative flex items-start gap-3 p-4 rounded-xl border transition-all
        ${notification.read 
          ? 'bg-white/40 border-white/30' 
          : 'bg-white/70 border-white/50 shadow-md'
        }
      `}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))]" />
      )}

      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bgColor}`}
      >
        <IconComponent className="w-5 h-5" style={{ color: config.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-start justify-between gap-2">
          <h4 className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
            {notification.title}
          </h4>
        </div>
        <p className={`text-xs mt-0.5 line-clamp-2 ${notification.read ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
          {notification.message}
        </p>
        <span className="text-xs text-muted-foreground/60 mt-1 block">
          {formattedTime}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1 absolute right-3 top-1/2 -translate-y-1/2">
        {!notification.read && (
          <button
            onClick={handleMarkAsRead}
            className="p-1.5 rounded-lg hover:bg-emerald-100 text-muted-foreground hover:text-emerald-600 transition-colors"
            title="Mark as read"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-500 transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
});

export default NotificationCard;
