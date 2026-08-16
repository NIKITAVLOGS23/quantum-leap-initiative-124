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
  is_external?: boolean;
  video_type?: "file" | "link" | "vk" | "kinescope";
}

function parseVkVideoUrl(url: string): string | null {
  const trimmed = url.trim();
  let match = trimmed.match(/(?:vk\.com|vkvideo\.ru)\/(?:video|clip)(-?\d+)_(\d+)/i);
  if (match) return `${match[1]}_${match[2]}`;
  match = trimmed.match(/[?&]oid=(-?\d+)&id=(\d+)/i);
  if (match) return `${match[1]}_${match[2]}`;
  match = trimmed.match(/(-?\d+)_(\d+)/);
  if (match) return `${match[1]}_${match[2]}`;
  return null;
}

function parseKinescopeId(url: string): string | null {
  const trimmed = url.trim();
  let match = trimmed.match(/kinescope\.io\/(?:embed\/)?([a-zA-Z0-9]+)/i);
  if (match) return match[1];
  match = trimmed.match(/^[a-zA-Z0-9]{10,}$/);
  if (match) return trimmed;
  return null;
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
  const [addMode, setAddMode] = useState<"file" | "link" | "vk" | "kinescope">("file");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkMinutes, setLinkMinutes] = useState("");
  const [linkSeconds, setLinkSeconds] = useState("");
  const [linkSubmitting, setLinkSubmitting] = useState(false);
  const [vkTitle, setVkTitle] = useState("");
  const [vkUrl, setVkUrl] = useState("");
  const [vkMinutes, setVkMinutes] = useState("");
  const [vkSeconds, setVkSeconds] = useState("");
  const [vkSubmitting, setVkSubmitting] = useState(false);
  const [kinescopeTitle, setKinescopeTitle] = useState("");
  const [kinescopeUrl, setKinescopeUrl] = useState("");
  const [kinescopeMinutes, setKinescopeMinutes] = useState("");
  const [kinescopeSeconds, setKinescopeSeconds] = useState("");
  const [kinescopeSubmitting, setKinescopeSubmitting] = useState(false);
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

  const handleAddByLink = async () => {
    const title = linkTitle.trim();
    const url = linkUrl.trim();
    const minutes = parseInt(linkMinutes || "0", 10) || 0;
    const seconds = parseInt(linkSeconds || "0", 10) || 0;
    const duration = minutes * 60 + seconds;

    if (!title) {
      toast.error("Укажи название видео");
      return;
    }
    if (!/^https?:\/\/.+/i.test(url)) {
      toast.error("Ссылка должна начинаться с http:// или https://");
      return;
    }
    if (duration <= 0) {
      toast.error("Укажи длительность видео больше 0");
      return;
    }

    setLinkSubmitting(true);
    try {
      const addRes = await fetch(PLAYLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          password,
          title,
          file_key: `external-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file_url: url,
          duration_seconds: duration,
          video_type: "link",
        }),
      });
      const addData = await addRes.json();
      if (!addRes.ok) throw new Error(addData.error || "Ошибка добавления");

      setVideos((prev) => [...prev, addData.video]);
      toast.success(`${title} добавлено в эфир`);
      setLinkTitle("");
      setLinkUrl("");
      setLinkMinutes("");
      setLinkSeconds("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка добавления по ссылке");
    } finally {
      setLinkSubmitting(false);
    }
  };

  const handleAddVk = async () => {
    const title = vkTitle.trim();
    const url = vkUrl.trim();
    const minutes = parseInt(vkMinutes || "0", 10) || 0;
    const seconds = parseInt(vkSeconds || "0", 10) || 0;
    const duration = minutes * 60 + seconds;

    if (!title) {
      toast.error("Укажи название видео");
      return;
    }
    const vkId = parseVkVideoUrl(url);
    if (!vkId) {
      toast.error("Не удалось распознать ссылку на видео VK");
      return;
    }
    if (duration <= 0) {
      toast.error("Укажи длительность видео больше 0");
      return;
    }

    setVkSubmitting(true);
    try {
      const [oid, vid] = vkId.split("_");
      const embedUrl = `https://vk.com/video_ext.php?oid=${oid}&id=${vid}&hd=2`;
      const addRes = await fetch(PLAYLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          password,
          title,
          file_key: `vk-${vkId}`,
          file_url: embedUrl,
          duration_seconds: duration,
          video_type: "vk",
        }),
      });
      const addData = await addRes.json();
      if (!addRes.ok) throw new Error(addData.error || "Ошибка добавления");

      setVideos((prev) => [...prev, addData.video]);
      toast.success(`${title} добавлено в эфир`);
      setVkTitle("");
      setVkUrl("");
      setVkMinutes("");
      setVkSeconds("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка добавления видео из VK");
    } finally {
      setVkSubmitting(false);
    }
  };

  const handleAddKinescope = async () => {
    const title = kinescopeTitle.trim();
    const url = kinescopeUrl.trim();
    const minutes = parseInt(kinescopeMinutes || "0", 10) || 0;
    const seconds = parseInt(kinescopeSeconds || "0", 10) || 0;
    const duration = minutes * 60 + seconds;

    if (!title) {
      toast.error("Укажи название видео");
      return;
    }
    const videoId = parseKinescopeId(url);
    if (!videoId) {
      toast.error("Не удалось распознать ссылку или ID видео Kinescope");
      return;
    }
    if (duration <= 0) {
      toast.error("Укажи длительность видео больше 0");
      return;
    }

    setKinescopeSubmitting(true);
    try {
      const embedUrl = `https://kinescope.io/embed/${videoId}`;
      const addRes = await fetch(PLAYLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          password,
          title,
          file_key: `kinescope-${videoId}`,
          file_url: embedUrl,
          duration_seconds: duration,
          video_type: "kinescope",
        }),
      });
      const addData = await addRes.json();
      if (!addRes.ok) throw new Error(addData.error || "Ошибка добавления");

      setVideos((prev) => [...prev, addData.video]);
      toast.success(`${title} добавлено в эфир`);
      setKinescopeTitle("");
      setKinescopeUrl("");
      setKinescopeMinutes("");
      setKinescopeSeconds("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка добавления видео из Kinescope");
    } finally {
      setKinescopeSubmitting(false);
    }
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

      <div className="admin-add-tabs">
        <button
          type="button"
          className={`admin-add-tab${addMode === "file" ? " admin-add-tab--active" : ""}`}
          onClick={() => setAddMode("file")}
        >
          <Icon name="UploadCloud" size={16} />
          Загрузить файл
        </button>
        <button
          type="button"
          className={`admin-add-tab${addMode === "link" ? " admin-add-tab--active" : ""}`}
          onClick={() => setAddMode("link")}
        >
          <Icon name="Link" size={16} />
          Добавить по ссылке
        </button>
        <button
          type="button"
          className={`admin-add-tab${addMode === "vk" ? " admin-add-tab--active" : ""}`}
          onClick={() => setAddMode("vk")}
        >
          <Icon name="Play" size={16} />
          Добавить из VK
        </button>
        <button
          type="button"
          className={`admin-add-tab${addMode === "kinescope" ? " admin-add-tab--active" : ""}`}
          onClick={() => setAddMode("kinescope")}
        >
          <Icon name="Video" size={16} />
          Добавить из Kinescope
        </button>
      </div>

      {addMode === "file" ? (
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
      ) : addMode === "link" ? (
        <div className="admin-link-form">
          <div className="admin-link-field">
            <label>Название видео</label>
            <Input
              placeholder="Например: Выпуск №12"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
            />
          </div>

          <div className="admin-link-field">
            <label>Прямая ссылка на .mp4</label>
            <Input
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <span className="admin-link-hint">
              Нужна именно прямая ссылка на файл, а не страница просмотра. На Яндекс.Диске нажми «Поделиться» → «Скачать по прямой ссылке»; в Google Диске открой доступ «Всем по ссылке» и замени часть адреса /view на /uc?export=download.
            </span>
          </div>

          <div className="admin-link-field">
            <label>Длительность</label>
            <div className="admin-link-duration">
              <Input
                type="number"
                min={0}
                placeholder="мин"
                value={linkMinutes}
                onChange={(e) => setLinkMinutes(e.target.value)}
              />
              <span>:</span>
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="сек"
                value={linkSeconds}
                onChange={(e) => setLinkSeconds(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleAddByLink} disabled={linkSubmitting}>
            {linkSubmitting ? "Добавление…" : "Добавить в эфир"}
          </Button>
        </div>
      ) : addMode === "vk" ? (
        <div className="admin-link-form">
          <div className="admin-link-field">
            <label>Название видео</label>
            <Input
              placeholder="Например: Выпуск №12"
              value={vkTitle}
              onChange={(e) => setVkTitle(e.target.value)}
            />
          </div>

          <div className="admin-link-field">
            <label>Ссылка на видео VK</label>
            <Input
              placeholder="https://vk.com/video-123456_789012"
              value={vkUrl}
              onChange={(e) => setVkUrl(e.target.value)}
            />
            <span className="admin-link-hint">
              Загрузи ролик в VK Видео (доступ «Всем» или по ссылке) и вставь сюда ссылку на него. Показываться будет через плеер VK, друг за другом с остальными видео в эфире.
            </span>
          </div>

          <div className="admin-link-field">
            <label>Длительность</label>
            <div className="admin-link-duration">
              <Input
                type="number"
                min={0}
                placeholder="мин"
                value={vkMinutes}
                onChange={(e) => setVkMinutes(e.target.value)}
              />
              <span>:</span>
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="сек"
                value={vkSeconds}
                onChange={(e) => setVkSeconds(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleAddVk} disabled={vkSubmitting}>
            {vkSubmitting ? "Добавление…" : "Добавить в эфир"}
          </Button>
        </div>
      ) : (
        <div className="admin-link-form">
          <div className="admin-link-field">
            <label>Название видео</label>
            <Input
              placeholder="Например: Выпуск №12"
              value={kinescopeTitle}
              onChange={(e) => setKinescopeTitle(e.target.value)}
            />
          </div>

          <div className="admin-link-field">
            <label>Ссылка на видео Kinescope</label>
            <Input
              placeholder="https://kinescope.io/embed/xxxxxxxxxxxxxxxxxxxxxx"
              value={kinescopeUrl}
              onChange={(e) => setKinescopeUrl(e.target.value)}
            />
            <span className="admin-link-hint">
              Вставь ссылку на видео из Kinescope (или просто ID видео) — можно скопировать её из embed-кода в личном кабинете Kinescope. Показываться будет через плеер Kinescope, друг за другом с остальными видео в эфире.
            </span>
          </div>

          <div className="admin-link-field">
            <label>Длительность</label>
            <div className="admin-link-duration">
              <Input
                type="number"
                min={0}
                placeholder="мин"
                value={kinescopeMinutes}
                onChange={(e) => setKinescopeMinutes(e.target.value)}
              />
              <span>:</span>
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="сек"
                value={kinescopeSeconds}
                onChange={(e) => setKinescopeSeconds(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleAddKinescope} disabled={kinescopeSubmitting}>
            {kinescopeSubmitting ? "Добавление…" : "Добавить в эфир"}
          </Button>
        </div>
      )}

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
              {v.video_type === "vk" && <Icon name="Play" size={14} className="admin-item-badge" />}
              {v.video_type === "link" && <Icon name="Link" size={14} className="admin-item-badge" />}
              {v.video_type === "kinescope" && <Icon name="Video" size={14} className="admin-item-badge" />}
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