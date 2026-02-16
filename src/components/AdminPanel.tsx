import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface BannedUser {
  id: number;
  name: string;
  reason: string;
  date: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bannedUsers: BannedUser[];
  onBanUser: (name: string, reason: string) => void;
  onUnbanUser: (id: number) => void;
}

const AdminPanel = ({ isOpen, onClose, bannedUsers, onBanUser, onUnbanUser }: AdminPanelProps) => {
  const [banName, setBanName] = useState("");
  const [banReason, setBanReason] = useState("");
  const [tab, setTab] = useState<"ban" | "list">("ban");

  if (!isOpen) return null;

  const handleBan = () => {
    if (!banName.trim()) return;
    onBanUser(banName.trim(), banReason.trim() || "Нарушение правил");
    setBanName("");
    setBanReason("");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed right-4 top-16 w-96 bg-card border border-border rounded-lg shadow-2xl z-50 animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Icon name="ShieldAlert" size={18} className="text-[hsl(var(--forum-red))]" />
            <span className="font-semibold text-foreground">Модерация</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="flex border-b border-border">
          <button
            onClick={() => setTab("ban")}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${tab === "ban" ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]" : "text-muted-foreground hover:text-foreground"}`}
          >
            Забанить
          </button>
          <button
            onClick={() => setTab("list")}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${tab === "list" ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]" : "text-muted-foreground hover:text-foreground"}`}
          >
            Список банов
            {bannedUsers.length > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">{bannedUsers.length}</Badge>
            )}
          </button>
        </div>

        {tab === "ban" && (
          <div className="p-4 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Никнейм</label>
              <Input
                value={banName}
                onChange={(e) => setBanName(e.target.value)}
                placeholder="Введите никнейм..."
                className="bg-secondary border-border text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Причина</label>
              <Input
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Нарушение правил..."
                className="bg-secondary border-border text-foreground"
                onKeyDown={(e) => e.key === "Enter" && handleBan()}
              />
            </div>
            <Button onClick={handleBan} disabled={!banName.trim()} className="w-full gap-1.5" variant="destructive">
              <Icon name="Ban" size={16} />
              Заблокировать
            </Button>
          </div>
        )}

        {tab === "list" && (
          <div className="max-h-80 overflow-y-auto">
            {bannedUsers.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                <Icon name="CheckCircle" size={24} className="mx-auto mb-2 text-[hsl(var(--primary))]" />
                Нет заблокированных
              </div>
            ) : (
              <div className="divide-y divide-border">
                {bannedUsers.map((user) => (
                  <div key={user.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--forum-red))]/20 flex items-center justify-center flex-shrink-0">
                      <Icon name="Ban" size={14} className="text-[hsl(var(--forum-red))]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.reason}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{user.date}</div>
                    </div>
                    <button
                      onClick={() => onUnbanUser(user.id)}
                      className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-[hsl(var(--primary))] transition-colors flex-shrink-0"
                      title="Разбанить"
                    >
                      <Icon name="UserCheck" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
