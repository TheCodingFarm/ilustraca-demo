document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar & Active Section Scroll-Spy (Performance Optimized)
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const parallaxImages = document.querySelectorAll('.hero-image img');
    
    // Section to navbar mapping for intermediate page areas
    const sectionToNavMap = {
        'home': 'home',
        'journey': 'home',
        'about': 'about',
        'teach': 'about',
        'courses': 'courses',
        'why-us': 'why-us',
        'reviews': 'testimonials',
        'testimonials': 'testimonials',
        'faq': 'faq',
        'vlogs': 'faq'
    };

    // Cache section bounds to eliminate forced synchronous reflows inside scroll event
    let cachedSections = [];
    function updateSectionBounds() {
        const sectionElements = document.querySelectorAll('header[id], section[id]');
        cachedSections = Array.from(sectionElements).map(section => {
            const secId = section.getAttribute('id');
            const top = section.getBoundingClientRect().top + window.scrollY;
            const height = section.offsetHeight;
            return { id: secId, top, height, targetNav: sectionToNavMap[secId] || null };
        });
    }

    updateSectionBounds();
    window.addEventListener('resize', updateSectionBounds, { passive: true });

    let isTicking = false;
    function onScroll() {
        if (!isTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                // Scroll spy active link updater
                let activeNavTarget = 'home';
                const scrollPosition = scrollY + 120;

                for (let i = 0; i < cachedSections.length; i++) {
                    const sec = cachedSections[i];
                    if (scrollPosition >= sec.top && scrollPosition < sec.top + sec.height) {
                        if (sec.targetNav) activeNavTarget = sec.targetNav;
                    }
                }

                // Near bottom of page fallback to FAQ
                if ((window.innerHeight + Math.round(scrollY)) >= document.documentElement.scrollHeight - 50) {
                    activeNavTarget = 'faq';
                }

                navLinks.forEach(link => {
                    const targetHref = link.getAttribute('href');
                    if (targetHref === `#${activeNavTarget}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Parallax Hero Effect (GPU accelerated)
                if (scrollY < 800) {
                    parallaxImages.forEach(img => {
                        img.style.transform = `translate3d(0, ${scrollY * 0.04}px, 0)`;
                    });
                }

                isTicking = false;
            });
            isTicking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile Menu Toggle
    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (navLinksContainer.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // 2. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. FAQ Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            accordionItems.forEach(accItem => {
                accItem.classList.remove('active');
                accItem.querySelector('.accordion-body').style.display = 'none';
            });
            
            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                item.querySelector('.accordion-body').style.display = 'block';
            }
        });
    });

    // 4. Reviews Slider Simple Logic
    const slider = document.getElementById('reviewsSlider');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    
    if (slider && prevBtn && nextBtn) {
        // Basic scroll logic for the slider
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 350, behavior: 'smooth' });
        });
        
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -350, behavior: 'smooth' });
        });
    }

    // 5. Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    


});

// 8. Standardized Software Showcase Carousel Controller
const softwareSlides = [
    {
        badgeIcon: "fa-solid fa-building-circle-check",
        badge: "ETABS 3D MULTISTORY MODELING",
        title: "High-Rise Seismic & Wind Analysis",
        desc: "Model 3D multi-story commercial towers, assign shear walls, and run dynamic response spectrum analysis per IS 1893.",
        img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80"
    },
    {
        badgeIcon: "fa-solid fa-cubes-stacked",
        badge: "STAAD PRO STEEL ANALYSIS",
        title: "Industrial Steel Trusses & Frames",
        desc: "Design heavy industrial warehouses, steel roof trusses, and crane gantry girders per IS 800 steel code.",
        img: "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=800&auto=format&fit=crop&q=80"
    },
    {
        badgeIcon: "fa-solid fa-layer-group",
        badge: "REVIT BIM COORDINATION",
        title: "Parametric 3D Rebar Detailing",
        desc: "Create coordinated BIM models, extract automated rebar schedules, and export IFC files for multidisciplinary site workflows.",
        img: "https://images.unsplash.com/photo-1504307651254-35680f356f12?w=800&auto=format&fit=crop&q=80"
    },
    {
        badgeIcon: "fa-solid fa-vector-square",
        badge: "SAFE RAFT FOUNDATION",
        title: "Mat Foundation & Soil Spring Checks",
        desc: "Analyze thick raft slabs, pile caps, and soil spring stiffness for non-uniform settlement checks under column loads.",
        img: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=800&auto=format&fit=crop&q=80"
    },
    {
        badgeIcon: "fa-solid fa-pen-ruler",
        badge: "RCDC AUTOMATED DETAILING",
        title: "Ductile Detailing & BBS Output",
        desc: "Generate IS 13920 ductile detailing drawings, bar bending schedules (BBS), and structural design calculation reports.",
        img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80"
    }
];

let activeSoftwareSlide = 0;

function goToSoftwareSlide(index) {
    if (index < 0 || index >= softwareSlides.length) return;
    activeSoftwareSlide = index;

    const slide = softwareSlides[index];
    const imgEl = document.getElementById('softwareCarouselImg');
    const badgeEl = document.getElementById('softwareCarouselBadge');
    const titleEl = document.getElementById('softwareCarouselTitle');
    const descEl = document.getElementById('softwareCarouselDesc');
    const dots = document.querySelectorAll('#softwareCarouselDots .carousel-dot');

    if (imgEl) {
        imgEl.style.opacity = '0.4';
        setTimeout(() => {
            imgEl.src = slide.img;
            imgEl.style.opacity = '1';
        }, 150);
    }
    if (badgeEl) {
        badgeEl.innerHTML = `<i class="${slide.badgeIcon}"></i> ${slide.badge}`;
    }
    if (titleEl) titleEl.textContent = slide.title;
    if (descEl) descEl.textContent = slide.desc;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function stepSoftwareSlide(direction) {
    let newIndex = activeSoftwareSlide + direction;
    if (newIndex < 0) newIndex = softwareSlides.length - 1;
    if (newIndex >= softwareSlides.length) newIndex = 0;
    goToSoftwareSlide(newIndex);
}
