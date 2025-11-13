// Particle System for Background
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 100 };
        this.colors = ['#ff0040', '#00a8ff', '#00ffff', '#ff0040'];
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 40000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 3 + 1;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const speedX = (Math.random() - 0.5) * 0.1;
            const speedY = (Math.random() - 0.5) * 0.1;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            this.particles.push({ x, y, size, speedX, speedY, color });
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.particles = [];
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = 1 - (distance / 120);
                    this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    connectToMouse() {
        // Mouse tracking removed for performance
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // Keep particles within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawParticles();
        this.connectParticles();
        // this.connectToMouse(); // Removed for performance
        this.updateParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Smooth scrolling for navigation links
class SmoothScrolling {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Scroll animations for sections
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);
        
        // Observe all sections and cards
        document.querySelectorAll('section, .service-card, .feature-item, .pricing-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Calendly Widget Handling
class CalendlyManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for Calendly to load
        this.waitForCalendly();
    }
    
    waitForCalendly() {
        const checkCalendly = () => {
            if (typeof Calendly !== 'undefined') {
                this.initializeCalendly();
                return;
            }
            setTimeout(checkCalendly, 500);
        };
        
        checkCalendly();
    }
    
    initializeCalendly() {
        // Calendly is now available
        console.log('Calendly widget loaded successfully');
        
        // Add loaded class to remove loading animation
        const calendlyWidget = document.querySelector('.calendly-inline-widget');
        if (calendlyWidget) {
            calendlyWidget.classList.add('loaded');
        }
        
        // Add any additional Calendly configurations here if needed
        if (window.Calendly) {
            // You can add event listeners for Calendly events
            window.addEventListener('message', (e) => {
                if (e.data.event && e.data.event.indexOf('calendly') === 0) {
                    console.log('Calendly event:', e.data.event);
                    // Remove loading state when widget is ready
                    if (e.data.event === 'calendly.event_scheduled') {
                        console.log('Appointment scheduled!');
                    }
                }
            });
        }
    }
}

// CTA Button handling
class CTAManagement {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('.cta-button, .pricing-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = e.target.textContent;
                
                if (buttonText === 'Toplantı Oluştur') {
                    // Scroll to contact section
                    document.querySelector('#contact').scrollIntoView({
                        behavior: 'smooth'
                    });
                } else if (buttonText === 'Başla' || buttonText === 'İletişim') {
                    this.handlePricingClick(buttonText);
                }
            });
        });
    }
    
    handlePricingClick(clickType) {
        // Scroll to contact and highlight contact form
        const contact = document.querySelector('#contact');
        contact.scrollIntoView({
            behavior: 'smooth'
        });
        
        // Add highlighting effect
        contact.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.3)';
        setTimeout(() => {
            contact.style.boxShadow = '';
        }, 2000);
    }
}

// Hamburger Menu and Mobile Nav Handling
class MobileNavigation {
    constructor() {
        this.hamburgerMenu = document.getElementById('hamburgerMenu');
        this.mobileNavOverlay = document.getElementById('mobileNavOverlay');
        this.navLinks = this.mobileNavOverlay ? this.mobileNavOverlay.querySelectorAll('.nav-link') : [];
        this.init();
    }

    init() {
        if (this.hamburgerMenu) {
            this.hamburgerMenu.addEventListener('click', () => this.toggleMenu());
        }
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        this.hamburgerMenu.classList.toggle('active');
        this.mobileNavOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
    }

    closeMenu() {
        this.hamburgerMenu.classList.remove('active');
        this.mobileNavOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Agent Clinics website initialized...');
    
    // Initialize particle system
    const particleSystem = new ParticleSystem();
    
    // Initialize smooth scrolling
    const smoothScrolling = new SmoothScrolling();
    
    // Initialize scroll animations
    const scrollAnimations = new ScrollAnimations();
    
    // Initialize Calendly manager
    const calendlyManager = new CalendlyManager();
    
    // Initialize CTA management
    const ctaManagement = new CTAManagement();

    // Initialize Mobile Navigation
    const mobileNavigation = new MobileNavigation();
    
    console.log('All systems initialized successfully');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Export for debugging
window.AgentClinics = {
    ParticleSystem,
    SmoothScrolling,
    ScrollAnimations,
    CalendlyManager,
    CTAManagement
};