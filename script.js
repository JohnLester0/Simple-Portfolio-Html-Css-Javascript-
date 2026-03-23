/**
 * Professional Portfolio JavaScript - SIMPLE & FAST SCROLLING
 * Version: 4.0 - Quick & Responsive
 */

class PortfolioApp {
    constructor() {
        this.ticking = false;
        this.scrollRaf = null;
        this.scrolling = false;
        this.mobileMenuOpen = false;
        this.init();
    }

    init() {
        this.initFastScroll();
        this.initEventListeners();
        this.initMobileMenu();
        this.initScrollEffects();
        this.initTypingEffect();
    }

    // ==================== SIMPLE FAST SCROLLING ====================
    initFastScroll() {
        document.querySelectorAll('a[href^="#"], .nav-link, [data-scroll]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.fastScrollTo(e));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.keyboardScroll(e.key);
            }
        });
    }

    fastScrollTo(e) {
        e.preventDefault();
        if (this.scrolling) return;

        const targetId = this.getTarget(e.currentTarget);
        const target = document.querySelector(targetId);
        
        if (target) {
            const targetPos = target.offsetTop - (window.innerWidth <= 768 ? 100 : 90);
            this.quickScroll(targetPos);
            this.updateActiveNav(targetId);
            this.closeMobileMenu();
        }
    }

    getTarget(anchor) {
        return anchor.getAttribute('href') || anchor.dataset.scroll || '#';
    }

    quickScroll(targetY) {
        if (this.scrolling) return;
        this.scrolling = true;
        
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        const duration = 600; // Fast: 600ms
        const startTime = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fast ease-out (QUICK)
            const ease = 1 - Math.pow(1 - progress, 3);
            window.scrollTo(0, startY + distance * ease);
            
            if (progress < 1) {
                this.scrollRaf = requestAnimationFrame(animate);
            } else {
                this.scrolling = false;
                this.scrollRaf = null;
            }
        };

        if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
        this.scrollRaf = requestAnimationFrame(animate);
    }

    keyboardScroll(direction) {
        if (this.scrolling) return;
        const amount = window.innerHeight * 0.8;
        const targetY = direction === 'ArrowDown' 
            ? window.pageYOffset + amount 
            : window.pageYOffset - amount;
        this.quickScroll(targetY);
    }

    // ==================== OPTIMIZED EVENT LISTENERS ====================
    initEventListeners() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateNavbar();
                    this.updateActiveNav();
                    this.updateProgress();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });

        window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
    }

    // ==================== NAVBAR & PROGRESS ====================
    updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 10);
        }
    }

    updateActiveNav(targetId = null) {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-link');
        let activeId = targetId ? targetId.replace('#', '') : '';

        if (!targetId) {
            const offset = 100;
            sections.forEach(section => {
                if (window.scrollY >= (section.offsetTop - offset)) {
                    activeId = section.id;
                }
            });
        }

        links.forEach(link => {
            const id = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', id === activeId);
        });
    }

    updateProgress() {
        const progress = document.querySelector('.progress-bar');
        if (progress) {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progress.style.width = `${percent}%`;
        }
    }

    // ==================== MOBILE MENU ====================
    initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        if (hamburger) {
            hamburger.addEventListener('click', (e) => this.toggleMenu(e));
        }
        if (navLinks) {
            navLinks.addEventListener('click', () => this.closeMobileMenu());
        }
    }

    toggleMenu(e) {
        e.stopPropagation();
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        document.querySelector('.hamburger')?.classList.toggle('active', this.mobileMenuOpen);
        document.querySelector('.nav-links')?.classList.toggle('active', this.mobileMenuOpen);
        document.body.classList.toggle('menu-open', this.mobileMenuOpen);
    }

    closeMobileMenu() {
        if (!this.mobileMenuOpen) return;
        
        document.querySelector('.hamburger')?.classList.remove('active');
        document.querySelector('.nav-links')?.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.mobileMenuOpen = false;
    }

    // ==================== SCROLL ANIMATIONS ====================
    initScrollEffects() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1, rootMargin: '-10% 0px' });

        // Observe common animation elements
        ['.section-title', '.project-card', '.about-content', '[data-animate]'].forEach(selector => {
            document.querySelectorAll(selector).forEach(el => this.observer.observe(el));
        });
    }

    // ==================== FAST TYPING ====================
    initTypingEffect() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;

        const text = subtitle.textContent.trim();
        subtitle.textContent = '';
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                subtitle.textContent += text[i++];
                setTimeout(type, 30); // VERY FAST typing
            } else {
                // Quick blink then stop
                let blink = true;
                const interval = setInterval(() => {
                    subtitle.style.borderRight = blink ? '2px solid #00ff88' : 'none';
                    blink = !blink;
                }, 200);
                setTimeout(() => clearInterval(interval), 1500);
            }
        };
        setTimeout(type, 200);
    }

    handleResize() {
        this.closeMobileMenu();
    }

    destroy() {
        if (this.observer) this.observer.disconnect();
        if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
    }
}

// ==================== START ====================
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});