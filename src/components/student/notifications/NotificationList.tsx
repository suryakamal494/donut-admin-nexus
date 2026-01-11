import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import NotificationCard, { Notification } from "./NotificationCard";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: { label: string; notifications: Notification[] }[] = [];
  
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const thisWeek: Notification[] = [];
  const older: Notification[] = [];

  notifications.forEach((notification) => {
    if (isToday(notification.timestamp)) {
      today.push(notification);
    } else if (isYesterday(notification.timestamp)) {
      yesterday.push(notification);
    } else if (isThisWeek(notification.timestamp)) {
      thisWeek.push(notification);
    } else {
      older.push(notification);
    }
  });

  if (today.length > 0) groups.push({ label: "Today", notifications: today });
  if (yesterday.length > 0) groups.push({ label: "Yesterday", notifications: yesterday });
  if (thisWeek.length > 0) groups.push({ label: "This Week", notifications: thisWeek });
  if (older.length > 0) groups.push({ label: "Earlier", notifications: older });

  return groups;
};

const NotificationList = ({ notifications, onMarkAsRead, onDismiss }: NotificationListProps) => {
  const groups = groupNotificationsByDate(notifications);

  if (notifications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/50 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/20 flex items-center justify-center">
          <span className="text-3xl">🔔</span>
        </div>
        <p className="text-muted-foreground font-medium">All caught up!</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          No notifications in this category
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {groups.map((group, groupIndex) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {group.label}
            </h3>
            <div className="space-y-3">
              <AnimatePresence>
                {group.notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDismiss={onDismiss}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationList;
