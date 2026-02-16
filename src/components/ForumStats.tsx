import Icon from "@/components/ui/icon";

interface StatsProps {
  totalTopics: number;
  totalPosts: number;
  totalUsers: number;
  onlineUsers: number;
}

const ForumStats = ({ totalTopics, totalPosts, totalUsers, onlineUsers }: StatsProps) => {
  const stats = [
    { icon: "MessageSquare", label: "Темы", value: totalTopics, color: "text-[hsl(var(--primary))]" },
    { icon: "MessagesSquare", label: "Посты", value: totalPosts, color: "text-[hsl(var(--forum-blue))]" },
    { icon: "Users", label: "Юзеры", value: totalUsers, color: "text-[hsl(var(--forum-gold))]" },
    { icon: "Wifi", label: "Онлайн", value: onlineUsers, color: "text-[hsl(var(--primary))]" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-card rounded-lg p-4 border border-border flex items-center gap-3">
          <Icon name={s.icon} size={20} className={s.color} />
          <div>
            <div className="text-lg font-bold text-foreground">{s.value.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumStats;
