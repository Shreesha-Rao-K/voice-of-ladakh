/*
 * ==============================================================================
 *  COPYRIGHT (c) 2026 SHREESHA RAO K. ALL RIGHTS RESERVED.
 *  This code is the exclusive property of Shreesha Rao K.
 *  Unauthorized copying, reproduction, or distribution of this file,
 *  via any medium, is strictly prohibited.
 * ==============================================================================
 */

// Initialize GSAP and ScrollTrigger with GPU Compositor Acceleration
gsap.registerPlugin(ScrollTrigger);
gsap.config({ force3D: true });

/* ==========================================================================
   CINEMATIC PRELOADER & INTERACTIVE CURSOR
   ========================================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Cinematic Preloader (with load event acceleration)
const preloaderProgress = document.querySelector('.preloader-progress');
const preloader = document.querySelector('.preloader');
let progress = { val: 0 };
let preloaderDismissed = false;

function dismissPreloader() {
    if (preloaderDismissed || !preloader) return;
    preloaderDismissed = true;
    gsap.to(preloader, {
        yPercent: -100,
        duration: 0.8,
        ease: "expo.inOut",
        onComplete: () => {
            preloader.remove();
            ScrollTrigger.refresh();
        }
    });
}

if (preloader && preloaderProgress) {
    if (prefersReducedMotion) {
        preloader.remove();
    } else {
        const preloaderTween = gsap.to(progress, {
            val: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                const p = Math.round(progress.val);
                preloaderProgress.textContent = `${p}%`;
                document.querySelector('.preloader-text')?.style.setProperty('--progress', `${p}%`);
            },
            onComplete: dismissPreloader
        });

        window.addEventListener('load', () => {
            gsap.to(progress, { val: 100, duration: 0.3, onComplete: dismissPreloader });
        });
    }
}

// 2. Custom Cursor (Enabled only on pointer-fine and non-reduced-motion devices)
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.custom-cursor-follower');

if (cursor && follower && !prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    gsap.ticker.add(() => {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
    });

    const clickables = document.querySelectorAll('a, button, .card-glass, .card-minimal');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover-active');
            follower.classList.add('magnetic-active');
            gsap.to(el, { scale: 1.02, duration: 0.3, ease: "power2.out" });
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover-active');
            follower.classList.remove('magnetic-active');
            gsap.to(el, { scale: 1, x: 0, y: 0, duration: 0.3, ease: "power2.out" });
        });
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const elX = rect.left + rect.width / 2;
            const elY = rect.top + rect.height / 2;
            gsap.to(el, {
                x: (mouseX - elX) * 0.1,
                y: (mouseY - elY) * 0.1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

/* ========================================================================== */

// Smooth Scrolling with prefers-reduced-motion support
let lenis = null;
const progressBar = document.querySelector('.reading-progress-bar');

if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out
        smoothWheel: true
    });

    lenis.on('scroll', (e) => {
        ScrollTrigger.update();
        if (progressBar && e.scroll !== undefined) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progressPercent = totalHeight > 0 ? (e.scroll / totalHeight) * 100 : 0;
            progressBar.style.width = `${Math.min(100, Math.max(0, progressPercent))}%`;
        }
    });

    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(500, 33);
} else {
    window.addEventListener('scroll', () => {
        if (progressBar) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progressPercent = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
            progressBar.style.width = `${Math.min(100, Math.max(0, progressPercent))}%`;
        }
    }, { passive: true });
}

// Soundscape Web Audio API Ambient Synthesizer
const soundToggle = document.getElementById('soundToggle');
let audioCtx = null;
let osc1 = null, osc2 = null, masterGain = null, filter = null;
let isAudioPlaying = false;

function initAudioSynth() {
    if (audioCtx) return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtx = new AudioContextClass();

        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

        filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, audioCtx.currentTime);

        osc1 = audioCtx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(108, audioCtx.currentTime); // 108Hz Deep Ambient Base

        osc2 = audioCtx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(216, audioCtx.currentTime); // Harmonic 216Hz

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(audioCtx.destination);

        osc1.start();
        osc2.start();
    } catch (e) {
        console.warn("Web Audio API not supported in this browser environment.", e);
    }
}

