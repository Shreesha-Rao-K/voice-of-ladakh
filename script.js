/*
 * ==============================================================================
 *  COPYRIGHT (c) 2026 SHREESHA RAO K. ALL RIGHTS RESERVED.
 *  This code is the exclusive property of Shreesha Rao K.
 *  Unauthorized copying, reproduction, or distribution of this file,
 *  via any medium, is strictly prohibited.
 * ==============================================================================
 */

// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

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

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

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

// Fade out the scroll indicator on first scroll
const indicator = document.querySelector('.scrub-fade-out');
if(indicator) {
    gsap.to(indicator, {
        opacity: 0,
        scrollTrigger: {
            trigger: document.body,
            start: "top -50",
            end: "top -150",
            scrub: true
        }
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
