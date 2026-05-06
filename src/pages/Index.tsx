import { useState } from "react";
import Icon from "@/components/ui/icon";

const SCHEDULE = [
  { time: "06:00", title: "Золотое утро", desc: "Хиты 70-х для лёгкого старта дня" },
  { time: "09:00", title: "Диско-волна", desc: "Лучшие танцевальные треки эпохи" },
  { time: "12:00", title: "Рок-полдень", desc: "Классический рок — Beatles, Deep Purple, Uriah Heep" },
  { time: "15:00", title: "Синти-поп 80-х", desc: "Нeon-эстетика и электронные ритмы" },
  { time: "18:00", title: "Прайм-тайм: Легенды", desc: "Культовые клипы и живые концерты" },
  { time: "21:00", title: "Ностальгия 90-х", desc: "Поп и R&B, которые мы помним" },
  { time: "00:00", title: "Ночной эфир", desc: "Медленные хиты и джаз до рассвета" },
];

export default function Index() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const now = new Date();
  const currentHour = now.getHours();
  const currentShow = SCHEDULE.findLast((s) => parseInt(s.time) <= currentHour) ?? SCHEDULE[SCHEDULE.length - 1];

  return (
    <>
      <div className="grain-overlay" />

      <header className="header">
        <div className="logo">
          GOLD<span style={{ color: "var(--primary)" }}>★</span>TV
        </div>
        <nav>
          <a href="#player">Эфир</a>
          <a href="#schedule">Расписание</a>
          <a href="#about">О канале</a>
          <a href="#contact">Связь</a>
        </nav>
        <a href="#player" className="btn-cta">
          Смотреть онлайн
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              МУЗЫКА,
              <br />
              КОТОРАЯ <span>ЖИЛА</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-8 md:mb-10 leading-relaxed text-[#555]">
              Интернет-канал GOLDTV — это лучшие клипы и музыка прошлых эпох. Ностальгия в прямом эфире, 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <a href="#player" className="btn-cta" style={{ background: "var(--primary)", color: "white" }}>
                Смотреть эфир
              </a>
              <a href="#schedule" className="btn-cta" style={{ background: "white" }}>
                Расписание
              </a>
            </div>
          </div>
          <div className="hero-img">
            <div className="sticker">
              В ЭФИРЕ
              <br />
              24 / 7
            </div>
            <div className="floating-tag hidden md:block" style={{ top: "20%", left: "10%" }}>
              #НОСТАЛЬГИЯ
            </div>
            <div className="floating-tag hidden md:block" style={{ bottom: "30%", right: "20%" }}>
              ЗОЛОТО
            </div>
          </div>
        </section>

        <div className="marquee">
          <div className="marquee-content">
            &nbsp; ★ ЛУЧШИЕ ХИТЫ ВСЕХ ВРЕМЁН ★ КЛИПЫ 70-х 80-х 90-х ★ ПРЯМОЙ ЭФИР ★ ТОЛЬКО ЗОЛОТАЯ МУЗЫКА ★ GOLDTV
            ОНЛАЙН ★ ЛУЧШИЕ ХИТЫ ВСЕХ ВРЕМЁН ★ КЛИПЫ 70-х 80-х 90-х ★ ПРЯМОЙ ЭФИР ★ ТОЛЬКО ЗОЛОТАЯ МУЗЫКА ★ GOLDTV
            ОНЛАЙН
          </div>
        </div>

        {/* PLAYER */}
        <section id="player" className="section-padding" style={{ background: "var(--dark)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#e53e3e",
                  display: "inline-block",
                  boxShadow: "0 0 8px #e53e3e",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <span
                style={{
                  color: "white",
                  fontFamily: "Unbounded, sans-serif",
                  fontWeight: 800,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                В эфире сейчас: {currentShow.title}
              </span>
            </div>

            <div className="player-wrapper">
              <iframe
                src="https://www.youtube.com/embed/live_stream?channel=UCxxxxxxxxxxxxxx&autoplay=1"
                title="GOLDTV Live"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>

            <p
              style={{
                color: "#888",
                fontSize: 13,
                marginTop: 12,
                textAlign: "center",
              }}
            >
              Укажи ссылку на свой YouTube-канал или HLS-поток — и эфир заработает здесь
            </p>
          </div>
        </section>

        {/* SCHEDULE */}
        <section id="schedule" className="section-padding">
          <div className="section-header">
            <h2 className="section-title">РАСПИСАНИЕ</h2>
            <span style={{ fontWeight: 800, fontSize: 14, textTransform: "uppercase" }}>Ежедневно</span>
          </div>
          <div className="schedule-grid">
            {SCHEDULE.map((item) => {
              const isCurrent = item.time === currentShow.time;
              return (
                <div key={item.time} className={`schedule-row${isCurrent ? " schedule-row--active" : ""}`}>
                  <div className="schedule-time">{item.time}</div>
                  <div className="schedule-info">
                    <div className="schedule-title">
                      {item.title}
                      {isCurrent && <span className="schedule-live">● СЕЙЧАС</span>}
                    </div>
                    <div className="schedule-desc">{item.desc}</div>
                  </div>
                  <Icon name="Music" size={20} style={{ color: isCurrent ? "var(--primary)" : "#ccc", flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="section-padding">
          <div className="section-header">
            <h2 className="section-title">ТОП ЭФИРА</h2>
            <a
              href="#"
              className="text-sm md:text-base"
              style={{ color: "var(--dark)", fontWeight: 800, textTransform: "uppercase" }}
            >
              Весь архив
            </a>
          </div>

          <div className="menu-grid">
            <div className="menu-card">
              <span className="menu-tag">В эфире сейчас</span>
              <img
                src="https://cdn.poehali.dev/projects/5f50b5e6-b10e-40a7-9e10-ae9fd795cd71/files/85608bfc-0c0d-4000-90b4-c9874b84e51d.jpg"
                alt="Ретро студия GOLDTV"
              />
              <div className="menu-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h3>Золотые 70-е</h3>
                  <span className="price">🔴 Live</span>
                </div>
                <p style={{ fontSize: 14, color: "#666" }}>Лучшие хиты эпохи диско, рок и соул — в непрерывном эфире.</p>
              </div>
            </div>

            <div className="menu-card">
              <span className="menu-tag" style={{ background: "var(--secondary)" }}>
                Хиты 80-х
              </span>
              <img
                src="https://cdn.poehali.dev/projects/5f50b5e6-b10e-40a7-9e10-ae9fd795cd71/files/dc375963-7de7-4500-862e-909124fc339d.jpg"
                alt="Клипы 80-х"
              />
              <div className="menu-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h3>Neon & Синти-поп</h3>
                  <span className="price">⏱ 21:00</span>
                </div>
                <p style={{ fontSize: 14, color: "#666" }}>Электронные ритмы и яркие клипы золотого десятилетия.</p>
              </div>
            </div>

            <div className="menu-card">
              <span className="menu-tag" style={{ background: "var(--accent)", color: "var(--dark)" }}>
                Ностальгия
              </span>
              <img
                src="https://cdn.poehali.dev/projects/5f50b5e6-b10e-40a7-9e10-ae9fd795cd71/files/fe59b3ec-8752-4625-a5f7-4e7a9a7d1193.jpg"
                alt="Золотые пластинки"
              />
              <div className="menu-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h3>Виниловый архив</h3>
                  <span className="price">⏱ 23:00</span>
                </div>
                <p style={{ fontSize: 14, color: "#666" }}>Редкие записи и культовые альбомы в оцифрованном качестве.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="retro-vibe">
          <div>
            <h2 className="vibe-title">ЗВУЧИТ КАК ТОГДА.</h2>
            <p className="vibe-text">
              GOLDTV — это не просто телеканал. Это машина времени в золотую эпоху музыки. Мы вещаем круглосуточно,
              собирая самые яркие клипы и хиты 70-х, 80-х и 90-х годов. Включи — и почувствуй.
            </p>
            <a href="#contact" className="btn-cta" style={{ background: "var(--dark)", color: "white", borderColor: "white", display: "inline-block" }}>
              Написать нам
            </a>
          </div>
          <div className="vibe-img"></div>
        </section>

        <section className="section-padding">
          <h2 className="section-title" style={{ marginBottom: 40, textAlign: "center" }}>
            @GOLDTV
          </h2>
          <div className="social-grid">
            <div className="social-item">
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Концерт"
              />
            </div>
            <div className="social-item">
              <img
                src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Эфир"
              />
            </div>
            <div className="social-item">
              <img
                src="https://images.unsplash.com/photo-1526218626217-dc65a29bb444?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Пластинки"
              />
            </div>
            <div className="social-item">
              <img
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Музыкант"
              />
            </div>
          </div>
        </section>

        {/* CONTACT FORM */}
        <section id="contact" className="section-padding" style={{ borderTop: "var(--border)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 className="section-title" style={{ marginBottom: 12 }}>
              СВЯЗАТЬСЯ
            </h2>
            <p style={{ color: "#666", marginBottom: 40, fontSize: 16 }}>
              Предложение о сотрудничестве, вопрос или просто привет — пишите, мы рады!
            </p>

            {sent ? (
              <div className="form-success">
                <Icon name="CheckCircle" size={40} style={{ color: "var(--primary)", marginBottom: 16 }} />
                <h3 style={{ fontFamily: "Unbounded, sans-serif", fontSize: 20, marginBottom: 8 }}>Отправлено!</h3>
                <p style={{ color: "#666" }}>Мы свяжемся с вами в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label className="form-label">Ваше имя</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Иван Петров"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="ivan@mail.ru"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Сообщение</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Ваше сообщение..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-cta" style={{ background: "var(--primary)", color: "white", width: "100%", fontSize: 16, padding: "16px 24px" }}>
                  Отправить
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer>
        <div>
          <div className="footer-logo">
            GOLD<span style={{ color: "var(--primary)" }}>★</span>TV
          </div>
          <p style={{ color: "#666", lineHeight: 1.6, marginBottom: 20 }}>
            Музыка, клипы, ностальгия — интернет-канал для тех, кто помнит. Вещаем онлайн 24/7.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="#" className="social-btn" title="Telegram">
              <Icon name="Send" size={18} />
            </a>
            <a href="#" className="social-btn" title="ВКонтакте">
              <Icon name="Music2" size={18} />
            </a>
            <a href="#" className="social-btn" title="YouTube">
              <Icon name="Youtube" size={18} />
            </a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Навигация</h4>
          <ul>
            <li><a href="#player" style={{ color: "inherit", textDecoration: "none" }}>Эфир</a></li>
            <li><a href="#schedule" style={{ color: "inherit", textDecoration: "none" }}>Расписание</a></li>
            <li><a href="#about" style={{ color: "inherit", textDecoration: "none" }}>О канале</a></li>
            <li><a href="#contact" style={{ color: "inherit", textDecoration: "none" }}>Контакты</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Эфир</h4>
          <ul>
            <li>Пн–Вс: 24 часа</li>
            <li>Прямой эфир онлайн</li>
            <li>Без перерывов</li>
          </ul>
        </div>
      </footer>
    </>
  );
}
