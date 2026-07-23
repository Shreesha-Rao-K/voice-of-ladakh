// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Navbar styling on scroll (GSAP optimized)
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
    start: "top -50",
    end: 99999,
    toggleClass: {className: 'scrolled', targets: navbar}
});

// Setup Cinematic Scenes
const scenes = document.querySelectorAll('.scene');

scenes.forEach((scene, i) => {
    // Determine the elements to animate within this scene
    const bgImage = scene.querySelector('.cinematic-img');
    const scrubReveals = scene.querySelectorAll('.scrub-reveal');
    const staggerReveals = scene.querySelectorAll('.stagger-reveal');

    // Subtle parallax on the background image (scrubbing)
    if (bgImage) {
        gsap.to(bgImage, {
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

    // Scrub reveal (text tied precisely to scroll position)
    if (scrubReveals.length > 0) {
        gsap.from(scrubReveals, {
            opacity: 0,
            y: 50,
            scrollTrigger: {
                trigger: scene,
                start: "top 75%",
                end: "center center",
                scrub: 1
            }
        });
    }

    // Stagger reveal (plays animation sequence once scrolled into view)
    if (staggerReveals.length > 0) {
        // Find children to stagger
        const children = staggerReveals[0].children;
        gsap.from(children, {
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: scene,
                start: "top 60%",
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

// Ensure ScrollTrigger recalculates after images load
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
