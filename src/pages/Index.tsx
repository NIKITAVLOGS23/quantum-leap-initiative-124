export default function Index() {
  return (
    <>
      <div className="grain-overlay" />

      <header className="header">
        <div className="logo">GOLD<span style={{ color: "var(--primary)" }}>★</span>TV</div>
        <nav>
          <a href="#">Эфир</a>
          <a href="#">Клипы</a>
          <a href="#">О канале</a>
          <a href="#">Архив</a>
        </nav>
        <button className="btn-cta">Смотреть онлайн</button>
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
              <button className="btn-cta" style={{ background: "var(--primary)", color: "white" }}>
                Смотреть эфир
              </button>
              <button className="btn-cta" style={{ background: "white" }}>
                Архив клипов
              </button>
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
            &nbsp; ★ ЛУЧШИЕ ХИТЫ ВСЕХ ВРЕМЁН ★ КЛИПЫ 70-х 80-х 90-х ★ ПРЯМОЙ ЭФИР ★ ТОЛЬКО ЗОЛОТАЯ МУЗЫКА ★ GOLDTV ОНЛАЙН ★
            ЛУЧШИЕ ХИТЫ ВСЕХ ВРЕМЁН ★ КЛИПЫ 70-х 80-х 90-х ★ ПРЯМОЙ ЭФИР ★ ТОЛЬКО ЗОЛОТАЯ МУЗЫКА ★ GOLDTV ОНЛАЙН
          </div>
        </div>

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
            {/* Card 1 */}
            <div className="menu-card">
              <span className="menu-tag">В эфире сейчас</span>
              <img
                src="https://cdn.poehali.dev/projects/5f50b5e6-b10e-40a7-9e10-ae9fd795cd71/files/85608bfc-0c0d-4000-90b4-c9874b84e51d.jpg"
                alt="Ретро студия GOLDTV"
              />
              <div className="menu-card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h3>Золотые 70-е</h3>
                  <span className="price">🔴 Live</span>
                </div>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  Лучшие хиты эпохи диско, рок и соул — в непрерывном эфире.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="menu-card">
              <span className="menu-tag" style={{ background: "var(--secondary)" }}>
                Хиты 80-х
              </span>
              <img
                src="https://cdn.poehali.dev/projects/5f50b5e6-b10e-40a7-9e10-ae9fd795cd71/files/dc375963-7de7-4500-862e-909124fc339d.jpg"
                alt="Клипы 80-х"
              />
              <div className="menu-card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h3>Нeon & Синти-поп</h3>
                  <span className="price">⏱ 21:00</span>
                </div>
                <p style={{ fontSize: "14px", color: "#666" }}>Электронные ритмы и яркие клипы золотого десятилетия.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="menu-card">
              <span className="menu-tag" style={{ background: "var(--accent)", color: "var(--dark)" }}>
                Ностальгия
              </span>
              <img
                src="https://cdn.poehali.dev/projects/5f50b5e6-b10e-40a7-9e10-ae9fd795cd71/files/fe59b3ec-8752-4625-a5f7-4e7a9a7d1193.jpg"
                alt="Золотые пластинки"
              />
              <div className="menu-card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h3>Виниловый архив</h3>
                  <span className="price">⏱ 23:00</span>
                </div>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  Редкие записи и культовые альбомы в оцифрованном качестве.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="retro-vibe">
          <div>
            <h2 className="vibe-title">ЗВУЧИТ КАК ТОГДА.</h2>
            <p className="vibe-text">
              GOLDTV — это не просто телеканал. Это машина времени в золотую эпоху музыки. Мы вещаем круглосуточно, собирая
              самые яркие клипы и хиты 70-х, 80-х и 90-х годов. Включи — и почувствуй.
            </p>
            <button className="btn-cta" style={{ background: "var(--dark)", color: "white", borderColor: "white" }}>
              О канале
            </button>
          </div>
          <div className="vibe-img"></div>
        </section>

        <section className="section-padding">
          <h2 className="section-title" style={{ marginBottom: "40px", textAlign: "center" }}>
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
      </main>

      <footer>
        <div>
          <div className="footer-logo">GOLD<span style={{ color: "var(--primary)" }}>★</span>TV</div>
          <p style={{ color: "#666", lineHeight: 1.6 }}>
            Музыка, клипы, ностальгия — интернет-канал для тех, кто помнит. Вещаем онлайн 24/7.
          </p>
        </div>
        <div className="footer-links">
          <h4>Навигация</h4>
          <ul>
            <li>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                Эфир
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                Клипы
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                О канале
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                Архив
              </a>
            </li>
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
        <div className="footer-links">
          <h4>Контакты</h4>
          <ul>
            <li>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                Telegram
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                ВКонтакте
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
