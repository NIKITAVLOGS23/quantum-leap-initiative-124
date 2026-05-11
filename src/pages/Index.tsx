import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("fade-in--visible"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const WEEK = [
  {
    day: "Пн", date: "6.07",
    shows: [
      { time: "00:00", title: "Золотой Запас" },
      { time: "02:00", title: "Полуночники" },
      { time: "06:00", title: "Утренний Будильник" },
      { time: "08:00", title: "100% Летний Хит" },
      { time: "09:00", title: "Танцевальный Чарт" },
      { time: "10:00", title: "Победитель Битвы" },
      { time: "10:30", title: "Угадай клип по году" },
      { time: "11:40", title: "Топ–10: Лето" },
      { time: "12:20", title: "Хип–Хоп: 2000!" },
      { time: "13:15", title: "Капсула Времени" },
      { time: "14:05", title: "Non-stop: 10-е" },
      { time: "15:00", title: "Битва исполнителей: Britney Spears VS. Christina Aguilera" },
      { time: "16:00", title: "Dancefloor" },
      { time: "17:00", title: "Гламурные 00е" },
      { time: "19:00", title: "Золотой пьедестал" },
      { time: "20:00", title: "Non-Stop 00е" },
      { time: "22:00", title: "Dancefloor files" },
    ],
  },
  {
    day: "Вт", date: "7.07",
    shows: [
      { time: "00:00", title: "Золотая Шкатулка" },
      { time: "03:00", title: "Полуночники" },
      { time: "06:00", title: "Утренний Будильник" },
      { time: "08:00", title: "Русские Файлы: 2000" },
      { time: "09:00", title: "Non Stop 90-е" },
      { time: "10:00", title: "Победитель битвы" },
      { time: "10:30", title: "Топ–10: лучших клипов дня" },
      { time: "11:10", title: "Золотая Шкатулка" },
      { time: "14:00", title: "Капсула Времени" },
      { time: "15:00", title: "Битва исполнителей: Гости из будущего VS. Иванушки" },
      { time: "16:00", title: "Хип–Хоп: 2001" },
      { time: "17:00", title: "Гламурные 00е" },
      { time: "19:00", title: "Назад в 2001-й!" },
      { time: "20:00", title: "Non Stop 00–е" },
      { time: "22:00", title: "Топ–30: Золото недели" },
    ],
  },
  {
    day: "Ср", date: "8.07",
    shows: [
      { time: "00:00", title: "Золотой Запас" },
      { time: "02:00", title: "Полуночники" },
      { time: "05:00", title: "Non–Stop: 90е" },
      { time: "07:00", title: "Утренний Будильник" },
      { time: "09:00", title: "Русские Файлы: 2001" },
      { time: "10:00", title: "Победитель битвы" },
      { time: "10:30", title: "Миллениалы VS Бумеры" },
      { time: "11:30", title: "Топ–10: Лучших клипов дня" },
      { time: "12:10", title: "Назад в 2002!" },
      { time: "14:00", title: "Капсула Времени" },
      { time: "15:00", title: "Битва исполнителей: Pussycat Dolls VS. Destiny's Child" },
      { time: "16:00", title: "Крутой Хит" },
      { time: "17:00", title: "Золотая шкатулка" },
      { time: "19:00", title: "Золотой пьедестал" },
      { time: "20:00", title: "Non–Stop: 00е" },
      { time: "22:00", title: "Dance Chart 2010" },
      { time: "23:00", title: "Flashbacks: 2021" },
    ],
  },
  {
    day: "Чт", date: "9.07",
    shows: [
      { time: "00:00", title: "Золотая Шкатулка" },
      { time: "02:00", title: "Полуночники" },
      { time: "05:00", title: "Dancefloor" },
      { time: "07:00", title: "Утренний Будильник" },
      { time: "09:00", title: "Русские Файлы: 2002" },
      { time: "10:00", title: "Победитель битвы" },
      { time: "10:30", title: "Топ–40: лучшие хиты недели" },
      { time: "13:30", title: "Капсула Времени" },
      { time: "14:00", title: "Золотой запас" },
      { time: "15:00", title: "Битва исполнителей: Глюк'Oza VS. Винтаж" },
      { time: "16:00", title: "Крутой Хит" },
      { time: "17:00", title: "Гламурные 00е" },
      { time: "19:00", title: "Rap & R'N'B jams" },
      { time: "20:00", title: "Non-stop: 00-е" },
      { time: "22:00", title: "100% ЛЕТНИЙ ХИТ" },
      { time: "23:00", title: "Крутой Хит" },
    ],
  },
  {
    day: "Пт", date: "10.07",
    shows: [
      { time: "00:00", title: "Золотой запас" },
      { time: "02:00", title: "Полуночники" },
      { time: "05:00", title: "Non-stop: 90-е" },
      { time: "07:00", title: "Утренний Будильник" },
      { time: "09:00", title: "Русские Файлы: 2003" },
      { time: "10:00", title: "Победитель битвы" },
      { time: "10:30", title: "Угадай клип по году" },
      { time: "11:30", title: "Топ–30: Золото недели" },
      { time: "13:00", title: "Капсула Времени" },
      { time: "14:00", title: "Музыкальный гороскоп" },
      { time: "15:00", title: "Праздник в каждый дом" },
      { time: "16:00", title: "Эволюция: Britney Spears" },
      { time: "17:00", title: "Гламурные 00-е" },
      { time: "19:00", title: "Крутой Хит" },
      { time: "20:00", title: "Non-stop: 00-е" },
      { time: "22:00", title: "Rap & R'N'B jams" },
      { time: "23:00", title: "Dancefloor" },
    ],
  },
  {
    day: "Сб", date: "11.07",
    shows: [
      { time: "00:00", title: "Золотой запас" },
      { time: "02:00", title: "18+ блок" },
      { time: "03:00", title: "Полуночники" },
      { time: "06:00", title: "Утренний Будильник" },
      { time: "08:00", title: "Русские Файлы: 2004" },
      { time: "09:00", title: "Топ–30: Золото недели" },
      { time: "11:00", title: "Назад в 2003-й!" },
      { time: "12:00", title: "Золотая шкатулка" },
      { time: "14:10", title: "Сделано в 10-х" },
      { time: "15:00", title: "100% ЛЕТНИЙ ХИТ" },
      { time: "16:00", title: "Крутой Хит!" },
      { time: "17:00", title: "Гламурные 00-е" },
      { time: "19:00", title: "Hip–Hop Чарт" },
      { time: "20:00", title: "Non-stop: 00-е" },
      { time: "22:00", title: "Dancefloor" },
    ],
  },
  {
    day: "Вс", date: "12.07",
    shows: [
      { time: "00:00", title: "Hot weekend" },
      { time: "02:00", title: "Полуночники" },
      { time: "05:00", title: "Non-stop: 90-е" },
      { time: "07:00", title: "Утренний Будильник" },
      { time: "09:00", title: "Крутой Хит!" },
      { time: "10:00", title: "Топ–40: самые самые" },
      { time: "13:30", title: "100% ХИТ – 2026" },
      { time: "17:00", title: "Золотая шкатулка" },
      { time: "19:00", title: "Танцевальный Чарт" },
      { time: "20:00", title: "Non-stop: 00-е" },
      { time: "22:00", title: "Dancefloor" },
    ],
  },
];

const TAGS = ["70-е", "80-е", "90-е", "2000-е", "Хип-хоп", "Dancefloor", "и ещё"];

export default function Index() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [search, setSearch] = useState("");

  const refMarquee = useFadeIn();
  const refPlayer = useFadeIn();
  const refSchedule = useFadeIn();
  const refShows = useFadeIn();
  const refAbout = useFadeIn();
  const refContact = useFadeIn();

  const now = new Date();
  const todayIdx = (now.getDay() + 6) % 7;
  const [activeDay, setActiveDay] = useState(Math.min(todayIdx, 6));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const activeShows = WEEK[activeDay].shows;
  const currentShow = activeShows.filter((s) => {
    const [h, m] = s.time.split(":").map(Number);
    return h * 60 + m <= currentMinutes;
  }).at(-1) ?? activeShows[0];

  return (
    <div className="bento-page">
      {/* ── VIDEO BACKGROUND ── */}
      <div className="bento-yt-bg">
        <iframe
          className="bento-yt-iframe"
          src="https://www.youtube.com/embed/TJFTQ44JN2k?autoplay=1&mute=1&loop=1&playlist=TJFTQ44JN2k&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
          allow="autoplay; encrypted-media"
        />
        <div className="bento-yt-overlay" />
      </div>

      {/* ── NAVBAR ── */}
      <header className="bento-nav">
        <button className="bento-nav-burger">
          <span /><span /><span />
        </button>
        <div className="bento-nav-logo">
          <img
            src="https://cdn.poehali.dev/files/05500263-150b-4eb0-b6af-4ef8b3cc1291.png"
            alt="GOLDTV"
            style={{ height: 48, width: "auto" }}
          />
        </div>
        <nav className="bento-nav-links">
          <a href="#hero">Эфир</a>
          <a href="#schedule">Расписание</a>
          <a href="#about">О канале</a>
        </nav>
        <div className="bento-nav-right">
          <button className="bento-nav-globe"><Icon name="Globe" size={18} /></button>
          <a href="#contact" className="bento-btn-connect">Написать нам</a>
        </div>
      </header>

      {/* ── HERO BENTO GRID ── */}
      <section id="hero" className="bento-hero-wrap fade-in fade-in--visible">
        <div className="bento-grid">

          {/* Cell 1 — BIG TITLE */}
          <div className="bento-cell bento-cell--title">
            <div className="bento-glow-orb" />
            <h1 className="bento-main-title">
              GOLDTV
              <br />
              <span className="bento-title-accent">ЗОЛОТОЙ ЭФИР</span>
            </h1>
            <a href="#player" className="bento-btn-start">Смотреть →</a>
          </div>

          {/* Cell 2 — COMMUNITY COUNTER */}
          <div className="bento-cell bento-cell--counter">
            <div className="bento-counter-avatars">
              <span className="bento-avatar">🎵</span>
              <span className="bento-avatar">🎶</span>
              <span className="bento-avatar">🎤</span>
            </div>
            <div className="bento-arrow">→</div>
            <div className="bento-counter-num">2K+</div>
            <div className="bento-counter-label">Слушателей</div>
          </div>

          {/* Cell 3 — CIRCLE BADGE */}
          <div className="bento-cell bento-cell--badge">
            <div className="bento-circle-badge">
              <div className="bento-badge-inner">
                <span>24</span>
                <span className="bento-badge-slash">/</span>
                <span>7</span>
              </div>
              <span className="bento-badge-label">В ЭФИРЕ</span>
            </div>
          </div>

          {/* Cell 4 — X DECORATION */}
          <div className="bento-cell bento-cell--x">
            <span className="bento-x-sign">✕</span>
          </div>

          {/* Cell 5 — DESCRIPTION */}
          <div className="bento-cell bento-cell--desc">
            <p>
              GOLDTV — интернет-канал для тех, кто помнит. Лучшие клипы и музыка 70-х, 80-х, 90-х и 2000-х в прямом эфире. Ностальгия 24/7.
            </p>
          </div>

          {/* Cell 6 — TAGS */}
          <div className="bento-cell bento-cell--tags">
            <div className="bento-tags-wrap">
              {TAGS.map((t) => (
                <span key={t} className="bento-tag">{t}</span>
              ))}
            </div>
            <div className="bento-search-row">
              <Icon name="Search" size={14} className="bento-search-icon" />
              <input
                className="bento-search-input"
                placeholder="Найти передачу..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Cell 7 — ABOUT CARD */}
          <div className="bento-cell bento-cell--about">
            <p className="bento-about-text">
              GOLDTV — это не просто телеканал. Это машина времени в золотую эпоху музыки. Мы вещаем круглосуточно, собирая самые яркие клипы и хиты прошлых лет.
            </p>
            <a href="#about" className="bento-explore-link">
              <div className="bento-explore-avatars">
                <span>🎸</span><span>🥁</span>
              </div>
              Узнать больше →
            </a>
          </div>

          {/* Cell 8 — NUMBERED CELL */}
          <div className="bento-cell bento-cell--num">
            <span className="bento-num">01</span>
            <Icon name="ChevronRight" size={20} className="bento-num-icon" />
            <div className="bento-num-wave" />
          </div>

        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div ref={refMarquee} className="bento-marquee fade-in">
        <div className="bento-marquee-inner">
          &nbsp;★ ЛУЧШИЕ ХИТЫ ВСЕХ ВРЕМЁН ★ КЛИПЫ 70-х 80-х 90-х ★ ПРЯМОЙ ЭФИР ★ ТОЛЬКО ЗОЛОТАЯ МУЗЫКА ★ GOLDTV ОНЛАЙН ★ ЛУЧШИЕ ХИТЫ ВСЕХ ВРЕМЁН ★ КЛИПЫ 70-х 80-х 90-х ★ ПРЯМОЙ ЭФИР ★ ТОЛЬКО ЗОЛОТАЯ МУЗЫКА ★ GOLDTV ОНЛАЙН&nbsp;
        </div>
      </div>

      {/* ── PLAYER ── */}
      <section id="player" ref={refPlayer} className="bento-section fade-in">
        <div className="bento-section-header">
          <h2 className="bento-section-title">ПРЯМОЙ ЭФИР</h2>
          <span className="bento-live-badge">● LIVE</span>
        </div>
        <div className="bento-player-card">
          <div className="bento-player-icon">📺</div>
          <h3>Эфир скоро запустится</h3>
          <p>Мы готовим прямой эфир GOLDTV. Следите за обновлениями — скоро музыка зазвучит здесь!</p>
          <div className="bento-tags-row">
            {["70-е", "80-е", "90-е", "2000-е", "Ностальгия"].map((tag) => (
              <span key={tag} className="bento-tag bento-tag--lime">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCHEDULE ── */}
      <section id="schedule" ref={refSchedule} className="bento-section fade-in">
        <div className="bento-section-header">
          <h2 className="bento-section-title">РАСПИСАНИЕ</h2>
        </div>
        <div className="bento-schedule-tabs">
          {WEEK.map((d, i) => (
            <button
              key={d.day}
              className={`bento-tab${activeDay === i ? " bento-tab--active" : ""}`}
              onClick={() => setActiveDay(i)}
            >
              <span>{d.day}</span>
              <span className="bento-tab-date">{d.date}</span>
            </button>
          ))}
        </div>
        <div className="bento-schedule-list stagger-parent">
          {activeShows.map((item, idx) => {
            const isCurrent = activeDay === Math.min(todayIdx, 6) && item.time === currentShow.time;
            return (
              <div key={item.time + item.title} className={`bento-schedule-row stagger-child${isCurrent ? " bento-schedule-row--active" : ""}`} style={{ "--stagger-i": idx } as React.CSSProperties}>
                <div className="bento-schedule-time">{item.time}</div>
                <div className="bento-schedule-title">
                  {item.title}
                  {isCurrent && <span className="bento-live-dot">● СЕЙЧАС</span>}
                </div>
                <Icon name="Music" size={16} style={{ color: isCurrent ? "var(--lime)" : "#444", flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TOP SHOWS ── */}
      <section ref={refShows} className="bento-section fade-in">
        <div className="bento-section-header">
          <h2 className="bento-section-title">ТОП ЭФИРА</h2>
          <a href="#" className="bento-section-link">Весь архив</a>
        </div>
        <div className="bento-cards-grid stagger-parent">
          <div className="bento-show-card stagger-child">
            <span className="bento-show-tag">Хит эфира</span>
            <img src="https://cdn.poehali.dev/files/7b2bdf83-630f-45e9-8116-56be91e92e9d.jpg" alt="Золотая шкатулка" />
            <div className="bento-show-body">
              <h3>Золотая шкатулка</h3>
              <p>Коллекция музыкальных сокровищ, бережно хранимых временем. Каждая мелодия — драгоценность: от романсов до культовых хитов разных эпох.</p>
            </div>
          </div>
          <div className="bento-show-card stagger-child">
            <span className="bento-show-tag bento-show-tag--2">Хит эфира</span>
            <img src="https://cdn.poehali.dev/files/ac817aae-3ac2-45fe-b5d4-f403b7d4e308.jpg" alt="Non-Stop 90-е" />
            <div className="bento-show-body">
              <h3>Non-Stop: 90–е</h3>
              <p>Бесконечный поток хитов, под которые танцевали на дискотеках, влюблялись и мечтали. Только те песни, что стали саундтреком поколения.</p>
            </div>
          </div>
          <div className="bento-show-card stagger-child">
            <span className="bento-show-tag bento-show-tag--3">Хит эфира</span>
            <img src="https://cdn.poehali.dev/files/cbb175a6-b6b0-4178-beae-9ffcd1a63798.jpg" alt="Non-Stop 00-е" />
            <div className="bento-show-body">
              <h3>Non-Stop: 00–е</h3>
              <p>R&B‑бит, поп‑панк‑энергия, танцевальные гимны. От Black Eyed Peas до Evanescence — всё, что звучало в нулевых, теперь нон‑стоп.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" ref={refAbout} className="bento-about-section fade-in">
        <div className="bento-about-glow" />
        <div className="bento-about-content">
          <h2 className="bento-about-title">ЗВУЧИТ КАК ТОГДА.</h2>
          <p className="bento-about-text">
            GOLDTV — это не просто телеканал. Это машина времени в золотую эпоху музыки. Мы вещаем круглосуточно, собирая самые яркие клипы и хиты 70-х, 80-х и 90-х годов. Включи — и почувствуй.
          </p>
          <a href="#contact" className="bento-btn-connect" style={{ display: "inline-flex" }}>Написать нам</a>
        </div>
        <div className="bento-about-img">
          <img
            src="https://cdn.poehali.dev/files/5559ff44-6333-40af-92cb-136b7253d17c.jpg"
            alt="GOLDTV"
          />
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" ref={refContact} className="bento-section fade-in">
        <div className="bento-contact-wrap">
          <h2 className="bento-section-title" style={{ marginBottom: 8 }}>СВЯЗАТЬСЯ</h2>
          <p className="bento-contact-sub">Предложение о сотрудничестве, вопрос или просто привет — пишите!</p>
          {sent ? (
            <div className="bento-form-success">
              <Icon name="CheckCircle" size={40} style={{ color: "var(--lime)" }} />
              <h3>Отправлено!</h3>
              <p>Мы свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bento-form">
              <input className="bento-input" type="text" placeholder="Ваше имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="bento-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <textarea className="bento-input bento-textarea" placeholder="Ваше сообщение..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              <button type="submit" className="bento-btn-submit">Отправить</button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bento-footer">
        <div className="bento-footer-logo">
          <img src="https://cdn.poehali.dev/files/a1a3a0c3-0537-42ac-a9cb-3206d111e4b5.png" alt="GOLDTV" style={{ height: 56, width: "auto" }} />
          <p>Музыка, клипы, ностальгия — вещаем онлайн 24/7.</p>
          <div className="bento-socials">
            <a href="https://t.me/goldtvoldschool" target="_blank" rel="noopener noreferrer" className="bento-social"><Icon name="Send" size={16} /></a>
            <a href="#" className="bento-social"><Icon name="Music2" size={16} /></a>
            <a href="#" className="bento-social"><Icon name="Youtube" size={16} /></a>
            <a href="https://www.tiktok.com/@goldtvoldschool" target="_blank" rel="noopener noreferrer" className="bento-social">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
            </a>
          </div>
        </div>
        <div className="bento-footer-nav">
          <h4>Навигация</h4>
          <ul>
            <li><a href="#hero">Эфир</a></li>
            <li><a href="#schedule">Расписание</a></li>
            <li><a href="#about">О канале</a></li>
            <li><a href="#contact">Контакты</a></li>
          </ul>
        </div>
        <div className="bento-footer-nav">
          <h4>Эфир</h4>
          <ul>
            <li>Пн–Вс: 24 часа</li>
            <li>Прямой эфир онлайн</li>
            <li>Без перерывов</li>
          </ul>
        </div>
        <div className="bento-footer-copy">
          © 2026 GOLDTV. Все права защищены.
        </div>
      </footer>
    </div>
  );
}