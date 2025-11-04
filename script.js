// Particle System for Background
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.colors = ['#14B8A6', '#0d9488', '#1d4ed8', '#7c3aed'];
        
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
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 3 + 1;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const speedX = (Math.random() - 0.5) * 0.5;
            const speedY = (Math.random() - 0.5) * 0.5;
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
                    this.ctx.strokeStyle = `rgba(20, 184, 166, ${opacity * 0.2})`;
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
        if (this.mouse.x === null || this.mouse.y === null) return;
        
        this.particles.forEach(particle => {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const opacity = 1 - (distance / this.mouse.radius);
                this.ctx.strokeStyle = `rgba(20, 184, 166, ${opacity * 0.4})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
                
                // Move particle towards mouse
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const directionX = dx / distance;
                const directionY = dy / distance;
                particle.x += directionX * force * 2;
                particle.y += directionY * force * 2;
            }
        });
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
        this.connectToMouse();
        this.updateParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Eczane Asistan Widget Control System
class EczaneAsistanWidget {
    constructor() {
        this.voiceButton = null;
        this.buttonText = null;
        this.statusText = null;
        this.statusIndicator = null;
        this.callDurationContainer = null;
        this.durationText = null;
        this.vapiWidget = null;
        
        this.isCallActive = false;
        this.callStartTime = null;
        this.durationInterval = null;
        this.widgetReady = false;
        this.widgetVisible = false;
        
        this.initializeElements();
        this.waitForWidget();
    }
    
    initializeElements() {
        this.voiceButton = document.getElementById('voiceButton');
        this.buttonText = document.getElementById('buttonText');
        this.statusText = document.getElementById('statusText');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.callDurationContainer = document.getElementById('callDurationContainer');
        this.durationText = document.getElementById('durationText');
        this.vapiWidget = document.getElementById('vapiWidget');
        
        if (this.voiceButton) {
            this.voiceButton.addEventListener('click', () => this.handleButtonClick());
        }
        
        // Initially hide widget
        this.hideWidget();
    }
    
    waitForWidget() {
        let attempts = 0;
        const maxAttempts = 30;
        
        const checkWidget = () => {
            attempts++;
            
            if (this.vapiWidget && typeof window.VapiWidget !== 'undefined') {
                console.log('Vapi widget loaded');
                this.widgetReady = true;
                this.updateStatus('Hazır');
                this.setupWidgetEvents();
                return;
            }
            
            if (attempts < maxAttempts) {
                setTimeout(checkWidget, 300);
            } else {
                console.warn('Widget not loaded, using fallback');
                this.widgetReady = true;
                this.updateStatus('Hazır');
            }
        };
        
        checkWidget();
    }
    
    setupWidgetEvents() {
        if (!this.vapiWidget) return;
        
        // Listen for widget events
        this.vapiWidget.addEventListener('call-start', () => {
            console.log('Widget call started');
            this.onCallStart();
        });
        
        this.vapiWidget.addEventListener('call-end', () => {
            console.log('Widget call ended');
            this.onCallEnd();
        });
        
        this.vapiWidget.addEventListener('error', (error) => {
            console.error('Widget error:', error);
            this.onCallError(error);
        });
        
        // Also listen for state changes
        this.vapiWidget.addEventListener('state-change', (event) => {
            console.log('Widget state changed:', event.detail);
            this.handleWidgetStateChange(event.detail);
        });
    }
    
    async handleButtonClick() {
        console.log('Button clicked, widget visible:', this.widgetVisible);
        
        if (!this.widgetReady) {
            this.updateStatus('Başlatılıyor...');
            return;
        }
        
        if (this.widgetVisible) {
            // Hide widget
            this.hideWidget();
            this.updateButtonState('inactive');
            this.updateStatus('Hazır');
            this.buttonText.textContent = 'TIKLA KONUŞ';
        } else {
            // Show widget
            this.showWidget();
            this.updateButtonState('active');
            this.updateStatus('Asistan Hazır');
            this.buttonText.textContent = 'KONUŞ';
        }
    }
    
    showWidget() {
        console.log('Showing widget');
        this.widgetVisible = true;
        
        if (this.vapiWidget) {
            this.vapiWidget.style.opacity = '1';
            this.vapiWidget.style.pointerEvents = 'auto';
            this.vapiWidget.style.transform = 'scale(1)';
            this.vapiWidget.style.zIndex = '1000';
        }
    }
    
    hideWidget() {
        console.log('Hiding widget');
        this.widgetVisible = false;
        
        if (this.vapiWidget) {
            this.vapiWidget.style.opacity = '0';
            this.vapiWidget.style.pointerEvents = 'none';
            this.vapiWidget.style.transform = 'scale(0.8)';
            this.vapiWidget.style.zIndex = '1';
        }
        
        // Stop any active call
        if (this.isCallActive) {
            this.onCallEnd();
        }
    }
    
    handleWidgetStateChange(state) {
        console.log('Handling widget state change:', state);
        
        switch (state) {
            case 'idle':
            case 'ready':
                this.onCallEnd();
                break;
            case 'calling':
            case 'speaking':
            case 'listening':
                this.onCallStart();
                break;
            case 'ended':
            case 'error':
                this.onCallEnd();
                break;
        }
    }
    
    onCallStart() {
        console.log('Handling call start');
        this.isCallActive = true;
        this.callStartTime = Date.now();
        
        // Update UI
        this.updateButtonState('active');
        this.updateStatus('Aktif Görüşme');
        this.buttonText.textContent = 'KONUŞUYOR';
        
        // Show duration display
        if (this.callDurationContainer) {
            this.callDurationContainer.style.display = 'flex';
        }
        
        // Start duration timer
        this.startDurationTimer();
    }
    
    onCallEnd() {
        console.log('Handling call end');
        this.isCallActive = false;
        this.callStartTime = null;
        
        // Update UI
        this.updateButtonState('inactive');
        this.updateStatus('Asistan Hazır');
        this.buttonText.textContent = 'KONUŞ';
        
        // Hide duration display
        if (this.callDurationContainer) {
            this.callDurationContainer.style.display = 'none';
        }
        
        // Stop duration timer
        this.stopDurationTimer();
    }
    
    onCallError(error) {
        console.log('Handling call error:', error);
        this.isCallActive = false;
        this.callStartTime = null;
        
        // Update UI
        this.updateButtonState('error');
        this.updateStatus('Bağlantı hatası');
        this.buttonText.textContent = 'KONUŞ';
        
        // Hide duration display
        if (this.callDurationContainer) {
            this.callDurationContainer.style.display = 'none';
        }
        
        // Stop duration timer
        this.stopDurationTimer();
        
        // Reset after 3 seconds
        setTimeout(() => {
            this.updateButtonState('inactive');
            this.updateStatus('Asistan Hazır');
        }, 3000);
    }
    
    updateButtonState(state) {
        if (!this.voiceButton) return;
        
        // Remove all state classes
        this.voiceButton.classList.remove('active', 'error');
        
        // Add appropriate state class
        if (state === 'active') {
            this.voiceButton.classList.add('active');
        } else if (state === 'error') {
            this.voiceButton.classList.add('error');
        }
        
        // Update status indicator
        if (this.statusIndicator) {
            this.statusIndicator.classList.remove('active');
            if (state === 'active') {
                this.statusIndicator.classList.add('active');
            }
        }
    }
    
    startDurationTimer() {
        this.durationInterval = setInterval(() => {
            if (this.callStartTime) {
                const elapsed = Math.floor((Date.now() - this.callStartTime) / 1000);
                this.updateDuration(elapsed);
            }
        }, 1000);
    }
    
    stopDurationTimer() {
        if (this.durationInterval) {
            clearInterval(this.durationInterval);
            this.durationInterval = null;
        }
        if (this.durationText) {
            this.durationText.textContent = '00:00';
        }
    }
    
    updateDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const formatted = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        if (this.durationText) {
            this.durationText.textContent = formatted;
            // Add animation effect
            this.durationText.classList.add('animate');
            setTimeout(() => {
                this.durationText.classList.remove('animate');
            }, 200);
        }
    }
    
    updateStatus(text) {
        if (this.statusText) {
            this.statusText.textContent = text;
        }
    }
}

// Debug function
function debugSystem() {
    const widgetSystem = window.widgetSystem;
    const vapiWidget = document.getElementById('vapiWidget');
    const vapiLoaded = typeof window.VapiWidget !== 'undefined';
    
    console.log('=== Widget System Debug ===');
    console.log('Widget System:', widgetSystem ? '✅ Active' : '❌ Not found');
    console.log('Vapi Widget:', vapiWidget ? '✅ Found' : '❌ Not found');
    console.log('Vapi SDK:', vapiLoaded ? '✅ Loaded' : '❌ Not loaded');
    console.log('Widget Ready:', widgetSystem?.widgetReady ? '✅ Yes' : '❌ No');
    console.log('Widget Visible:', widgetSystem?.widgetVisible ? '✅ Yes' : '❌ No');
    console.log('Call Active:', widgetSystem?.isCallActive ? '🔴 Active' : '⚪ Inactive');
    console.log('Time:', new Date().toISOString());
    
    if (vapiWidget) {
        console.log('Widget Style:', {
            opacity: vapiWidget.style.opacity,
            pointerEvents: vapiWidget.style.pointerEvents,
            transform: vapiWidget.style.transform,
            position: vapiWidget.style.position
        });
    }
    
    return {
        widgetSystem: !!widgetSystem,
        widgetReady: widgetSystem?.widgetReady || false,
        widgetVisible: widgetSystem?.widgetVisible || false,
        callActive: widgetSystem?.isCallActive || false
    };
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing widget system...');
    
    // Initialize particle system
    const particleSystem = new ParticleSystem();
    
    // Initialize widget control system
    const widgetSystem = new EczaneAsistanWidget();
    
    // Store globally for debugging
    window.widgetSystem = widgetSystem;
    window.debugSystem = debugSystem;
    
    console.log('Eczane Asistan Widget System initialized');
    console.log('Run debugSystem() in console to check status');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
        // Hide widget if page is hidden
        if (window.widgetSystem?.widgetVisible) {
            window.widgetSystem.hideWidget();
        }
    }
});

// Export for debugging
window.EczaneAsistan = {
    ParticleSystem,
    EczaneAsistanWidget,
    debugSystem
};