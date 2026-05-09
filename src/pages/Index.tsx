import { useState } from "react";
import Icon from "@/components/ui/icon";

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

export default function Index() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const now = new Date();
  const todayIdx = (now.getDay() + 6) % 7; // 0=Пн
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
    <>
      <div className="yt-bg-wrapper">
        <iframe
          className="yt-bg-iframe"
          src="https://www.youtube.com/embed/TJFTQ44JN2k?autoplay=1&mute=1&loop=1&playlist=TJFTQ44JN2k&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        <div className="yt-bg-overlay" />
      </div>
      <div className="grain-overlay" />

      <header className="header">
        <div className="logo">
          <img
            src="https://cdn.poehali.dev/files/0e7d44dc-fa19-4e84-82be-b5d09c8b3026.jpg"
            alt="GOLDTV"
            style={{ height: 48, width: "auto", display: "block" }}
          />
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

        {/* PLAYER COMING SOON */}
        <section id="player" className="section-padding" style={{ background: "var(--dark)" }}>
          <div className="player-soon">
            <div className="player-soon-icon">📺</div>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", color: "white", fontSize: 28, fontWeight: 800, marginBottom: 12, textTransform: "uppercase" }}>
              Эфир скоро запустится
            </h2>
            <p style={{ color: "#888", fontSize: 16, maxWidth: 400, lineHeight: 1.6 }}>
              Мы готовим прямой эфир GOLDTV. Следите за обновлениями — скоро музыка зазвучит здесь!
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 24, justifyContent: "center", flexWrap: "wrap" }}>
              {["70-е", "80-е", "90-е", "24/7", "Ностальгия"].map((tag) => (
                <span key={tag} style={{ background: "var(--primary)", color: "white", padding: "4px 14px", fontWeight: 800, fontSize: 13, border: "2px solid var(--primary)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SCHEDULE */}
        <section id="schedule" className="section-padding">
          <div className="section-header">
            <h2 className="section-title">РАСПИСАНИЕ</h2>
          </div>
          <div className="schedule-tabs">
            {WEEK.map((d, i) => (
              <button
                key={d.day}
                className={`schedule-tab${activeDay === i ? " schedule-tab--active" : ""}`}
                onClick={() => setActiveDay(i)}
              >
                <span>{d.day}</span>
                <span className="schedule-tab-date">{d.date}</span>
              </button>
            ))}
          </div>
          <div className="schedule-grid">
            {activeShows.map((item) => {
              const isCurrent = activeDay === Math.min(todayIdx, 6) && item.time === currentShow.time;
              return (
                <div key={item.time + item.title} className={`schedule-row${isCurrent ? " schedule-row--active" : ""}`}>
                  <div className="schedule-time">{item.time}</div>
                  <div className="schedule-info">
                    <div className="schedule-title">
                      {item.title}
                      {isCurrent && <span className="schedule-live">● СЕЙЧАС</span>}
                    </div>
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
              <span className="menu-tag">Хит эфира</span>
              <img
                src="https://cdn.poehali.dev/files/7b2bdf83-630f-45e9-8116-56be91e92e9d.jpg"
                alt="Золотая шкатулка"
              />
              <div className="menu-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h3>Золотая шкатулка</h3>
                </div>
                <p style={{ fontSize: 14, color: "#666" }}>Коллекция музыкальных сокровищ, бережно хранимых временем. Каждая мелодия здесь — драгоценность: от проникновенных романсов и классики до культовых хитов разных эпох. Откройте шкатулку и позвольте любимым звукам окутать вас теплом, ностальгией и волшебством.</p>
              </div>
            </div>

            <div className="menu-card">
              <span className="menu-tag" style={{ background: "var(--secondary)" }}>
                Хит эфира
              </span>
              <img
                src="https://cdn.poehali.dev/files/ac817aae-3ac2-45fe-b5d4-f403b7d4e308.jpg"
                alt="Non-Stop: 90-е"
              />
              <div className="menu-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h3>Non-Stop: 90–е</h3>
                </div>
                <p style={{ fontSize: 14, color: "#666" }}>Бесконечный поток хитов, под которые танцевали на дискотеках, влюблялись и мечтали. От энергичного европопа до проникновенного гранжа — только те песни, что стали саундтреком целого поколения. Включите и почувствуйте себя снова молодым!</p>
              </div>
            </div>

            <div className="menu-card">
              <span className="menu-tag" style={{ background: "var(--accent)", color: "var(--dark)" }}>
                Хит эфира
              </span>
              <img
                src="https://cdn.poehali.dev/files/cbb175a6-b6b0-4178-beae-9ffcd1a63798.jpg"
                alt="Non-Stop: 00-е"
              />
              <div className="menu-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h3>Non-Stop: 00–е</h3>
                </div>
                <p style={{ fontSize: 14, color: "#666" }}>Перезагрузка вашего плейлиста! R&B‑бит, поп‑панк‑энергия, танцевальные гимны и первые интернет‑хиты. От Black Eyed Peas до Evanescence — всё, что звучало из каждого телефона и колонки в нулевых, теперь нон‑стоп!</p>
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src="https://cdn.poehali.dev/files/5559ff44-6333-40af-92cb-136b7253d17c.jpg"
              alt="GOLDTV"
              style={{ width: "100%", maxWidth: 900, borderRadius: 12, display: "block" }}
            />
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
            <a href="https://t.me/goldtvoldschool" target="_blank" rel="noopener noreferrer" className="social-btn" title="Telegram">
              <Icon name="Send" size={18} />
            </a>
            <a href="#" className="social-btn" title="ВКонтакте">
              <Icon name="Music2" size={18} />
            </a>
            <a href="#" className="social-btn" title="YouTube">
              <Icon name="Youtube" size={18} />
            </a>
            <a href="https://www.tiktok.com/@goldtvoldschool" target="_blank" rel="noopener noreferrer" className="social-btn" title="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
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