// script.js - Client side logic for Calicut Stories

document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    const navLinks = document.querySelectorAll('.nav-link, .btn-nav');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal, .reveal-serve');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on initial load

    // Form Submission Handling
    const bookingForm = document.getElementById('bookingForm');
    const formMessage = document.getElementById('formMessage');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation check (handled mostly by HTML5 required attribute)
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Confirming...';
            submitBtn.disabled = true;

            // Simulate API request delay
            setTimeout(() => {
                formMessage.textContent = 'Thank you! Your reservation has been successfully confirmed. We look forward to serving you!';
                formMessage.className = 'form-message success';
                bookingForm.reset();

                submitBtn.textContent = 'Confirm Reservation';
                submitBtn.disabled = false;

                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);

            }, 1500);
        });
    }

    // Set minimum date for reservation to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // --- Hero Interaction: Cinematic Steam & Subtle Scroll ---
    const smokeCanvas = document.getElementById('smokeCanvas');
    const heroBg = document.querySelector('.hero-bg-wrapper');

    if (smokeCanvas) {
        const sctx = smokeCanvas.getContext('2d');
        let smokeParticles = [];

        const resize = () => {
            smokeCanvas.width = window.innerWidth;
            smokeCanvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class SmokeParticle {
            constructor() {
                this.reset();
            }

            reset() {
                // Vary emission point across the center of the biriyani area
                this.x = smokeCanvas.width / 2 + (Math.random() - 0.5) * 100;
                this.y = smokeCanvas.height * 0.72 + Math.random() * 40;
                this.size = Math.random() * 15 + 10;
                this.baseSize = this.size;
                this.speedY = Math.random() * 0.4 + 0.2;
                this.speedX = (Math.random() - 0.5) * 0.25; // Subtle drift
                this.opacity = Math.random() * 0.15 + 0.05; // Very subtle
                this.life = 0;
                this.maxLife = Math.random() * 400 + 300;
                this.expansion = Math.random() * 0.08 + 0.05; // Expands as it rises
                this.blur = Math.random() * 5 + 5;
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX + Math.sin(this.life / 50) * 0.1; // Random waver
                this.size += this.expansion;
                this.life++;

                // Fade out towards end of life
                if (this.life > this.maxLife * 0.7) {
                    this.opacity -= 0.0005;
                }

                if (this.life >= this.maxLife || this.opacity <= 0) {
                    this.reset();
                }
            }

            draw() {
                const grad = sctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size
                );

                // Professional soft cloud gradient
                grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
                grad.addColorStop(0.4, `rgba(255, 255, 255, ${this.opacity * 0.5})`);
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                sctx.beginPath();
                sctx.fillStyle = grad;
                sctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                sctx.fill();
            }
        }

        const initSmoke = () => {
            smokeParticles = [];
            for (let i = 0; i < 30; i++) smokeParticles.push(new SmokeParticle());
        };

        const animateSmoke = () => {
            sctx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
            smokeParticles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateSmoke);
        };

        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            if (heroBg && scroll < window.innerHeight) {
                // Almost imperceptible zoom/parallax for ultra-fine feel
                const scale = 1.05 + (scroll * 0.00005);
                heroBg.style.transform = `scale(${scale})`;
                heroBg.style.opacity = 1 - (scroll / (window.innerHeight * 1.5));
            }
        });

        initSmoke();
        animateSmoke();
    }

    // --- Premium Menu Interaction: Modal Detailed View ---
    const menuCards = document.querySelectorAll('.menu-card');
    const menuModal = document.getElementById('menu-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDesc = document.getElementById('modal-desc');
    const modalCloseTriggers = document.querySelectorAll('.modal-close, .modal-overlay, .modal-close-trigger');

    if (menuModal && menuCards.length > 0) {
        menuCards.forEach(card => {
            card.addEventListener('click', () => {
                const name = card.getAttribute('data-name');
                const price = card.getAttribute('data-price');
                const description = card.getAttribute('data-description');
                const imgSrc = card.querySelector('.menu-img').src;

                if (name && price && description) {
                    modalTitle.textContent = name;
                    modalPrice.textContent = price;
                    modalDesc.textContent = description;
                    modalImg.src = imgSrc;
                    modalImg.alt = name;

                    menuModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scroll
                }
            });
        });

        // Close Modal Logic
        modalCloseTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                // If clicking overlay, ensure we're not clicking the content itself
                if (trigger.classList.contains('modal-overlay') && e.target !== trigger) return;

                menuModal.classList.remove('active');
                document.body.style.overflow = 'auto'; // Re-enable scroll
            });
        });

        // Close on Escape Key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuModal.classList.contains('active')) {
                menuModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // --- Menu Categorization & Filtering ---
    const filterItems = document.querySelectorAll('.filter-item');

    if (filterItems.length > 0) {
        filterItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active state in tabs
                filterItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const filter = item.getAttribute('data-filter');

                menuCards.forEach(card => {
                    // Start transition
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        if (filter === 'all' || card.classList.contains(filter)) {
                            card.classList.remove('hidden');
                            // Re-trigger reveal animation style
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        } else {
                            card.classList.add('hidden');
                        }
                    }, 400);
                });
            });
        });
    }

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
