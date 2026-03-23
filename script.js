/**
 * Professional Portfolio JavaScript - ULTRA SMOOTH SCROLLING VERSION
 * Features: Native CSS + JS hybrid smooth scroll, physics-based easing, GPU acceleration
 * Author: Professional Developer
 * Version: 3.0 - Ultra Smooth Edition
 */

class PortfolioApp {
    constructor() {
        this.ticking = false;
        this.scrollRaf = null;
        this.resizeRaf = null;
        this.mobileMenuOpen = false;
        this.scrollTarget = 0;
        this.scrollVelocity = 0;
        this.scrollEase = 0.1;
        this.init();
    }

    init() {
        this.initUltraSmoothScroll();
        this.initEventListeners();
        this.initResponsiveNavbar();
        this.initMobileMenu();
        this.initScrollAnimations();
        this.initActiveNavOnScroll();
        this.initScrollProgress();
        this.initTypingEffect();
        this.enableCSSScrollBehavior();
        this.handleResize();
    }

    // ==================== ULTRA SMOOTH SCROLLING (HYBRID) ====================
    initUltraSmoothScroll() {
        // Enable native CSS smooth scrolling as fallback
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Enhanced smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"], .nav-link, [data-scroll]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleUltraSmoothScroll(e));
        });

        // Keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.handleKeyboardScroll(e.key);
            }
        });
    }

    enableCSSScrollBehavior() {
        // GPU-accelerated CSS smooth scrolling
        const style = document.createElement('style');
        style.textContent = `
            html {
                scroll-behavior: smooth;
                scroll-padding-top: 80px;
            }
            * {
                scroll-margin-top: 80px;
            }
            @supports (scroll-behavior: smooth) {
                html {
                    scroll-padding-top: clamp(70px, 10vw, 100px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    handleUltraSmoothScroll(e) {
        e.preventDefault();
        const targetId = this.getTargetId(e.currentTarget);
        const target = document.querySelector(targetId);
        
        if (target) {
            const targetPosition = this.calculateUltraOffsetTop(target);
            this.scrollToUltraSmooth(targetPosition);
            this.updateActiveNavLink(targetId);
            this.closeMobileMenu();
        }
    }

    getTargetId(anchor) {
        return anchor.getAttribute('href') || 
               anchor.dataset.href || 
               anchor.dataset.scroll || 
               '#';
    }

    calculateUltraOffsetTop(target) {
        const navbarHeight = this.getNavbarHeight();
        const viewportHeight = window.innerHeight;
        const scrollOffset = window.innerWidth <= 768 
            ? navbarHeight * 1.2 
            : navbarHeight + 20;
        
        // Smart centering for smaller sections
        const targetHeight = target.offsetHeight;
        const centerOffset = Math.max(0, (viewportHeight - targetHeight) / 3);
        
        return target.offsetTop - scrollOffset - centerOffset;
    }

    getNavbarHeight() {
        const navbar = document.querySelector('.navbar');
        return navbar ? navbar.offsetHeight : 80;
    }

    // ==================== PHYSICS-BASED ULTRA SMOOTH SCROLL ====================
    scrollToUltraSmooth(targetY, velocity = 0) {
        this.scrollTarget = Math.max(0, targetY);
        this.scrollVelocity = velocity;
        
        const animateScroll = () => {
            // Physics-based easing with momentum
            const currentY = window.pageYOffset;
            const distance = this.scrollTarget - currentY;
            
            if (Math.abs(distance) > 1) {
                // Exponential ease-out with momentum preservation
                this.scrollVelocity *= 0.95;
                this.scrollVelocity += distance * this.scrollEase;
                
                window.scrollTo(0, currentY + this.scrollVelocity);
                this.scrollRaf = requestAnimationFrame(animateScroll);
            }
        };

        cancelAnimationFrame(this.scrollRaf);
        this.scrollRaf = requestAnimationFrame(animateScroll);
    }

    // ==================== ENHANCED EASE FUNCTIONS ====================
    smoothScrollTo(targetPosition, duration = 1200, easeFn = this.easeOutQuart) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Multiple easing options - choose the smoothest
            const easedProgress = easeFn(progress);
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < 1) {
                this.scrollRaf = requestAnimationFrame(animate);
            }
        };

        cancelAnimationFrame(this.scrollRaf);
        this.scrollRaf = requestAnimationFrame(animate);
    }

    // Ultra-smooth easing functions
    easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
    easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }
    easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
    easeOutCirc(t) { return 1 - Math.sqrt(1 - Math.pow(t, 2)); }
    easeOutBack(t) { 
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + Math.pow(t - 1, 3) * ((c1 + 1) * (t - 1) + c1);
    }

    // ==================== KEYBOARD SMOOTH SCROLL ====================
    handleKeyboardScroll(direction) {
        const scrollAmount = window.innerHeight * 0.7;
        const targetY = direction === 'ArrowDown' 
            ? window.pageYOffset + scrollAmount 
            : window.pageYOffset - scrollAmount;
            
        this.scrollToUltraSmooth(targetY);
    }

    // ==================== RESPONSIVE NAVBAR ====================
    initResponsiveNavbar() {
        this.updateNavbarState();
    }

    updateNavbarState() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const scrolled = window.scrollY > 10; // Reduced threshold for smoother transition
        navbar.classList.toggle('scrolled', scrolled);
        navbar.classList.toggle('top', !scrolled);
    }

    // ==================== MOBILE MENU (UNCHANGED) ====================
    initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', (e) => this.toggleMobileMenu(e));
        navLinks.addEventListener('click', () => this.closeMobileMenu());
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && !e.target.closest('.hamburger')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu(e) {
        e.stopPropagation();
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const body = document.body;

        hamburger?.classList.toggle('active', this.mobileMenuOpen);
        navLinks?.classList.toggle('active', this.mobileMenuOpen);
        body.classList.toggle('menu-open', this.mobileMenuOpen);
    }

    closeMobileMenu() {
        if (!this.mobileMenuOpen) return;

        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const body = document.body;

        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
        body.classList.remove('menu-open');
        this.mobileMenuOpen = false;
    }

    // ==================== OPTIMIZED PERFORMANCE (ENHANCED) ====================
    initEventListeners() {
        // Ultra-efficient RAF throttled scroll
        window.addEventListener('scroll', this.debounceScroll.bind(this), { 
            passive: true 
        });
        window.addEventListener('resize', this.debounceResize.bind(this), { 
            passive: true 
        });
        window.addEventListener('orientationchange', this.debounceResize.bind(this), { 
            passive: true 
        });
    }

    debounceScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateNavbarState();
                this.updateActiveNavLink();
                this.updateScrollProgress();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    debounceResize() {
        cancelAnimationFrame(this.resizeRaf);
        this.resizeRaf = requestAnimationFrame(() => {
            this.handleResize();
        });
    }

    // ... (rest of the methods remain the same - scroll animations, active nav, etc.)
    // For brevity, keeping the existing implementations for other features

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: this.getResponsiveRootMargin()
        };

        this.scrollObserver = new IntersectionObserver(
            (entries) => this.handleScrollAnimation(entries),
            observerOptions
        );

        this.observeAnimationElements();
    }

    getResponsiveRootMargin() {
        return window.innerWidth <= 768 
            ? '0px 0px -20% 0px' 
            : window.innerWidth <= 1024 
            ? '0px 0px -15% 0px' 
            : '0px 0px -10% 0px';
    }

    observeAnimationElements() {
        const selectors = [
            '.section-title', 
            '.project-card', 
            '.contact-text', 
            '.about-content', 
            '.skill-tag', 
            '.profile-pic', 
            '.hero-content',
            '[data-animate]'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                this.scrollObserver?.observe(el);
            });
        });
    }

    handleScrollAnimation(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay ? 
                    parseInt(entry.target.dataset.delay) : 
                    index * 150;
                
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    entry.target.classList.add('animated');
                }, delay);
            }
        });
    }

    initActiveNavOnScroll() {
        this.updateActiveNavLink();
    }

    updateActiveNavLink(targetId = null) {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = targetId ? targetId.replace('#', '') : '';

        if (!targetId) {
            const scrollOffset = this.getNavbarHeight() + 100;
            sections.forEach(section => {
                if (window.scrollY >= (section.offsetTop - scrollOffset)) {
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', href === current);
        });
    }

    initScrollProgress() {
        this.progressElement = document.querySelector('.progress-bar');
    }

    updateScrollProgress() {
        if (!this.progressElement) return;
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.max(0, Math.min(100, (scrollTop / docHeight) * 100));
        this.progressElement.style.width = `${scrollPercent}%`;
    }

    initTypingEffect() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;

        const text = subtitle.textContent.trim();
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid var(--green-primary)';
        
        this.typeWriter(subtitle, text);
    }

    typeWriter(element, text, speed = 60) {
        let i = 0;
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                this.startCursorBlink(element);
            }
        };
        setTimeout(type, 800);
    }

    startCursorBlink(element) {
        let visible = true;
        const blink = setInterval(() => {
            element.style.borderRight = visible ? 
                '2px solid var(--green-primary)' : 
                'none';
            visible = !visible;
        }, 500);

        setTimeout(() => {
            clearInterval(blink);
            element.style.borderRight = 'none';
        }, 4000);
    }

    handleResize() {
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
            this.initScrollAnimations();
        }
        this.closeMobileMenu();
    }

    destroy() {
        if (this.scrollObserver) this.scrollObserver.disconnect();
        if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
        if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
        window.removeEventListener('scroll', this.debounceScroll);
        window.removeEventListener('resize', this.debounceResize);
        document.documentElement.style.scrollBehavior = '';
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// ==================== SERVICE WORKER ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}