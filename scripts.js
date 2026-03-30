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
            await typeLine(line, idx === 0 ? 34 : 20);
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
    '.project-card',
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

    revealElements.forEach((element, index) => {
        element.classList.add('reveal-on-scroll');
        element.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`);
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