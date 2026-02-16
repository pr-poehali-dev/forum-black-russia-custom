import Icon from "@/components/ui/icon";

export interface Topic {
  id: number;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastActivity: string;
  isPinned?: boolean;
  isLocked?: boolean;
  isHidden?: boolean;
  authorBanned?: boolean;
}

export interface Section {
  id: string;
  name: string;
  icon: string;
  description: string;
  topics: Topic[];
  color: string;
}

interface ForumSectionProps {
  section: Section;
  isAdmin: boolean;
  onTogglePin: (sectionId: string, topicId: number) => void;
  onToggleLock: (sectionId: string, topicId: number) => void;
  onToggleHide: (sectionId: string, topicId: number) => void;
  onBanAuthor: (sectionId: string, topicId: number) => void;
  onSelectTopic: (sectionId: string, topicId: number) => void;
}

const ForumSection = ({ section, isAdmin, onTogglePin, onToggleLock, onToggleHide, onBanAuthor, onSelectTopic }: ForumSectionProps) => {
  const visibleTopics = isAdmin ? section.topics : section.topics.filter((t) => !t.isHidden);

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <div className={`w-8 h-8 rounded flex items-center justify-center ${section.color}`}>
          <Icon name={section.icon} size={18} className="text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{section.name}</h2>
          <p className="text-xs text-muted-foreground">{section.description}</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          {visibleTopics.length} тем
        </div>
      </div>

      {visibleTopics.length === 0 ? (
        <div className="px-4 py-8 text-center text-muted-foreground text-sm">
          Пока нет тем в этом разделе
        </div>
      ) : (
        <div className="divide-y divide-border">
          {visibleTopics.map((topic) => (
            <div
              key={topic.id}
              className={`px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors group ${topic.isHidden ? "opacity-50" : ""}`}
            >
              <div className="flex-shrink-0">
                {topic.isPinned ? (
                  <Icon name="Pin" size={16} className="text-[hsl(var(--forum-gold))]" />
                ) : topic.isLocked ? (
                  <Icon name="Lock" size={16} className="text-[hsl(var(--forum-red))]" />
                ) : (
                  <Icon name="MessageCircle" size={16} className="text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <button
                  onClick={() => onSelectTopic(section.id, topic.id)}
                  className="text-sm font-medium text-foreground hover:text-[hsl(var(--primary))] transition-colors truncate block text-left w-full"
                >
                  {topic.title}
                </button>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs ${topic.authorBanned ? "text-[hsl(var(--forum-red))] line-through" : "text-muted-foreground"}`}>
                    {topic.author}
                  </span>
                  {topic.authorBanned && (
                    <span className="text-[10px] bg-[hsl(var(--forum-red))]/20 text-[hsl(var(--forum-red))] px-1.5 rounded">БАН</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Icon name="MessageSquare" size={12} />
                  {topic.replies}
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Eye" size={12} />
                  {topic.views}
                </div>
                <div className="w-20 text-right hidden sm:block">{topic.lastActivity}</div>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onTogglePin(section.id, topic.id)}
                    className={`p-1 rounded hover:bg-secondary ${topic.isPinned ? "text-[hsl(var(--forum-gold))]" : "text-muted-foreground"}`}
                    title="Закрепить"
                  >
                    <Icon name="Pin" size={14} />
                  </button>
                  <button
                    onClick={() => onToggleLock(section.id, topic.id)}
                    className={`p-1 rounded hover:bg-secondary ${topic.isLocked ? "text-[hsl(var(--forum-red))]" : "text-muted-foreground"}`}
                    title="Закрыть тему"
                  >
                    <Icon name="Lock" size={14} />
                  </button>
                  <button
                    onClick={() => onToggleHide(section.id, topic.id)}
                    className={`p-1 rounded hover:bg-secondary ${topic.isHidden ? "text-[hsl(var(--forum-orange))]" : "text-muted-foreground"}`}
                    title="Скрыть"
                  >
                    <Icon name="EyeOff" size={14} />
                  </button>
                  <button
                    onClick={() => onBanAuthor(section.id, topic.id)}
                    className={`p-1 rounded hover:bg-secondary ${topic.authorBanned ? "text-[hsl(var(--forum-red))]" : "text-muted-foreground"}`}
                    title="Заблокировать автора"
                  >
                    <Icon name="Ban" size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumSection;
