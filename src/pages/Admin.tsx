import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PLAYLIST_API = "https://functions.poehali.dev/f53e4fe3-cb91-4242-9d46-36eb7f1f83da";
const UPLOAD_URL_API = "https://functions.poehali.dev/9329dddc-1240-4cb8-9309-4a86687fc3fd";

interface Video {
  id: number;
  title: string;
  file_url: string;
  duration_seconds: number;
  sort_order: number;
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration || 0);
    };
    video.onerror = () => resolve(0);
    video.src = URL.createObjectURL(file);
  });
}

const UPLOAD_CHUNK_SIZE = 1.5 * 1024 * 1024;

function readChunkAsBase64(file: File, start: number, end: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = () => reject(new Error("Ошибка чтения файла"));
    reader.readAsDataURL(file.slice(start, end));
  });
}

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState<{ name: string; progress: number }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_password");
    if (saved) {
      setPassword(saved);
      tryLogin(saved);
    }
  }, []);

  const tryLogin = async (pwd: string) => {
    const cleanPwd = pwd.trim();
    setAuthLoading(true);
    try {
      const res = await fetch(PLAYLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password: cleanPwd }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthed(true);
        sessionStorage.setItem("admin_password", cleanPwd);
        loadPlaylist();
      } else {
        toast.error("Неверный пароль");
      }
    } catch {
      toast.error("Ошибка соединения");
    } finally {
      setAuthLoading(false);
    }
  };

  const loadPlaylist = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${PLAYLIST_API}?action=playlist`);
      const data = await res.json();
      setVideos(data.videos || []);
    } catch {
      toast.error("Не удалось загрузить плейлист");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = useCallback(async (file: File) => {
    setUploads((prev) => [...prev, { name: file.name, progress: 0 }]);

    let uploadId: string | undefined;
    let totalParts = 0;

    try {
      const duration = await getVideoDuration(file);

      const startRes = await fetch(UPLOAD_URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          action: "start",
          file_name: file.name,
          content_type: file.type || "video/mp4",
        }),
      });
      const startData = await startRes.json();
      if (!startRes.ok) throw new Error(startData.error || "Ошибка начала загрузки");

      uploadId = startData.upload_id;
      const fileKey = startData.file_key;
      const contentType = startData.content_type;

      totalParts = Math.ceil(file.size / UPLOAD_CHUNK_SIZE);

      for (let i = 0; i < totalParts; i++) {
        const start = i * UPLOAD_CHUNK_SIZE;
        const end = Math.min(start + UPLOAD_CHUNK_SIZE, file.size);
        const base64 = await readChunkAsBase64(file, start, end);

        const partRes = await fetch(UPLOAD_URL_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password,
            action: "upload_part",
            upload_id: uploadId,
            part_number: i,
            data: base64,
          }),
        });
        if (!partRes.ok) throw new Error("Ошибка загрузки части файла");

        const progress = Math.round(((i + 1) / totalParts) * 100);
        setUploads((prev) =>
          prev.map((u) => (u.name === file.name ? { ...u, progress } : u))
        );
      }

      const completeRes = await fetch(UPLOAD_URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          action: "complete",
          upload_id: uploadId,
          file_key: fileKey,
          content_type: contentType,
          total_parts: totalParts,
        }),
      });
      const completeData = await completeRes.json();
      if (!completeRes.ok) throw new Error(completeData.error || "Ошибка завершения загрузки");

      const addRes = await fetch(PLAYLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          password,
          title: file.name.replace(/\.[^.]+$/, ""),
          file_key: completeData.file_key,
          file_url: completeData.file_url,
          duration_seconds: duration,
        }),
      });
      const addData = await addRes.json();
      if (!addRes.ok) throw new Error(addData.error);

      setVideos((prev) => [...prev, addData.video]);
      toast.success(`${file.name} добавлено в эфир`);
    } catch (e) {
      if (uploadId) {
        fetch(UPLOAD_URL_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, action: "abort", upload_id: uploadId, total_parts: totalParts }),
        }).catch(() => {});
      }
      toast.error(`Ошибка загрузки ${file.name}`);
    } finally {
      setUploads((prev) => prev.filter((u) => u.name !== file.name));
    }
  }, [password]);

  const handleFiles = (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("video/"));
    if (list.length === 0) {
      toast.error("Выберите видеофайлы");
      return;
    }
    list.forEach((f) => uploadFile(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить это видео из эфира?")) return;
    try {
      await fetch(PLAYLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", password, id }),
      });
      setVideos((prev) => prev.filter((v) => v.id !== id));
      toast.success("Удалено");
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOverItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    setVideos((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex.current!, 1);
      next.splice(index, 0, moved);
      dragIndex.current = index;
      return next;
    });
  };

  const handleDragEnd = async () => {
    dragIndex.current = null;
    try {
      await fetch(PLAYLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", password, order: videos.map((v) => v.id) }),
      });
    } catch {
      toast.error("Не удалось сохранить порядок");
    }
  };

  if (!authed) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <h1>Вход в панель эфира</h1>
          <div className="admin-password-field">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tryLogin(password)}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
            </button>
          </div>
          <Button onClick={() => tryLogin(password)} disabled={authLoading || !password}>
            {authLoading ? "Проверка…" : "Войти"}
          </Button>
        </div>
      </div>
    );
  }

  const totalDuration = videos.reduce((s, v) => s + v.duration_seconds, 0);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Управление эфиром GOLDTV</h1>
        <a href="/" className="admin-back-link">← На сайт</a>
      </div>

      <div
        className={`admin-dropzone${dragOver ? " admin-dropzone--active" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("admin-file-input")?.click()}
      >
        <Icon name="UploadCloud" size={40} />
        <p>Перетащи сюда видео или папку с видео</p>
        <span>или нажми, чтобы выбрать файлы</span>
        <input
          id="admin-file-input"
          type="file"
          accept="video/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {uploads.length > 0 && (
        <div className="admin-uploads">
          {uploads.map((u) => (
            <div key={u.name} className="admin-upload-item">
              <span>{u.name}</span>
              <div className="admin-upload-bar">
                <div className="admin-upload-bar-fill" style={{ width: `${u.progress}%` }} />
              </div>
              <span>{u.progress}%</span>
            </div>
          ))}
        </div>
      )}

      <div className="admin-playlist-header">
        <h2>Плейлист эфира ({videos.length})</h2>
        <span>Общая длительность: {formatDuration(totalDuration)}</span>
      </div>

      {loading ? (
        <p className="admin-empty">Загрузка…</p>
      ) : videos.length === 0 ? (
        <p className="admin-empty">Пока нет видео — загрузи первое, чтобы начать эфир</p>
      ) : (
        <div className="admin-playlist-list">
          {videos.map((v, i) => (
            <div
              key={v.id}
              className="admin-playlist-item"
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOverItem(e, i)}
              onDragEnd={handleDragEnd}
            >
              <Icon name="GripVertical" size={18} className="admin-drag-handle" />
              <span className="admin-item-num">{i + 1}</span>
              <span className="admin-item-title">{v.title}</span>
              <span className="admin-item-duration">{formatDuration(v.duration_seconds)}</span>
              <button className="admin-item-delete" onClick={() => handleDelete(v.id)}>
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;