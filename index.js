/* ============================================
   Sattaru Manohar — Portfolio JS
   Scroll animations, navigation, interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn)');

    const handleScroll = () => {
        // Add scrolled class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();


    // === HAMBURGER MENU ===
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    // Close menu on link click
    navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });


    // === SCROLL REVEAL ANIMATION ===
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '-40px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // === COUNTER ANIMATION ===
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                stat.textContent = current + (target >= 100 ? '+' : '+');

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };

            requestAnimationFrame(updateCounter);
        });

        countersAnimated = true;
    };

    // Observe stats section
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsGrid);
    }


    // === TYPING ANIMATION ===
    const typedTextEl = document.getElementById('typedText');
    const phrases = [
        'Digital Transformation',
        'AI & Gen AI Solutions',
        'Data Analytics',
        'Public Sector Advisory',
        'Technology Consulting'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    const typeEffect = () => {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // Pause before typing next
        }

        setTimeout(typeEffect, typingSpeed);
    };

    // Start typing animation after a brief delay
    setTimeout(typeEffect, 1000);


    // === SMOOTH SCROLL FOR NAV LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });


    // === CONTACT FORM HANDLER ===

    // *** PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE ***
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXNFSutaJXPgwuZrFXj3BC9ksdG_CQ7g8u2Ozkvzbs5p0Ay9STjBAMmLwjrEWpYkEE/exec';

    const showToast = (message, type = 'success') => {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="toast-message">${message}</span>
        `;
        container.appendChild(toast);

        // Trigger entrance animation
        requestAnimationFrame(() => toast.classList.add('toast-show'));

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            toast.classList.remove('toast-show');
            toast.classList.add('toast-hide');
            setTimeout(() => toast.remove(), 400);
        }, 5000);
    };

    window.handleFormSubmit = async (e) => {
        e.preventDefault();

        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const subject = document.getElementById('formSubject').value.trim();
        const message = document.getElementById('formMessage').value.trim();

        const btn = e.target.querySelector('.btn');
        const originalHTML = btn.innerHTML;

        // Loading state
        btn.innerHTML = '<span class="btn-spinner"></span> Sending...';
        btn.style.pointerEvents = 'none';
        btn.classList.add('btn-loading');

        // Check if Google Script URL is configured
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            // Fallback to mailto if not configured yet
            const mailtoLink = `mailto:Manoharansiddarth@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Enquiry from ' + name)}&body=${encodeURIComponent(`Hi Manohar,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`)}`;
            window.open(mailtoLink, '_blank');
            showToast('Opening email client as fallback...', 'success');
            btn.innerHTML = originalHTML;
            btn.style.pointerEvents = '';
            btn.classList.remove('btn-loading');
            e.target.reset();
            return;
        }

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            });

            // Google Apps Script with no-cors returns opaque response,
            // so we assume success if no network error
            showToast('Message sent successfully! I\'ll get back to you soon. 🚀', 'success');
            e.target.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Something went wrong. Opening email client instead...', 'error');

            // Fallback to mailto
            const mailtoLink = `mailto:Manoharansiddarth@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Enquiry from ' + name)}&body=${encodeURIComponent(`Hi Manohar,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`)}`;
            window.open(mailtoLink, '_blank');
        } finally {
            btn.innerHTML = originalHTML;
            btn.style.pointerEvents = '';
            btn.classList.remove('btn-loading');
        }
    };


    // === STAGGER REVEAL FOR GRIDS ===
    const staggerContainers = document.querySelectorAll('.skills-container, .education-grid, .projects-grid, .certs-grid');
    staggerContainers.forEach(container => {
        const children = container.querySelectorAll('.reveal');
        children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    });

});
