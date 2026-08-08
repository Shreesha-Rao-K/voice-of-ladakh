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
   PREMIUM $20,000 BUDGET ELEMENTS (PRELOADER & CURSOR)
   ========================================================================== */

// 1. Cinematic Preloader
const preloaderTextFill = document.querySelector('.preloader-text::after');
const preloaderProgress = document.querySelector('.preloader-progress');
const preloader = document.querySelector('.preloader');

let progress = { val: 0 };
gsap.to(progress, {
    val: 100,
    duration: 2.5,
    ease: "power2.inOut",
    onUpdate: () => {
        const p = Math.round(progress.val);
        preloaderProgress.textContent = `${p}%`;
        // We use CSS variable or direct style to update the pseudo-element width via JS is tricky, 
        // so we manipulate a CSS variable on the text element.
        document.querySelector('.preloader-text').style.setProperty('--progress', `${p}%`);
    },
    onComplete: () => {
        gsap.to(preloader, {
            yPercent: -100,
            duration: 1,
            ease: "expo.inOut",
            onComplete: () => preloader.remove()
        });
    }
});

// Fix pseudo element animation via inject style
const style = document.createElement('style');
style.innerHTML = `.preloader-text::after { width: var(--progress, 0%); }`;
document.head.appendChild(style);

// 2. Custom Cursor
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.custom-cursor-follower');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let followerX = mouseX;
let followerY = mouseY;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate cursor update
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// Smooth follower animation using GSAP ticker
gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
});

// Add hover effects to all clickable elements (Magnetic interaction)
const clickables = document.querySelectorAll('a, button, .card-glass');
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

/* ========================================================================== */

// Initialize Lenis for Smooth Scrolling (Buttery smooth momentum)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out
    smoothWheel: true
});