if (soundToggle) {
    soundToggle.addEventListener('click', () => {
        if (!audioCtx) initAudioSynth();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

        isAudioPlaying = !isAudioPlaying;
        soundToggle.classList.toggle('playing', isAudioPlaying);
        soundToggle.setAttribute('aria-pressed', isAudioPlaying ? 'true' : 'false');

        if (masterGain && audioCtx) {
            if (isAudioPlaying) {
                masterGain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 1.5);
            } else {
                masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
            }
        }
    });
}

// Data Cursor Text States Engine
if (cursor) {
    const dataCursors = document.querySelectorAll('[data-cursor]');
    dataCursors.forEach(el => {
        const label = el.getAttribute('data-cursor');
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-text-active');
            cursor.textContent = label;
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-text-active');
            cursor.textContent = '';
        });
    });
}

// Navbar styling on scroll
const navbar = document.getElementById('navbar');
if (navbar) {
    ScrollTrigger.create({
        start: "top -50",
        end: 99999,
        toggleClass: { className: 'scrolled', targets: navbar }
    });
}

// Heading Animations (Motion-sensitive)
if (!prefersReducedMotion && typeof SplitType !== 'undefined') {
    const titles = document.querySelectorAll('.scene-title, .text-5xl, h1');
    titles.forEach(title => {
        const split = new SplitType(title, { types: 'lines, words', lineClass: 'split-line' });
        gsap.from(split.words, {
            y: 100,
            opacity: 0,
            rotationZ: 5,
            duration: 1.2,
            stagger: 0.04,
            ease: "expo.out",
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

// Setup Cinematic Scenes
const scenes = document.querySelectorAll('.scene');

scenes.forEach((scene) => {
    const bgImage = scene.querySelector('.cinematic-img');
    const scrubReveals = scene.querySelectorAll('.scrub-reveal');
    const staggerReveals = scene.querySelectorAll('.stagger-reveal');

    if (!prefersReducedMotion) {
        // Premium Clip-Path Reveal with Scale
        if (bgImage) {
            if (!bgImage.parentElement.classList.contains('clip-reveal-container')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'clip-reveal-container';
                wrapper.style.width = '100%';
                wrapper.style.height = '100%';
                wrapper.style.position = 'absolute';
                wrapper.style.top = '0';
                wrapper.style.left = '0';
                bgImage.parentNode.insertBefore(wrapper, bgImage);
                wrapper.appendChild(bgImage);
                bgImage.classList.add('clip-reveal-img');
            }

            gsap.to(bgImage.parentElement, {
                clipPath: "inset(0% 0 0 0)",
                ease: "expo.out",
                scrollTrigger: {
                    trigger: scene,
                    start: "top 80%",
                    end: "center center",
                    scrub: 1.5
                }
            });

            gsap.to(bgImage, {
                scale: 1,
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: scene,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Scrub reveal
        if (scrubReveals.length > 0) {
            gsap.from(scrubReveals, {
                opacity: 0,
                y: 40,
                scrollTrigger: {
                    trigger: scene,
                    start: "top 75%",
                    end: "center center",
                    scrub: 1.5
                }
            });
        }

        // Stagger reveal
        if (staggerReveals.length > 0) {
            const children = staggerReveals[0].children;
            gsap.from(children, {
                opacity: 0,
                y: 40,
                stagger: 0.15,
                duration: 1.2,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: scene,
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }
});

// Impact Tickers (Motion-sensitive)
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    if (prefersReducedMotion) {
        stat.innerText = target;
    } else {
        gsap.to(stat, {
            innerText: target,
            duration: 2.5,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: stat,
                start: "top 85%",
                once: true
            }
        });
    }
});

// Modals: Accessible Chapter Map & Evidence Dossiers
const chapterMapModal = document.getElementById('chapterMapModal');
const mapTrigger = document.getElementById('mapTrigger');
const closeMap = document.getElementById('closeMap');

const evidenceModal = document.getElementById('evidenceModal');
const closeEvidence = document.getElementById('closeEvidence');
const evidenceTitle = document.getElementById('evidenceTitle');
const evidenceBody = document.getElementById('evidenceBody');

let lastFocusedElement = null;

function openModal(modalEl) {
    if (!modalEl) return;
    lastFocusedElement = document.activeElement;
    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');
    const focusable = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) focusable[0].focus();
}

function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
}

const dossiers = {
    resignation: {
        title: "Official Cabinet Resignation Brief (July 25, 2026)",
        content: `
            <p><strong>Document Ref:</strong> Rashtrapati Bhavan Press Communiqué (July 25, 2026)</p>
            <p><strong>Action Taken:</strong> Resignation Accepted; Additional Charge Assigned</p>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 1rem 0;">
            <p>Following weeks of student demonstrations at Jantar Mantar and parliamentary deadlocks, Union Education Minister Dharmendra Pradhan submitted his formal resignation to President Droupadi Murmu. The President accepted the resignation and directed Parliamentary Affairs Minister Pralhad Joshi to assume additional charge of the Ministry of Education.</p>
            <p style="margin-top: 0.75rem;"><a href="#source-7" class="cite-link" style="font-size: 0.8rem; text-decoration: underline;">View Primary Reference [7]</a></p>
        `
    },
    wangchuk: {
        title: "Hunger Strike Resolution & Assurances (July 23, 2026)",
        content: `
            <p><strong>Subject:</strong> Sonam Wangchuk</p>
            <p><strong>Resolution:</strong> Fast broken at Medanta Hospital after 26 days</p>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 1rem 0;">
            <p>After being transferred from Safdarjung to Medanta Hospital pursuant to a Delhi High Court order on July 21, Sonam Wangchuk formally concluded his 26-day indefinite fast on July 23 in the presence of Union Ministers J.P. Nadda and Jitendra Singh. The resolution followed direct talks, a joint appeal signed by 65 Members of Parliament, and written commitments addressing testing oversight and student protection.</p>
            <p style="margin-top: 0.75rem;"><a href="#source-6" class="cite-link" style="font-size: 0.8rem; text-decoration: underline;">View Primary Reference [6]</a></p>
        `
    },
    cbi: {
        title: "CBI Judicial Chargesheet: NEET-UG 2026 (July 28, 2026)",
        content: `
            <p><strong>Agency:</strong> Central Bureau of Investigation (CBI)</p>
            <p><strong>Status:</strong> 13 Accused Indicted; Continued Probe Sanctioned</p>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 1rem 0;">
            <p>On July 28, 2026, the CBI submitted its initial comprehensive chargesheet before the Special Court, naming 13 individuals—including examination translators, testing center administrators, and coaching intermediaries—for criminal conspiracy and breach of testing integrity. The court granted authorization for further forensic probes.</p>
            <p style="margin-top: 0.75rem;"><a href="#source-8" class="cite-link" style="font-size: 0.8rem; text-decoration: underline;">View Primary Reference [8]</a></p>
        `
    }
};

function openEvidenceModal(key) {
    const doc = dossiers[key];
    if (!doc) return;
    if (evidenceTitle) evidenceTitle.textContent = doc.title;
    if (evidenceBody) evidenceBody.innerHTML = doc.content;
    openModal(evidenceModal);
}

if (mapTrigger) mapTrigger.addEventListener('click', () => openModal(chapterMapModal));
if (closeMap) closeMap.addEventListener('click', () => closeModal(chapterMapModal));
if (closeEvidence) closeEvidence.addEventListener('click', () => closeModal(evidenceModal));

// Interactive Dossier Cards: Click & Keyboard (Enter/Space)
document.querySelectorAll('[data-evidence]').forEach(card => {
    const trigger = () => {
        const key = card.getAttribute('data-evidence');
        openEvidenceModal(key);
    };
    card.addEventListener('click', trigger);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trigger();
        }
    });
});

// Close Modals on Backdrop Click
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal(backdrop);
    });
});

