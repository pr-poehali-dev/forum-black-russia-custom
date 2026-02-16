import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ForumUser {
  id: number;
  username: string;
  role: "user" | "admin";
  registeredAt: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: ForumUser) => void;
  registeredUsers: ForumUser[];
  onRegister: (user: ForumUser) => void;
}

const AuthModal = ({ isOpen, onClose, onAuth, registeredUsers, onRegister }: AuthModalProps) => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const reset = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }
    const found = registeredUsers.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (!found) {
      setError("Пользователь не найден");
      return;
    }
    onAuth(found);
    reset();
    onClose();
  };

  const handleRegister = () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Заполните все поля");
      return;
    }
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    if (username.trim().length < 3) {
      setError("Минимум 3 символа в нике");
      return;
    }
    if (password.length < 4) {
      setError("Минимум 4 символа в пароле");
      return;
    }
    const exists = registeredUsers.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (exists) {
      setError("Этот ник уже занят");
      return;
    }
    const newUser: ForumUser = {
      id: Date.now(),
      username: username.trim(),
      role: "user",
      registeredAt: new Date().toLocaleDateString("ru-RU"),
    };
    onRegister(newUser);
    onAuth(newUser);
    reset();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl z-50 animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Icon name="UserCircle" size={20} className="text-[hsl(var(--primary))]" />
            <span className="font-semibold text-foreground">
              {tab === "login" ? "Вход" : "Регистрация"}
            </span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="flex border-b border-border">
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${tab === "login" ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]" : "text-muted-foreground hover:text-foreground"}`}
          >
            Вход
          </button>
          <button
            onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${tab === "register" ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]" : "text-muted-foreground hover:text-foreground"}`}
          >
            Регистрация
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Никнейм</label>
            <Input
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              placeholder="Ваш игровой ник..."
              className="bg-secondary border-border text-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Пароль</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Пароль..."
              className="bg-secondary border-border text-foreground"
              onKeyDown={(e) => e.key === "Enter" && (tab === "login" ? handleLogin() : handleRegister())}
            />
          </div>
          {tab === "register" && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Подтверждение пароля</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                placeholder="Повторите пароль..."
                className="bg-secondary border-border text-foreground"
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
            </div>
          )}

          {error && (
            <div className="text-xs text-[hsl(var(--forum-red))] flex items-center gap-1.5 bg-[hsl(var(--forum-red))]/10 px-3 py-2 rounded-lg">
              <Icon name="AlertCircle" size={14} />
              {error}
            </div>
          )}

          <Button
            onClick={tab === "login" ? handleLogin : handleRegister}
            className="w-full gap-1.5"
          >
            <Icon name={tab === "login" ? "LogIn" : "UserPlus"} size={16} />
            {tab === "login" ? "Войти" : "Зарегистрироваться"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
