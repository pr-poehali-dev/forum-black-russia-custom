import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminPanel, { type BannedUser } from "@/components/AdminPanel";
import type { ForumUser } from "@/components/AuthModal";

interface ForumHeaderProps {
  forumName: string;
  onNameChange: (name: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  bannedUsers: BannedUser[];
  onBanUser: (name: string, reason: string) => void;
  onUnbanUser: (id: number) => void;
  currentUser: ForumUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

const ForumHeader = ({
  forumName, onNameChange, isAdmin, onToggleAdmin,
  bannedUsers, onBanUser, onUnbanUser,
  currentUser, onOpenAuth, onLogout,
}: ForumHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(forumName);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSave = () => {
    if (editValue.trim()) {
      onNameChange(editValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
              <Icon name="Gamepad2" size={22} className="text-white" />
            </div>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-8 w-64 bg-secondary text-foreground"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <Button size="sm" variant="ghost" onClick={handleSave}>
                  <Icon name="Check" size={16} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                  <Icon name="X" size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{forumName}</h1>
                {isAdmin && (
                  <button
                    onClick={() => { setEditValue(forumName); setIsEditing(true); }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="Pencil" size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdminPanelOpen(!adminPanelOpen)}
                className="gap-1.5 border-[hsl(var(--forum-red))]/40 text-[hsl(var(--forum-red))] hover:bg-[hsl(var(--forum-red))]/10 relative"
              >
                <Icon name="ShieldAlert" size={16} />
                <span className="hidden sm:inline">Модерация</span>
                {bannedUsers.length > 0 && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 ml-1">{bannedUsers.length}</Badge>
                )}
              </Button>
            )}

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[hsl(var(--primary))]/20 flex items-center justify-center">
                    <Icon name="User" size={14} className="text-[hsl(var(--primary))]" />
                  </div>
                  <span className="text-sm font-medium text-foreground hidden sm:inline">{currentUser.username}</span>
                  {currentUser.role === "admin" && (
                    <Badge className="text-[10px] px-1.5 py-0 h-4 bg-[hsl(var(--forum-gold))]/20 text-[hsl(var(--forum-gold))] border-0">
                      ADM
                    </Badge>
                  )}
                  <Icon name="ChevronDown" size={14} className="text-muted-foreground" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-50 animate-fade-in overflow-hidden">
                      <div className="px-4 py-3 border-b border-border">
                        <div className="text-sm font-medium text-foreground">{currentUser.username}</div>
                        <div className="text-xs text-muted-foreground">
                          {currentUser.role === "admin" ? "Администратор" : "Пользователь"} · с {currentUser.registeredAt}
                        </div>
                      </div>
                      {currentUser.role === "admin" && (
                        <button
                          onClick={() => { onToggleAdmin(); setProfileOpen(false); }}
                          className="w-full px-4 py-2.5 text-sm text-left flex items-center gap-2 hover:bg-secondary transition-colors text-foreground"
                        >
                          <Icon name={isAdmin ? "ShieldOff" : "ShieldCheck"} size={16} className="text-[hsl(var(--forum-gold))]" />
                          {isAdmin ? "Выйти из режима админа" : "Включить режим админа"}
                        </button>
                      )}
                      <button
                        onClick={() => { onLogout(); setProfileOpen(false); }}
                        className="w-full px-4 py-2.5 text-sm text-left flex items-center gap-2 hover:bg-secondary transition-colors text-[hsl(var(--forum-red))]"
                      >
                        <Icon name="LogOut" size={16} />
                        Выйти
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button size="sm" onClick={onOpenAuth} className="gap-1.5">
                <Icon name="LogIn" size={16} />
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>

      <AdminPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        bannedUsers={bannedUsers}
        onBanUser={onBanUser}
        onUnbanUser={onUnbanUser}
      />
    </header>
  );
};

export default ForumHeader;