// Keyboard Chapter Navigation ('M' for Map, 'J' Next, 'K' Prev, 'ESC' Dismiss)
// Arrow keys are intentionally NOT hijacked to respect native smooth scrolling.
const sceneIds = ['epicenter', 'foundation', 'politics', 'crackdown', 'global', 'aftermath', 'stats', 'sources'];
let currentSceneIndex = 0;

document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    if (e.key === 'm' || e.key === 'M') {
        if (chapterMapModal) {
            chapterMapModal.classList.contains('active') ? closeModal(chapterMapModal) : openModal(chapterMapModal);
        }
    } else if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.active').forEach(b => closeModal(b));
    } else if (e.key === 'j' || e.key === 'J') {
        currentSceneIndex = Math.min(sceneIds.length - 1, currentSceneIndex + 1);
        const targetEl = document.getElementById(sceneIds[currentSceneIndex]);
        if (targetEl) {
            if (lenis) {
                lenis.scrollTo(targetEl);
            } else {
                targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
        }
    } else if (e.key === 'k' || e.key === 'K') {
        currentSceneIndex = Math.max(0, currentSceneIndex - 1);
        const targetEl = document.getElementById(sceneIds[currentSceneIndex]);
        if (targetEl) {
            if (lenis) {
                lenis.scrollTo(targetEl);
            } else {
                targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
        }
    }
});

