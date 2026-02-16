import { useState } from "react";
import ForumHeader from "@/components/ForumHeader";
import ForumStats from "@/components/ForumStats";
import ForumSection, { type Section } from "@/components/ForumSection";
import TopicView from "@/components/TopicView";

const INITIAL_SECTIONS: Section[] = [
  {
    id: "support",
    name: "Поддержка",
    icon: "LifeBuoy",
    description: "Вопросы и помощь по игре",
    color: "bg-[hsl(var(--forum-blue))]",
    topics: [
      { id: 1, title: "Не могу зайти в аккаунт после обновления", author: "Player_228", replies: 12, views: 345, lastActivity: "2 мин", isPinned: true },
      { id: 2, title: "Баг с текстурами на Android 14", author: "BugHunter", replies: 5, views: 120, lastActivity: "15 мин" },
      { id: 3, title: "Как восстановить прогресс?", author: "NewPlayer", replies: 8, views: 230, lastActivity: "1 час" },
    ],
  },
  {
    id: "news",
    name: "Новости",
    icon: "Newspaper",
    description: "Обновления и анонсы",
    color: "bg-[hsl(var(--primary))]",
    topics: [
      { id: 4, title: "🔥 Обновление 4.2 — новая карта и оружие", author: "Admin", replies: 47, views: 2100, lastActivity: "5 мин", isPinned: true },
      { id: 5, title: "Технические работы 17 февраля", author: "Admin", replies: 15, views: 890, lastActivity: "30 мин", isLocked: true },
      { id: 6, title: "Итоги зимнего ивента", author: "Moderator", replies: 23, views: 560, lastActivity: "3 часа" },
    ],
  },
  {
    id: "discussions",
    name: "Обсуждения",
    icon: "MessagesSquare",
    description: "Общение на игровые темы",
    color: "bg-[hsl(var(--forum-orange))]",
    topics: [
      { id: 7, title: "Какой класс сильнее в текущей мете?", author: "MetaGamer", replies: 89, views: 1500, lastActivity: "1 мин" },
      { id: 8, title: "Ваши любимые моменты в игре", author: "Nostalgic", replies: 34, views: 670, lastActivity: "20 мин" },
      { id: 9, title: "Спамер продаёт читы — нужен бан", author: "FairPlay", replies: 6, views: 180, lastActivity: "45 мин", isHidden: true },
    ],
  },
  {
    id: "guides",
    name: "Гайды",
    icon: "BookOpen",
    description: "Руководства и советы",
    color: "bg-[hsl(var(--forum-gold))]",
    topics: [
      { id: 10, title: "Полный гайд по прокачке с нуля до 100 уровня", author: "ProGuide", replies: 56, views: 3400, lastActivity: "10 мин", isPinned: true },
      { id: 11, title: "Фарм денег: топ-5 способов 2026", author: "MoneyMaker", replies: 28, views: 1200, lastActivity: "2 часа" },
      { id: 12, title: "Секретные локации на новой карте", author: "Explorer", replies: 19, views: 870, lastActivity: "4 часа" },
    ],
  },
  {
    id: "events",
    name: "События",
    icon: "CalendarDays",
    description: "Турниры, ивенты и конкурсы",
    color: "bg-purple-600",
    topics: [
      { id: 13, title: "🏆 Турнир 2v2 — призовой фонд 50,000", author: "EventManager", replies: 41, views: 1800, lastActivity: "3 мин", isPinned: true },
      { id: 14, title: "Конкурс скриншотов — голосование", author: "Community", replies: 67, views: 940, lastActivity: "1 час" },
    ],
  },
  {
    id: "trade",
    name: "Торговля",
    icon: "ShoppingCart",
    description: "Обмен и продажа игровых предметов",
    color: "bg-emerald-600",
    topics: [
      { id: 15, title: "Продам легендарное оружие — дёшево", author: "Trader_Max", replies: 14, views: 420, lastActivity: "8 мин" },
      { id: 16, title: "Обмен редких скинов", author: "SkinCollector", replies: 9, views: 310, lastActivity: "25 мин" },
      { id: 17, title: "[СКАМ] Осторожно мошенник user_toxic", author: "WatchDog", replies: 22, views: 750, lastActivity: "50 мин", authorBanned: true },
    ],
  },
];

const Index = () => {
  const [forumName, setForumName] = useState("Game Forum");
  const [isAdmin, setIsAdmin] = useState(false);
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [selectedTopic, setSelectedTopic] = useState<{ sectionId: string; topicId: number } | null>(null);

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
            <ForumStats totalTopics={totalTopics} totalPosts={totalPosts} totalUsers={1247} onlineUsers={89} />

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
    </div>
  );
};

export default Index;
