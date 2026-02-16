import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Topic } from "@/components/ForumSection";

interface Post {
  id: number;
  author: string;
  content: string;
  date: string;
  isHidden?: boolean;
}

interface TopicViewProps {
  topic: Topic;
  sectionName: string;
  isAdmin: boolean;
  onBack: () => void;
}

const MOCK_POSTS: Post[] = [
  { id: 1, author: "GameMaster", content: "Добро пожаловать в обсуждение! Пишите свои мысли и идеи здесь.", date: "15 фев, 14:30" },
  { id: 2, author: "ProPlayer99", content: "Отличная тема, давно ждал обсуждения этого вопроса. Думаю, нужно больше контента для новичков.", date: "15 фев, 15:10" },
  { id: 3, author: "NoviceGamer", content: "Согласен! Было бы здорово иметь больше гайдов по прокачке.", date: "15 фев, 16:45" },
];

const TopicView = ({ topic, sectionName, isAdmin, onBack }: TopicViewProps) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [newPost, setNewPost] = useState("");

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    setPosts([...posts, {
      id: Date.now(),
      author: isAdmin ? "Admin" : "User_" + Math.floor(Math.random() * 1000),
      content: newPost.trim(),
      date: "Сейчас",
    }]);
    setNewPost("");
  };

  const handleHidePost = (postId: number) => {
    setPosts(posts.map((p) => p.id === postId ? { ...p, isHidden: !p.isHidden } : p));
  };

  const visiblePosts = isAdmin ? posts : posts.filter((p) => !p.isHidden);

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <Icon name="ArrowLeft" size={16} />
        {sectionName}
      </button>

      <div className="bg-card rounded-lg border border-border mb-4">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            {topic.isPinned && <Icon name="Pin" size={14} className="text-[hsl(var(--forum-gold))]" />}
            {topic.isLocked && <Icon name="Lock" size={14} className="text-[hsl(var(--forum-red))]" />}
            <h2 className="font-semibold text-foreground">{topic.title}</h2>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Автор: {topic.author} · {topic.replies} ответов · {topic.views} просмотров
          </div>
        </div>

        <div className="divide-y divide-border">
          {visiblePosts.map((post) => (
            <div key={post.id} className={`px-4 py-3 ${post.isHidden ? "opacity-40" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                    <Icon name="User" size={14} className="text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{post.author}</span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleHidePost(post.id)}
                    className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    title={post.isHidden ? "Показать" : "Скрыть"}
                  >
                    <Icon name={post.isHidden ? "Eye" : "EyeOff"} size={14} />
                  </button>
                )}
              </div>
              <p className="text-sm text-secondary-foreground pl-9">{post.content}</p>
            </div>
          ))}
        </div>
      </div>

      {!topic.isLocked && (
        <div className="bg-card rounded-lg border border-border p-4">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Напишите ответ..."
            className="bg-secondary border-border text-foreground mb-3 min-h-[80px]"
          />
          <Button onClick={handleAddPost} disabled={!newPost.trim()} className="gap-1.5">
            <Icon name="Send" size={16} />
            Ответить
          </Button>
        </div>
      )}

      {topic.isLocked && (
        <div className="bg-card rounded-lg border border-border p-4 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
          <Icon name="Lock" size={16} />
          Тема закрыта для новых ответов
        </div>
      )}
    </div>
  );
};

export default TopicView;
