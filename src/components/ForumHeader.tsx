import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ForumHeaderProps {
  forumName: string;
  onNameChange: (name: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

const ForumHeader = ({ forumName, onNameChange, isAdmin, onToggleAdmin }: ForumHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(forumName);

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

          <div className="flex items-center gap-3">
            <Button
              variant={isAdmin ? "default" : "secondary"}
              size="sm"
              onClick={onToggleAdmin}
              className="gap-1.5"
            >
              <Icon name={isAdmin ? "ShieldCheck" : "Shield"} size={16} />
              {isAdmin ? "Админ" : "Юзер"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ForumHeader;
