/**
 * Professional Portfolio JavaScript - ULTRA SMOOTH SCROLLING (OPTIMIZED)
 * Fixed: RAF conflicts, excessive RAF calls, scroll jank, memory leaks
 * Version: 3.1 - Performance Optimized
 */

class PortfolioApp {
    constructor() {
        this.ticking = false;
        this.scrollRaf = null;
        this.resizeRaf = null;
        this.scrolling = false; // NEW: Prevent scroll conflicts
        this.mobileMenuOpen = false;
        this.scrollTarget = 0;
        this.scrollVelocity = 0;
        this.scrollEase = 0.12; // Slightly faster easing
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

    // ==================== FIXED ULTRA SMOOTH SCROLLING ====================
    initUltraSmoothScroll() {
        // Disable native CSS scroll behavior to prevent conflicts
        document.documentElement.style.scrollBehavior = 'auto';
        
        document.querySelectorAll('a[href^="#"], .nav-link, [data-scroll]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleUltraSmoothScroll(e));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.handleKeyboardScroll(e.key);
            }
        });
    }

    enableCSSScrollBehavior() {
        // Simplified CSS - only for non-JS scroll
        const style = document.createElement('style');
        style.textContent = `
            html { scroll-padding-top: clamp(70px, 10vw, 100px); }
            * { scroll-margin-top: clamp(70px, 10vw, 100px); }
        `;
        document.head.appendChild(style);
    }

    handleUltraSmoothScroll(e) {
        e.preventDefault();
        const targetId = this.getTargetId(e.currentTarget);
        const target = document.querySelector(targetId);
        
        if (target && !this.scrolling) {
            const targetPosition = this.calculateUltraOffsetTop(target);
            this.scrollToUltraSmooth(targetPosition);
            this.updateActiveNavLink(targetId);
            this.closeMobileMenu();
        }
    }

    getTargetId(anchor) {
        return anchor.getAttribute('href') || 
               anchor.dataset.href || 
               anchor.dataset.scroll || '#';
    }

    calculateUltraOffsetTop(target) {
        const navbarHeight = this.getNavbarHeight();
        const viewportHeight = window.innerHeight;
        const scrollOffset = window.innerWidth <= 768 
            ? navbarHeight * 1.2 
            : navbarHeight + 20;
        
        const targetHeight = target.offsetHeight;
        const centerOffset = Math.max(0, (viewportHeight - targetHeight) / 3);
        
        return target.offsetTop - scrollOffset - centerOffset;
    }

    getNavbarHeight() {
        const navbar = document.querySelector('.navbar');
        return navbar ? navbar.offsetHeight : 80;
    }

    // ==================== OPTIMIZED PHYSICS-BASED SCROLL ====================
    scrollToUltraSmooth(targetY) {
        if (this.scrolling) return; // Prevent multiple scrolls
        
        this.scrolling = true;
        this.scrollTarget = Math.max(0, targetY);
        this.scrollVelocity = 0;
        
        const animateScroll = (time) => {
            const currentY = window.pageYOffset;
            const distance = this.scrollTarget - currentY;
            
            if (Math.abs(distance) > 0.5) {
                // Optimized physics: faster convergence, less RAF calls
                this.scrollVelocity = distance * 0.14 + this.scrollVelocity * 0.85;
                window.scrollTo(0, currentY + this.scrollVelocity);
                this.scrollRaf = requestAnimationFrame(animateScroll);
            } else {
                // Snap to exact position
                window.scrollTo(0, this.scrollTarget);
                this.scrolling = false;
                this.scrollRaf = null;
            }
        };

        // Cancel any existing scroll
        if (this.scrollRaf) {
            cancelAnimationFrame(this.scrollRaf);
        }
        this.scrollRaf = requestAnimationFrame(animateScroll);
    }

    // ==================== REMOVED CONFLICTING smoothScrollTo METHOD ====================
    // (This was causing RAF conflicts - removed entirely)

    // ==================== KEYBOARD SCROLL ====================
    handleKeyboardScroll(direction) {
        if (this.scrolling) return;
        const scrollAmount = window.innerHeight * 0.7;
        const targetY = direction === 'ArrowDown' 
            ? window.pageYOffset + scrollAmount 
            : window.pageYOffset - scrollAmount;
            
        this.scrollToUltraSmooth(targetY);
    }

    // ==================== ULTRA-OPTIMIZED EVENT HANDLERS ====================
    initEventListeners() {
        // Single RAF throttled scroll listener
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateAllScrollStates();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
        
        window.addEventListener('resize', () => {
            cancelAnimationFrame(this.resizeRaf);
            this.resizeRaf = requestAnimationFrame(() => this.handleResize());
        }, { passive: true });
        
        window.addEventListener('orientationchange', () => {
            this.handleResize();
        }, { passive: true });
    }

    // ==================== SINGLE RAF UPDATE FOR ALL SCROLL EFFECTS ====================
    updateAllScrollStates() {
        this.updateNavbarState();
        this.updateActiveNavLink();
        this.updateScrollProgress();
    }

    // ==================== RESPONSIVE NAVBAR ====================
    updateNavbarState() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const scrolled = window.scrollY > 10;
        navbar.classList.toggle('scrolled', scrolled);
        navbar.classList.toggle('top', !scrolled);
    }

    // ==================== MOBILE MENU (OPTIMIZED) ====================
    initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', (e) => this.toggleMobileMenu(e));
        navLinks.addEventListener('click', () => this.closeMobileMenu());
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

    // ==================== OPTIMIZED INTERSECTION OBSERVER ====================
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: this.getResponsiveRootMargin()
        };

        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }

        this.scrollObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                        entry.target.classList.add('animate', 'animated');
                    }
                });
            },
            observerOptions
        );

        this.observeAnimationElements();
    }

    getResponsiveRootMargin() {
        return window.innerWidth <= 768 ? '0px 0px -20% 0px' : '0px 0px -10% 0px';
    }

    observeAnimationElements() {
        const selectors = ['.section-title', '.project-card', '.contact-text', '.about-content', '[data-animate]'];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                this.scrollObserver?.observe(el);
            });
        });
    }

    // ==================== ACTIVE NAV ====================
    updateActiveNavLink(targetId = null) {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = targetId ? targetId.replace('#', '') : '';

        if (!targetId) {
            const scrollOffset = this.getNavbarHeight() + 100;
            let maxScroll = -Infinity;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - scrollOffset;
                if (window.scrollY >= sectionTop && sectionTop > maxScroll) {
                    maxScroll = sectionTop;
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', href === current);
        });
    }

    // ==================== PROGRESS BAR ====================
    initScrollProgress() {
        this.progressElement = document.querySelector('.progress-bar');
    }

    updateScrollProgress() {
        if (!this.progressElement) return;
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        this.progressElement.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }

    // ==================== TYPING EFFECT ====================
    initTypingEffect() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;

        const text = subtitle.textContent.trim();
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid var(--green-primary)';
        
        this.typeWriter(subtitle, text);
    }

    typeWriter(element, text, speed = 50) {
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
        setTimeout(type, 500);
    }

    startCursorBlink(element) {
        let visible = true;
        const blink = setInterval(() => {
            element.style.borderRight = visible ? '2px solid var(--green-primary)' : 'none';
            visible = !visible;
        }, 400);

        setTimeout(() => clearInterval(blink), 3000);
    }

    // ==================== RESIZE HANDLER ====================
    handleResize() {
        this.closeMobileMenu();
        this.initScrollAnimations();
    }

    // ==================== CLEANUP ====================
    destroy() {
        if (this.scrollObserver) this.scrollObserver.disconnect();
        if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
        if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});