const progressBar = document.querySelector('.reading-progress-bar');
lenis.on('scroll', (e) => {
    ScrollTrigger.update();
    if (progressBar && e.scroll !== undefined) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressPercent = (e.scroll / totalHeight) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, progressPercent))}%`;
    }
});

gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(500, 33);

// Soundscape Web Audio API Ambient Synthesizer
const soundToggle = document.getElementById('soundToggle');
let audioCtx = null;
let osc1 = null, osc2 = null, masterGain = null, filter = null;
let isAudioPlaying = false;

function initAudioSynth() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

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
}

if (soundToggle) {
    soundToggle.addEventListener('click', () => {
        if (!audioCtx) initAudioSynth();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        isAudioPlaying = !isAudioPlaying;
        soundToggle.classList.toggle('playing', isAudioPlaying);

        if (isAudioPlaying) {
            masterGain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 1.5);
        } else {
            masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
        }
    });
}

// Data Cursor Text States Engine
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

// Navbar styling on scroll
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
    start: "top -50",
    end: 99999,
    toggleClass: {className: 'scrolled', targets: navbar}
});

// Premium SplitType Heading Animations
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

// Setup Cinematic Scenes
const scenes = document.querySelectorAll('.scene');

scenes.forEach((scene, i) => {
    const bgImage = scene.querySelector('.cinematic-img');
    const scrubReveals = scene.querySelectorAll('.scrub-reveal');
    const staggerReveals = scene.querySelectorAll('.stagger-reveal');

    // Premium Clip-Path Reveal with Scale
    if (bgImage) {
        // Dynamically wrap the image in a clip-path container if not already
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

    // Scrub reveal (Refined to be smoother)
    if (scrubReveals.length > 0) {
        gsap.from(scrubReveals, {
            opacity: 0,
            y: 40,
            scrollTrigger: {
                trigger: scene,
                start: "top 75%",
                end: "center center",
                scrub: 1.5 // Added smoothing to scrub
            }
        });
    }

    // Stagger reveal (Refined ease)
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
});

// Horizontal Scroll for Timeline
const timelineSection = document.getElementById('timeline');
const timelineCards = document.querySelector('.timeline-cards');

if (timelineSection && timelineCards) {
    // Calculate how far to scroll left
    function getScrollAmount() {
        let cardsWidth = timelineCards.scrollWidth;
        let distance = cardsWidth - window.innerWidth + 100; // 100px padding
        // If the content is smaller than the window, don't scroll
        return distance > 0 ? -distance : 0;
    }

    const tween = gsap.to(timelineCards, {
        x: () => getScrollAmount(),
        ease: "none"
    });

    ScrollTrigger.create({
        trigger: timelineSection,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true
    });
}

// GSAP Animated Impact Tickers
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
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
});

// Modals: Chapter Map & Evidence Lightbox
const chapterMapModal = document.getElementById('chapterMapModal');
const mapTrigger = document.getElementById('mapTrigger');
const closeMap = document.getElementById('closeMap');

function openMap() { chapterMapModal.classList.add('active'); }
function closeMapModal() { chapterMapModal.classList.remove('active'); }

if (mapTrigger) mapTrigger.addEventListener('click', openMap);
if (closeMap) closeMap.addEventListener('click', closeMapModal);

// Close Modals on Backdrop Click
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.classList.remove('active');
    });
});

// Keyboard Navigation & Shortcuts ('M', 'J', 'K', 'ESC')
const sceneIds = ['epicenter', 'foundation', 'crackdown', 'aftermath', 'stats'];
let currentSceneIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
        chapterMapModal.classList.contains('active') ? closeMapModal() : openMap();
    } else if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop').forEach(b => b.classList.remove('active'));
    } else if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowDown') {
        currentSceneIndex = Math.min(sceneIds.length - 1, currentSceneIndex + 1);
        const targetEl = document.getElementById(sceneIds[currentSceneIndex]);
        if (targetEl && typeof lenis !== 'undefined') lenis.scrollTo(targetEl);
    } else if (e.key === 'k' || e.key === 'K' || e.key === 'ArrowUp') {
        currentSceneIndex = Math.max(0, currentSceneIndex - 1);
        const targetEl = document.getElementById(sceneIds[currentSceneIndex]);
        if (targetEl && typeof lenis !== 'undefined') lenis.scrollTo(targetEl);
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
        'Crackdown': 'कार्रवाई',
        'Resolution': 'समाधान',
        'SCROLL TO EXPLORE': 'खोजने के लिए स्क्रॉल करें',
        'Resignation & Resolution': 'इस्तीफा और संकल्प'
    },
    EN: {
        'लद्दाख की आवाज': 'VOICE OF LADAKH',
        'मुख्य केंद्र': 'Epicenter',
        'क्रांतिकारी': 'Pioneer',
        'कार्रवाई': 'Crackdown',
        'समाधान': 'Resolution',
        'खोजने के लिए स्क्रॉल करें': 'SCROLL TO EXPLORE',
        'इस्तीफा और संकल्प': 'Resignation & Resolution'
    }
};

if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'EN' ? 'HI' : 'EN';
        langToggle.textContent = currentLang;

        const dict = translations[currentLang];
        if (!dict) return;

        Object.keys(dict).forEach(key => {
            const val = dict[key];
            const elements = document.body.querySelectorAll('*');
            elements.forEach(node => {
                if (node.children.length === 0 && node.textContent.trim() === key) {
                    node.textContent = val;
                }
            });
        });
    });
}


/* ==============================================================================
 *  ANTI-THEFT PROTOCOLS (Property of Shreesha Rao K)
 * ============================================================================== */
// Disable right-click context menu
document.addEventListener('contextmenu', event => event.preventDefault());

// Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) || 
        (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's'))) {
        e.preventDefault();
        console.warn("PROPERTY OF SHREESHA RAO K. ACCESS DENIED.");
    }
});

console.log("%c STOP! ", "font-size: 40px; font-weight: bold; color: red; text-shadow: 2px 2px 0 #000;");
console.log("%c This website, its design, and code are the exclusive property of Shreesha Rao K.", "font-size: 18px; color: yellow;");
console.log("%c Unauthorized cloning, copying, or distribution is strictly prohibited.", "font-size: 16px; color: white;");

// Ensure ScrollTrigger recalculates after images load
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
