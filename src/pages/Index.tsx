import { useState } from "react";
import ForumHeader from "@/components/ForumHeader";
import ForumStats from "@/components/ForumStats";
import ForumSection, { type Section } from "@/components/ForumSection";
import TopicView from "@/components/TopicView";
import AuthModal, { type ForumUser } from "@/components/AuthModal";
import type { BannedUser } from "@/components/AdminPanel";

const INITIAL_SECTIONS: Section[] = [
  {
    id: "support",
    name: "Поддержка",
    icon: "LifeBuoy",
    description: "Вопросы и помощь по игре",
    color: "bg-[hsl(var(--forum-blue))]",
    topics: [],
  },
  {
    id: "news",
    name: "Новости",
    icon: "Newspaper",
    description: "Обновления и анонсы",
    color: "bg-[hsl(var(--primary))]",
    topics: [],
  },
  {
    id: "discussions",
    name: "Обсуждения",
    icon: "MessagesSquare",
    description: "Общение на игровые темы",
    color: "bg-[hsl(var(--forum-orange))]",
    topics: [],
  },
  {
    id: "guides",
    name: "Гайды",
    icon: "BookOpen",
    description: "Руководства и советы",
    color: "bg-[hsl(var(--forum-gold))]",
    topics: [],
  },
  {
    id: "events",
    name: "События",
    icon: "CalendarDays",
    description: "Турниры, ивенты и конкурсы",
    color: "bg-purple-600",
    topics: [],
  },
  {
    id: "trade",
    name: "Торговля",
    icon: "ShoppingCart",
    description: "Обмен и продажа игровых предметов",
    color: "bg-emerald-600",
    topics: [],
  },
];

const CREATOR_USER: ForumUser = {
  id: 0,
  username: "Pavel_Mativ",
  role: "admin",
  registeredAt: "01.01.2026",
};

const Index = () => {
  const [forumName, setForumName] = useState("Game Forum");
  const [isAdmin, setIsAdmin] = useState(false);
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [selectedTopic, setSelectedTopic] = useState<{ sectionId: string; topicId: number } | null>(null);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [currentUser, setCurrentUser] = useState<ForumUser | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<ForumUser[]>([CREATOR_USER]);

  const handleBanUser = (name: string, reason: string) => {
    setBannedUsers((prev) => [
      ...prev,
      { id: Date.now(), name, reason, date: new Date().toLocaleDateString("ru-RU") },
    ]);
  };

  const handleUnbanUser = (id: number) => {
    setBannedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleAuth = (user: ForumUser) => {
    setCurrentUser(user);
    if (user.role === "admin") {
      setIsAdmin(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const handleRegister = (user: ForumUser) => {
    setRegisteredUsers((prev) => [...prev, user]);
  };

  const updateTopic = (sectionId: string, topicId: number, updater: (t: Section["topics"][0]) => Section["topics"][0]) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, topics: s.topics.map((t) => (t.id === topicId ? updater(t) : t)) }
          : s
      )
    );
  };

  const handleTogglePin = (sectionId: string, topicId: number) => {
    updateTopic(sectionId, topicId, (t) => ({ ...t, isPinned: !t.isPinned }));
  };

  const handleToggleLock = (sectionId: string, topicId: number) => {
    updateTopic(sectionId, topicId, (t) => ({ ...t, isLocked: !t.isLocked }));
  };

  const handleToggleHide = (sectionId: string, topicId: number) => {
    updateTopic(sectionId, topicId, (t) => ({ ...t, isHidden: !t.isHidden }));
  };

  const handleBanAuthor = (sectionId: string, topicId: number) => {
    updateTopic(sectionId, topicId, (t) => ({ ...t, authorBanned: !t.authorBanned }));
  };

  const handleSelectTopic = (sectionId: string, topicId: number) => {
    setSelectedTopic({ sectionId, topicId });
  };

  const currentSection = selectedTopic ? sections.find((s) => s.id === selectedTopic.sectionId) : null;
  const currentTopic = currentSection?.topics.find((t) => t.id === selectedTopic?.topicId);

  const totalTopics = sections.reduce((acc, s) => acc + s.topics.length, 0);
  const totalPosts = sections.reduce((acc, s) => acc + s.topics.reduce((a, t) => a + t.replies, 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader
        forumName={forumName}
        onNameChange={setForumName}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        bannedUsers={bannedUsers}
        onBanUser={handleBanUser}
        onUnbanUser={handleUnbanUser}
        currentUser={currentUser}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {selectedTopic && currentTopic && currentSection ? (
          <TopicView
            topic={currentTopic}
            sectionName={currentSection.name}
            isAdmin={isAdmin}
            onBack={() => setSelectedTopic(null)}
          />
        ) : (
          <>
            <ForumStats
              totalTopics={totalTopics}
              totalPosts={totalPosts}
              totalUsers={registeredUsers.length}
              onlineUsers={currentUser ? 1 : 0}
            />

            {isAdmin && (
              <div className="bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/30 rounded-lg px-4 py-3 text-sm text-[hsl(var(--primary))] flex items-center gap-2">
                <span className="text-base">🛡️</span>
                Режим админа — наведите на тему для модерации. Нажмите карандаш у названия форума, чтобы переименовать.
              </div>
            )}

            <div className="space-y-4">
              {sections.map((section) => (
                <ForumSection
                  key={section.id}
                  section={section}
                  isAdmin={isAdmin}
                  onTogglePin={handleTogglePin}
                  onToggleLock={handleToggleLock}
                  onToggleHide={handleToggleHide}
                  onBanAuthor={handleBanAuthor}
                  onSelectTopic={handleSelectTopic}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-border mt-8 py-4 text-center text-xs text-muted-foreground">
        {forumName} © 2026
      </footer>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuth={handleAuth}
        registeredUsers={registeredUsers}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default Index;