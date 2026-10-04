# Voice of Ladakh: A Cinematic Chronicle

![Voice of Ladakh](src/computer/hero-banner.jpg)

**Voice of Ladakh** is an independent, cinematic documentary web experience chronicling Sonam Wangchuk's reformist journey, the youth mobilizations at Jantar Mantar, and the nationwide movement for educational transparency and regional representation.

---

## 📖 Documentary Narrative & Scope

The narrative is structured as a vertical, scene-based documentary experience cross-referenced against contemporaneous news reporting, court directives, and official government releases:

- **The Epicenter (Jantar Mantar):** Ground zero for youth assemblies and hunger strikes demanding systemic educational accountability.
- **The Pioneer (Roots & Reforms):** The founding of SECMOL (1988) and indigenous innovations like the Ice Stupa in Ladakh.
- **The Geopolitical Pivot:** The 2019 bifurcation and dialogue with the Leh Apex Body (LAB) and Kargil Democratic Alliance (KDA).
- **The Crackdown & Detention:** The July 18 police intervention at Jantar Mantar under Section 163 prohibitory orders and Wangchuk's subsequent hospitalization.
- **The Global & National Echo:** The July 20 student march toward Parliament ("Cockroach Movement") and coordinated nationwide demonstrations.
- **Resolution & Aftermath:** The July 23 conclusion of Wangchuk's 26-day fast, the July 25 resignation of Union Education Minister Dharmendra Pradhan, and ongoing institutional inquiries.
- **Sources & Methodology:** Dedicated citation layer mapping all major historical assertions directly to documented publications (*The Indian Express*, *Reuters*, *Al Jazeera*, *India Today*, and official press communiqués).

---

## 🛠️ Tech Stack & Architecture

- **Semantic HTML5:** Accessible dialogs (`role="dialog"`, `aria-modal="true"`), WCAG AA color contrast, and Schema.org `Article` JSON-LD metadata.
- **Modern Vanilla CSS3:** Dynamic viewport sizing (`dvh`), fluid typography, film grain shaders, and full `@media (prefers-reduced-motion: reduce)` accessibility support.
- **GSAP & ScrollTrigger:** High-performance scroll-driven storytelling and scene reveals.
- **Lenis Smooth Scroll:** Hardware-accelerated kinetic momentum, automatically bypassed when reduced-motion preferences are detected.
- **Web Audio API:** Procedural ambient sound generator for atmospheric immersion with zero external audio assets.

---

## 🚀 Accessibility & Performance Highlights

- **Reduced Motion:** Fully honors user OS preferences by disabling transforms, smoothing, and non-essential animations.
- **Keyboard Navigation:** 
  - `J` / `ArrowDown`: Step to the next documentary chapter.
  - `K` / `ArrowUp`: Step to the previous chapter.
  - `M`: Toggle the Chapter Navigation Map.
  - `ESC`: Dismiss active modal dialogs with focus restoration.
- **Supply-Chain Security:** Critical third-party libraries (GSAP, SplitType, Lenis) pinned to specific versioned CDN releases.
- **Dual-Tier Asset Delivery:** Dedicated image sets optimized specifically for mobile (`src/mobile/`) and desktop (`src/computer/`) viewports.

---

## 💻 Running Locally

### Option A: Static Web Server
Open `index.html` directly in any modern browser, or run a lightweight local static server:
```bash
npx serve .
```

### Option B: Node.js Express Server
```bash
npm install
node server.js
```
The server will bind to the configured port (default: `http://localhost:3000`).

---

## ⚖️ Rights & Attribution

**Curated & Developed by Shreesha Rao K.**  
© 2026 Shreesha Rao K. All Rights Reserved. See [LICENSE](LICENSE) for details.
