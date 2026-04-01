// Mobile Navigation
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');

if (burger && navLinks) {
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger.classList.remove('toggle');
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    });
});

// Sticky header on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        header.classList.toggle('sticky', window.scrollY > 6);
    }
});

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const subject = document.getElementById('subject')?.value || '';
        const message = document.getElementById('message')?.value || '';

        console.log({ name, email, subject, message });
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

// Hero typewriter animation
const setupHeroTypewriter = () => {
    const lines = document.querySelectorAll('.hero .typewriter[data-text]');
    if (!lines.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        lines.forEach(line => {
            const text = line.getAttribute('data-text') || line.textContent || '';
            line.textContent = text;
            line.classList.remove('is-typing');
        });
        return;
    }

    lines.forEach(line => {
        line.textContent = '';
    });

    const typeLine = (line, speed = 38) => new Promise(resolve => {
        const text = line.getAttribute('data-text') || '';
        let index = 0;
        line.classList.add('is-typing');

        const tick = () => {
            line.textContent += text.charAt(index);
            index += 1;

            if (index < text.length) {
                setTimeout(tick, speed);
            } else {
                line.classList.remove('is-typing');
                resolve();
            }
        };

        if (!text.length) {
            line.classList.remove('is-typing');
            resolve();
            return;
        }

        setTimeout(tick, 220);
    });

    (async () => {
        for (const [idx, line] of lines.entries()) {
            await typeLine(line, idx === 0 ? 50 : 35);
            await new Promise(resolve => setTimeout(resolve, 140));
        }
    })();
};

window.addEventListener('load', setupHeroTypewriter);

// Animate elements while scrolling down the page
const revealSelectors = [
    '.section-title',
    '.about-text',
    '.about-stats .stat-card',
    '.timeline-item',
    '.education-card',
    '.skills-category',
    '.contact-item',
    '.footer-content > div'
].join(', ');

const setupScrollReveal = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = document.querySelectorAll(revealSelectors);

    if (!revealElements.length) {
        return;
    }

    if (prefersReducedMotion) {
        revealElements.forEach(element => {
            element.classList.add('is-visible');
        });
        return;
    }

    let aboutCardIndex = 0;

    revealElements.forEach((element, index) => {
        element.classList.add('reveal-on-scroll');

        if (element.matches('.about-stats .stat-card')) {
            element.style.setProperty('--reveal-delay', `${aboutCardIndex * 180}ms`);
            aboutCardIndex += 1;
        } else {
            element.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`);
        }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
};

window.addEventListener('load', setupScrollReveal);

// 3D motion effects (desktop/fine pointer only)
const setup3DMotion = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (prefersReducedMotion || !isFinePointer) {
        return;
    }

    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    const profileImg = document.querySelector('.profile-img');

    if (heroImage && profileImg) {
        const maxTilt = 10;

        heroImage.addEventListener('mousemove', (event) => {
            const rect = heroImage.getBoundingClientRect();
            const offsetX = (event.clientX - rect.left) / rect.width;
            const offsetY = (event.clientY - rect.top) / rect.height;
            const rotateY = (offsetX - 0.5) * (maxTilt * 2);
            const rotateX = (0.5 - offsetY) * (maxTilt * 2);

            profileImg.style.setProperty('--hero-tilt-x', `${rotateX.toFixed(2)}deg`);
            profileImg.style.setProperty('--hero-tilt-y', `${rotateY.toFixed(2)}deg`);
        });

        heroImage.addEventListener('mouseleave', () => {
            profileImg.style.setProperty('--hero-tilt-x', '0deg');
            profileImg.style.setProperty('--hero-tilt-y', '0deg');
        });
    }

    const tiltCards = document.querySelectorAll('.stat-card, .education-card, .skills-category, .project-card, .contact-item');

    tiltCards.forEach(card => {
        card.classList.add('tilt-3d');

        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const offsetX = (event.clientX - rect.left) / rect.width;
            const offsetY = (event.clientY - rect.top) / rect.height;
            const rotateY = (offsetX - 0.5) * 10;
            const rotateX = (0.5 - offsetY) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    if (hero) {
        const updateHeroDepth = () => {
            const scrollValue = Math.min(window.scrollY, 640);
            hero.style.setProperty('--hero-depth-shift', `${scrollValue}px`);
        };

        updateHeroDepth();
        window.addEventListener('scroll', updateHeroDepth, { passive: true });
    }
};

window.addEventListener('load', setup3DMotion);

// Skill level animation
const animateSkills = () => {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    skillLevels.forEach(level => {
        const width = level.style.width || window.getComputedStyle(level).width;
        const targetWidth = level.style.width;
        level.style.width = '0';
        
        setTimeout(() => {
            level.style.width = targetWidth || width;
        }, 100);
    });
};

// Intersection Observer for skill animation
const skillsSection = document.querySelector('.skills');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

if (skillsSection) {
    observer.observe(skillsSection);
}

// ── Project Carousel ────────────────────────────────
const setupProjectCarousel = () => {
    const carousel = document.querySelector('.project-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.project-slide'));
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let current = 0;
    let autoTimer = null;

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', 'Go to project ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));

    const goTo = (index) => {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        current = index;

        track.style.transform = 'translateX(-' + (current * 100) + '%)';

        slides.forEach((s, i) => {
            s.classList.toggle('active', i === current);
        });
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });

        resetAutoPlay();
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Keyboard support
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
    }, { passive: true });

    // Auto-play
    const startAutoPlay = () => {
        autoTimer = setInterval(next, 4000);
    };
    const resetAutoPlay = () => {
        clearInterval(autoTimer);
        startAutoPlay();
    };

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Animate-in when section scrolls into view
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                carousel.classList.add('animate-in');
                carouselObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    carouselObserver.observe(carousel);

    // Init first slide
    goTo(0);
};

window.addEventListener('load', setupProjectCarousel);