// Bilingual Language Switcher Engine
const langToggle = document.getElementById('langToggle');
let currentLang = 'EN';

const translations = {
    HI: {
        'VOICE OF LADAKH': 'लद्दाख की आवाज',
        'Epicenter': 'मुख्य केंद्र',
        'Pioneer': 'क्रांतिकारी',
        'Politics': 'राजनीति',
        'Crackdown': 'कार्रवाई',
        'Solidarity': 'एकजुटता',
        'Resolution': 'समाधान',
        'Sources': 'स्रोत व साक्ष्य',
        'SCROLL TO EXPLORE': 'खोजने के लिए स्क्रॉल करें',
        'Resignation & Resolution': 'इस्तीफा और संकल्प'
    },
    EN: {
        'लद्दाख की आवाज': 'VOICE OF LADAKH',
        'मुख्य केंद्र': 'Epicenter',
        'क्रांतिकारी': 'Pioneer',
        'राजनीति': 'Politics',
        'कार्रवाई': 'Crackdown',
        'एकजुटता': 'Solidarity',
        'समाधान': 'Resolution',
        'स्रोत व साक्ष्य': 'Sources',
        'खोजने के लिए स्क्रॉल करें': 'SCROLL TO EXPLORE',
        'इस्तीफा और संकल्प': 'Resignation & Resolution'
    }
};

if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'EN' ? 'HI' : 'EN';
        langToggle.textContent = currentLang;
        langToggle.setAttribute('aria-label', currentLang === 'EN' ? 'Language: English (Switch to Hindi)' : 'Language: Hindi (Switch to English)');

        const dict = translations[currentLang];
        if (!dict) return;

        const allLeafNodes = Array.from(document.body.querySelectorAll('*')).filter(node => node.children.length === 0);
        Object.keys(dict).forEach(key => {
            const val = dict[key];
            allLeafNodes.forEach(node => {
                if (node.textContent.trim() === key) {
                    node.textContent = val;
                }
            });
        });
    });
}

/* ==============================================================================
 *  DOCUMENTARY ATTRIBUTION & CREDITS
 * ============================================================================== */
console.log("%c VOICE OF LADAKH — INDEPENDENT DOCUMENTARY ", "background: #d4af37; color: #0a0a0c; font-size: 13px; font-weight: bold; padding: 4px 8px; border-radius: 2px;");
console.log("%c Curated and developed by Shreesha Rao K.", "font-size: 12px; color: #aaa;");
console.log("%c Primary reporting and methodology cited under #sources.", "font-size: 11px; color: #888;");

// Ensure ScrollTrigger recalculates after images load
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
