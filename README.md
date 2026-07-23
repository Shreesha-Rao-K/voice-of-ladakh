# Voice of Ladakh: A Cinematic Chronicle

![Voice of Ladakh](src/hero-banner.jpg)

**Voice of Ladakh** is an open-source, cinematic documentary website built to chronicle the extraordinary journey of Sonam Wangchuk—from his early life in a remote Himalayan village to his emergence as the spiritual center of a nationwide youth uprising and the face of the Ladakh Autonomy Movement.

## 📖 The Narrative
The website is designed as a deep-scroll, scene-based documentary experience. It covers:
- **Roots & Reforms:** The founding of SECMOL and the invention of the Ice Stupa.
- **The Geopolitical Pivot:** The 2019 abrogation of Article 370 and the formation of the Leh Apex Body (LAB) and Kargil Democratic Alliance (KDA).
- **The Resistance:** A deeply researched horizontal timeline detailing the -40°C fasts, the 21-day "fast unto death," and the grueling 1,000 km "Delhi Chalo Padyatra."
- **The 2026 Climax:** The explosive Jantar Mantar protests and the subsequent youth-led "Chalo Sansad" march.

## 🛠️ Tech Stack & Architecture
This project is a highly optimized, static Single Page Application (SPA).
- **HTML5:** Semantic, accessible markup structured into `100vh` cinematic scenes.
- **Vanilla CSS3:** Modern custom properties, responsive grids, and immersive gradient overlays.
- **GSAP & ScrollTrigger:** Enterprise-grade animation libraries powering the scroll-scrubbing text reveals and dynamic horizontal timelines.

## 🚀 Key Technical Features
- **Scroll-Driven Storytelling:** Text elements fade and slide sequentially to prevent information overload.
- **Dynamic Horizontal Scroll:** The timeline section mathematically calculates viewport widths to scroll horizontally on vertical wheel inputs.
- **Performance Optimized:** Employs native `loading="lazy"` on heavy background assets to ensure rapid Largest Contentful Paint (LCP) times.
- **Production Secure:** External libraries are secured with Subresource Integrity (SRI) hashes to prevent supply-chain vulnerabilities.

## 💻 Running Locally
No build steps or npm packages are required.
1. Clone the repository:
   ```bash
   git clone https://github.com/Shreesha-Rao-K/voice-of-ladakh.git
   ```
2. Open `index.html` directly in your browser or run a simple local server:
   ```bash
   python -m http.server 8000
   ```
3. Visit `http://localhost:8000`

## ⚖️ License
This project is open-source and available under the [MIT License](LICENSE).
