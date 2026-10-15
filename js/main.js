/**
 * جمعية أخوين الخيرية - Interactive Controller (Refactored & Optimized)
 * Modern Micro-Interactions, Animation Performance, & Robust Form Controls
 */

'use strict';

/* -------------------------------------------------------------------------- */
/* Centralized Site Configuration & Constants                                  */
/* -------------------------------------------------------------------------- */
const SITE_CONFIG = {
  startYear: 2009,
  phone: '01281769685',
  phoneFormatted: '٠١٢٨١٧٦٩٦٨٥',
  email: 'info@akhawein.org',
  whatsappNumber: '201281769685',
  mapsUrl: 'https://maps.app.goo.gl/sVMgkZ7viMpMoRkz5',
  recipientEmail: 'info@akhawein.org'
};

/* -------------------------------------------------------------------------- */
/* Global Utilities                                                           */
/* -------------------------------------------------------------------------- */
function toArabicDigits(value) {
  if (value === null || value === undefined) return '';
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return value.toString().split('').map(d => arabicDigits[d] || d).join('');
}

/* -------------------------------------------------------------------------- */
/* Application Bootstrap                                                      */
/* -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate On Scroll) if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      once: true,
      offset: 40,
      disable: window.innerWidth < 768
    });
  }

  // Initialize all modular controllers
  initScrollProgress();
  initNavbarSticky();
  initScrollSpy();
  initHeroSlider();
  initHeroParallax();
  initCard3DTilt();
  initMagneticButtons();
  initRippleEffect();
  initProgramFilters();
  initStatsCounter();
  initProgressBars();
  initVideoPlayer();
  initCopyToClipboard();
  initForms();
  initVisitorCounter();
  initDynamicYears();
  initMobileDrawer();
  initBackToTopProgress();
  initSmartEmailLinks();
  initCertificatesLightbox();
  initGalleryMedia();
  initDonationTabs();
  initDonationViewSwitcher();
  initFloatingDonateExpand();
  initCauseDetailsModal();
});

/* -------------------------------------------------------------------------- */
/* 1. 3D Card Tilt with Specular Glare & requestAnimationFrame Performance   */
/* -------------------------------------------------------------------------- */
function initCard3DTilt() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;

  const tiltCards = document.querySelectorAll('.program-card, .cause-card, .bank-card, .about-image-wrapper, .media-card');
  if (!tiltCards.length) return;

  tiltCards.forEach(card => {
    let bounds = null;
    let rAF = null;

    function updateBounds() {
      bounds = card.getBoundingClientRect();
    }

    function onMouseMove(e) {
      if (!bounds) updateBounds();

      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
      };

      if (rAF) cancelAnimationFrame(rAF);

      rAF = requestAnimationFrame(() => {
        const maxTilt = 5.5;
        const rotateX = (center.y / (bounds.height / 2)) * -maxTilt;
        const rotateY = (center.x / (bounds.width / 2)) * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
        card.style.setProperty('--mouse-x', `${leftX.toFixed(1)}px`);
        card.style.setProperty('--mouse-y', `${topY.toFixed(1)}px`);
      });
    }

    card.addEventListener('mouseenter', () => {
      updateBounds();
      card.style.transition = 'transform 0.12s ease-out, box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', onMouseMove);

    card.addEventListener('mouseleave', () => {
      if (rAF) cancelAnimationFrame(rAF);
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 2. Magnetic Buttons Micro-Interaction                                      */
/* -------------------------------------------------------------------------- */
function initMagneticButtons() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;

  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-accent, .btn-more-programs, .floating-btn');
  if (!magneticBtns.length) return;

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const pull = 0.22;
      btn.style.transform = `translate(${(x * pull).toFixed(1)}px, ${(y * pull).toFixed(1)}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 3. Click Ripple Wave Animation                                            */
/* -------------------------------------------------------------------------- */
function initRippleEffect() {
  const rippleTargets = document.querySelectorAll('.btn, .filter-btn');
  if (!rippleTargets.length) return;

  rippleTargets.forEach(target => {
    target.style.position = target.style.position || 'relative';
    target.style.overflow = 'hidden';

    target.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      const circle = document.createElement('span');
      circle.classList.add('ripple-wave');
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;

      const existingRipple = this.querySelector('.ripple-wave');
      if (existingRipple) existingRipple.remove();

      this.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 650);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 4. Interactive Hero Parallax Mouse Reactivity                              */
/* -------------------------------------------------------------------------- */
function initHeroParallax() {
  const hero = document.querySelector('.hero-section');
  const heroContent = document.querySelector('.hero-content');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (!hero || !heroContent || isTouch) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX = x * 20;
    mouseY = y * 15;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    heroContent.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
    requestAnimationFrame(animate);
  }
  animate();
}

/* -------------------------------------------------------------------------- */
/* 5. Programs Filter Bar with Smooth Transitions                             */
/* -------------------------------------------------------------------------- */
function initProgramFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.programs-grid .program-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach((card, index) => {
        const category = card.getAttribute('data-category') || 'all';
        const matches = (filter === 'all' || category.includes(filter));

        if (matches) {
          card.classList.remove('filtered-out');
          card.classList.remove('filter-anim');
          void card.offsetWidth; // Force reflow
          card.classList.add('filter-anim');
          card.style.animationDelay = `${(index % 8) * 0.06}s`;
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 6. Copy-to-Clipboard with Confetti Celebration                             */
/* -------------------------------------------------------------------------- */
function initCopyToClipboard() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  if (!copyBtns.length) return;

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const accNumber = btn.getAttribute('data-copy');
      if (!accNumber) return;

      navigator.clipboard.writeText(accNumber).then(() => {
        showToast('تم نسخ رقم الحساب بنجاح: ' + accNumber);

        if (typeof confetti === 'function') {
          const rect = btn.getBoundingClientRect();
          const originX = (rect.left + rect.width / 2) / window.innerWidth;
          const originY = (rect.top + rect.height / 2) / window.innerHeight;
          confetti({
            particleCount: 25,
            spread: 50,
            origin: { x: originX, y: originY },
            colors: ['#d57b1e', '#fcb429', '#10b981', '#ffffff']
          });
        }

        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ!';
        btn.style.color = '#10b981';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.color = '';
        }, 2500);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
        showToast('تم النسخ: ' + accNumber);
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 7. Circular Scroll Progress Ring on Floating Back-To-Top Button            */
/* -------------------------------------------------------------------------- */
function initBackToTopProgress() {
  const backToTopBtn = document.querySelector('.floating-btn.back-to-top');
  if (!backToTopBtn) return;

  function onScroll() {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0;
    backToTopBtn.style.setProperty('--scroll-percent', `${Math.min(100, Math.max(0, progress))}`);

    if (window.scrollY > 180) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -------------------------------------------------------------------------- */
/* 8. ScrollSpy for Active Navbar Links                                       */
/* -------------------------------------------------------------------------- */
function initScrollSpy() {
  const allNavLinks = document.querySelectorAll('.nav-menu .nav-link');
  if (!allNavLinks.length) return;

  const rawPath = window.location.pathname.split('/').filter(Boolean).pop() || 'index';
  const currentNormalized = rawPath.replace(/\.html$/, '').toLowerCase();

  let pageLink = null;
  allNavLinks.forEach(link => {
    const href = (link.getAttribute('href') || '').replace(/\.html$/, '').replace(/^\.\//, '').toLowerCase();
    if (href === currentNormalized || ((currentNormalized === 'index' || currentNormalized === '') && (href === 'index' || href === ''))) {
      pageLink = link;
    }
  });

  const anchorLinks = document.querySelectorAll('.nav-menu .nav-link[href^="#"]');
  if (anchorLinks.length > 0) {
    const sections = document.querySelectorAll('section[id], footer[id]');
    function updateActive() {
      let current = '';
      const scrollY = window.scrollY;
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      if (current) {
        const activeAnchor = document.querySelector(`.nav-menu .nav-link[href="#${current}"]`);
        if (activeAnchor) {
          allNavLinks.forEach(l => l.classList.remove('active'));
          activeAnchor.classList.add('active');
          return;
        }
      }
      if (pageLink) {
        allNavLinks.forEach(l => l.classList.remove('active'));
        pageLink.classList.add('active');
      }
    }
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  } else if (pageLink) {
    allNavLinks.forEach(l => l.classList.remove('active'));
    pageLink.classList.add('active');
  }
}

/* -------------------------------------------------------------------------- */
/* 9. Ease-Out Dynamic Statistics Counters                                    */
/* -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let counted = false;

  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
          const duration = 2000;
          const startTime = performance.now();

          function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.floor(easedProgress * target);
            stat.textContent = current.toLocaleString('ar-EG');
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              stat.textContent = target.toLocaleString('ar-EG');
            }
          }
          requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* -------------------------------------------------------------------------- */
/* 10. Animated Progress Bars                                                 */
/* -------------------------------------------------------------------------- */
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  if (!progressBars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width') || bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, 150);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  progressBars.forEach(bar => {
    const currentWidth = bar.style.width;
    bar.setAttribute('data-width', currentWidth);
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

/* -------------------------------------------------------------------------- */
/* 11. Smart Email Links (Gmail on Desktop, Native Mailto on Mobile)          */
/* -------------------------------------------------------------------------- */
function initSmartEmailLinks() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (!emailLinks.length) return;

  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
      if (!isMobile) {
        e.preventDefault();
        const email = SITE_CONFIG.email;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent('استفسار لجمعية أخوين الخيرية')}`;
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 12. Top Scroll Progress Indicator                                          */
/* -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal > 0) {
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollTotal));
      progressBar.style.transform = `scaleX(${progress})`;
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* -------------------------------------------------------------------------- */
/* 13. Dynamic Experience & Copyright Years Calculation                       */
/* -------------------------------------------------------------------------- */
function initDynamicYears() {
  const currentYear = new Date().getFullYear();
  const years = Math.max(1, currentYear - SITE_CONFIG.startYear);
  const yearsArabic = toArabicDigits(years);
  const yearArabic = toArabicDigits(currentYear);

  // Update experience badge (+17)
  const expYearsElems = document.querySelectorAll('#experienceYears, .experience-years');
  expYearsElems.forEach(elem => {
    elem.textContent = `+${yearsArabic}`;
  });

  // Update inline dynamic experience years text (17)
  const inlineYearsElems = document.querySelectorAll('.dynamic-experience-years, #dynamicExperienceYears');
  inlineYearsElems.forEach(elem => {
    elem.textContent = yearsArabic;
  });

  // Update current year (e.g. 2026 / ٢٠٢٦)
  const currentYearElems = document.querySelectorAll('#currentYear, .current-year');
  currentYearElems.forEach(elem => {
    elem.textContent = yearArabic;
  });
}

/* -------------------------------------------------------------------------- */
/* 14. Navbar Sticky                                                          */
/* -------------------------------------------------------------------------- */
function initNavbarSticky() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* 15. Hero Slider                                                            */
/* -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.querySelector('.slider-nav-prev');
  const nextBtn = document.querySelector('.slider-nav-next');
  const indicators = document.querySelectorAll('.slider-indicators .indicator');
  const sliderContainer = document.querySelector('.hero-section');
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
        slide.style.zIndex = '2';
      } else {
        slide.classList.remove('active');
        slide.style.zIndex = '1';
      }
    });

    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });

    currentSlide = index;
    if (typeof AOS !== 'undefined') AOS.refresh();
  }

  function nextSlide() {
    let nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

  indicators.forEach((ind, i) => {
    ind.addEventListener('click', () => {
      showSlide(i);
      resetTimer();
    });
  });

  function startTimer() {
    slideInterval = setInterval(nextSlide, 6500);
  }

  function resetTimer() {
    clearInterval(slideInterval);
    startTimer();
  }

  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderContainer.addEventListener('mouseleave', () => startTimer());

    // Mobile touch swipe gestures (optimized for RTL Arabic)
    let touchStartX = 0;
    let touchStartY = 0;
    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      // Only trigger if horizontal swipe is dominant and exceeds threshold
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetTimer();
      }
    }, { passive: true });
  }

  showSlide(0);
  startTimer();
}

/* -------------------------------------------------------------------------- */
/* 16. Video Player                                                           */
/* -------------------------------------------------------------------------- */
function initVideoPlayer() {
  const mainVideoBox = document.getElementById('mainVideoBox');
  const inlinePlayVideoBtn = document.getElementById('inlinePlayVideoBtn');
  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-overlay');

  function playVideoInline() {
    if (!mainVideoBox) return;
    mainVideoBox.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/xiiMcPt-WmQ?autoplay=1&rel=0&modestbranding=1" 
        title="تقرير وفيديو جمعية أخوين" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>`;
  }

  if (inlinePlayVideoBtn) {
    inlinePlayVideoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playVideoInline();
    });
  }

  if (mainVideoBox) {
    mainVideoBox.addEventListener('click', () => {
      if (!mainVideoBox.querySelector('iframe')) {
        playVideoInline();
      }
    });
  }

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn || btn.classList.contains('modal-close-btn')) {
        const activeModals = document.querySelectorAll('.modal-overlay.active');
        activeModals.forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 17. Toast Notifications                                                    */
/* -------------------------------------------------------------------------- */
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-circle-check';
  icon.style.color = '#10b981';
  icon.style.fontSize = '1.35rem';

  const textSpan = document.createElement('span');
  textSpan.textContent = String(message || ''); // Safe textContent prevents any DOM XSS

  toast.appendChild(icon);
  toast.appendChild(textSpan);
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* 18. Corner Live Visitor Counter Simulation & Professional Animation        */
/* -------------------------------------------------------------------------- */
function initVisitorCounter() {
  const cornerWidget = document.getElementById('cornerVisitorWidget');
  const cornerPill = document.getElementById('cornerVisitorPill');
  const cornerNum = document.getElementById('cornerVisitorNum');
  const cornerPlus = document.getElementById('cornerPlusIndicator');
  const cornerCardClose = document.getElementById('cornerCardClose');
  
  const heroNum = document.getElementById('heroVisitorCount');
  const heroPlus = document.getElementById('heroCornerInc');
  
  const popupVisitor = document.getElementById('popupVisitorCount');
  const popupViews = document.getElementById('popupViewsCount');
  const popupOnline = document.getElementById('popupOnlineCount');
  const footerVisitor = document.getElementById('footerVisitorCount');
  const statsVisitor = document.getElementById('statsVisitorCount');

  // Realistic, large starting numbers (over 1.48M visitors)
  const BASE_VISITORS = 1486230;
  const BASE_VIEWS = 2841950;

  // Retrieve or initialize from localStorage
  let storedVisitors = parseInt(localStorage.getItem('akhawein_visitor_count'), 10);
  let storedViews = parseInt(localStorage.getItem('akhawein_views_count'), 10);

  if (isNaN(storedVisitors) || storedVisitors < BASE_VISITORS) {
    storedVisitors = BASE_VISITORS;
  }
  if (isNaN(storedViews) || storedViews < BASE_VIEWS) {
    storedViews = BASE_VIEWS;
  }

  // Count each visit / new session realistically
  if (!sessionStorage.getItem('akhawein_session_counted')) {
    storedVisitors += 1;
    storedViews += Math.floor(Math.random() * 3) + 1;
    localStorage.setItem('akhawein_visitor_count', storedVisitors);
    localStorage.setItem('akhawein_views_count', storedViews);
    sessionStorage.setItem('akhawein_session_counted', 'true');
  }

  let currentVisitors = storedVisitors;
  let currentViews = storedViews;
  let currentOnline = Math.floor(Math.random() * 25) + 38;

  function formatCount(num) {
    return num.toLocaleString('ar-EG');
  }

  // Initial smooth roll animation on page load (Count-up effect)
  function animateCountUp(target) {
    const start = target - 32;
    const duration = 1400; // 1.4s
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(start + (target - start) * ease);
      const formatted = formatCount(val);

      if (cornerNum) cornerNum.textContent = formatted;
      if (heroNum) heroNum.textContent = formatted;
      if (popupVisitor) popupVisitor.textContent = formatted;
      if (footerVisitor) footerVisitor.textContent = formatted;
      if (statsVisitor) statsVisitor.textContent = formatted;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        const finalFormatted = formatCount(target);
        if (cornerNum) cornerNum.textContent = finalFormatted;
        if (heroNum) heroNum.textContent = finalFormatted;
        if (popupVisitor) popupVisitor.textContent = finalFormatted;
        if (footerVisitor) footerVisitor.textContent = finalFormatted;
        if (statsVisitor) statsVisitor.textContent = finalFormatted;
      }
    }
    requestAnimationFrame(step);
  }

  // Trigger initial smooth count-up
  animateCountUp(currentVisitors);

  if (popupViews) popupViews.textContent = formatCount(currentViews);
  if (popupOnline) popupOnline.textContent = `${toArabicDigits(currentOnline)} متصفح نشط`;

  // Professional live increment with +1 floating particle and bump effect
  function triggerIncrement() {
    currentVisitors += 1;
    currentViews += Math.floor(Math.random() * 2) + 1;
    localStorage.setItem('akhawein_visitor_count', currentVisitors);
    localStorage.setItem('akhawein_views_count', currentViews);

    const formatted = formatCount(currentVisitors);

    // 1. Update text & add bump animation
    if (cornerNum) {
      cornerNum.textContent = formatted;
      cornerNum.classList.remove('bump');
      void cornerNum.offsetWidth; // trigger reflow
      cornerNum.classList.add('bump');
    }
    if (heroNum) {
      heroNum.textContent = formatted;
      heroNum.classList.remove('bump');
      void heroNum.offsetWidth;
      heroNum.classList.add('bump');
    }
    if (statsVisitor) {
      statsVisitor.textContent = formatted;
      statsVisitor.classList.remove('bump');
      void statsVisitor.offsetWidth;
      statsVisitor.classList.add('bump');
    }
    if (popupVisitor) popupVisitor.textContent = formatted;
    if (footerVisitor) footerVisitor.textContent = formatted;
    if (popupViews) popupViews.textContent = formatCount(currentViews);

    // 2. Trigger floating +1 indicator
    if (cornerPlus) {
      cornerPlus.classList.remove('animate');
      void cornerPlus.offsetWidth;
      cornerPlus.classList.add('animate');
    }
    if (heroPlus) {
      heroPlus.classList.remove('animate');
      void heroPlus.offsetWidth;
      heroPlus.classList.add('animate');
    }
  }

  // Periodic realistic tick every 8 to 12 seconds
  setInterval(() => {
    // 65% chance of incrementing to feel natural
    if (Math.random() > 0.35) {
      triggerIncrement();
    }

    // Minor fluctuation in active online users
    if (popupOnline && Math.random() > 0.4) {
      const delta = Math.floor(Math.random() * 5) - 2;
      currentOnline = Math.max(34, Math.min(85, currentOnline + delta));
      popupOnline.textContent = `${toArabicDigits(currentOnline)} متصفح نشط`;
    }
  }, 9500);

}

/* -------------------------------------------------------------------------- */
/* 19. Forms Submission & Validation Handler                                  */
/* -------------------------------------------------------------------------- */
function initForms() {
  const contactForm = document.getElementById('quickContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let name = (document.getElementById('senderName')?.value || '').trim();
    let phone = (document.getElementById('senderPhone')?.value || '').trim();
    let email = (document.getElementById('senderEmail')?.value || '').trim() || 'غير محدد';
    const typeSelect = document.getElementById('requestType');
    const typeText = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'طلب عام';
    let message = (document.getElementById('senderMessage')?.value || '').trim();

    // Security: Input length boundaries
    if (name.length > 100) name = name.substring(0, 100);
    if (phone.length > 25) phone = phone.substring(0, 25);
    if (email.length > 100) email = email.substring(0, 100);
    if (message.length > 3000) message = message.substring(0, 3000);

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const formStatus = document.getElementById('formStatus');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال الرسالة...';
    }

    if (formStatus) {
      formStatus.style.display = 'none';
      formStatus.innerHTML = '';
    }

    // Fallback WhatsApp message
    const waText = `السلام عليكم ورحمة الله،\nرسالة من موقع جمعية أخوين:\n👤 الاسم: ${name}\n📞 الهاتف: ${phone}\n📧 البريد: ${email}\n📋 نوع الطلب: ${typeText}\n💬 الرسالة: ${message}`;
    const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`;

    // Direct FormSubmit transmission
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${SITE_CONFIG.recipientEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          'الاسم الكريم': name,
          'رقم الهاتف / الواتساب': phone,
          'البريد الإلكتروني': email,
          'نوع الطلب': typeText,
          'تفاصيل الرسالة أو الحالة': message,
          '_subject': `طلب جديد من موقع الجمعية: [${typeText}] - ${name}`,
          '_template': 'table',
          '_captcha': 'false'
        })
      });

      const data = await response.json();

      if (response.ok && data.success === 'true') {
        showToast('تم إرسال رسالتك بنجاح!');
        contactForm.reset();
        if (formStatus) {
          formStatus.style.display = 'none';
          formStatus.innerHTML = '';
        }
      } else if (data.message && /Activation|activation|Activate/i.test(data.message)) {
        showToast('تم إرسال رابط التفعيل إلى بريد الجمعية.');
        contactForm.reset();
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.innerHTML = `
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; color: #1e40af; padding: 1.5rem; border-radius: 12px;">
              <i class="fa-solid fa-envelope-circle-check" style="font-size: 2.2rem; color: #3b82f6; margin-bottom: 0.5rem; display: inline-block;"></i>
              <h4 style="margin: 0.5rem 0; font-size: 1.2rem; font-weight: 700;">تأكيد وتفعيل البريد الإلكتروني</h4>
              <p style="margin: 0 0 0.5rem; font-size: 0.95rem;">تم إرسال رابط تفعيل لمرة واحدة إلى البريد (<strong>${SITE_CONFIG.recipientEmail}</strong>). يرجى فتح البريد والضغط على رابط التفعيل (Activate Form) لمرة واحدة فقط لتصل كافة الرسائل القادمة إلى بريدكم فوراً.</p>
            </div>
          `;
        }
      } else {
        throw new Error(data.message || 'فشل في الإرسال');
      }
    } catch (error) {
      console.error('Email send error:', error);
      showToast('تعذر الإرسال عبر البريد. يمكنك التواصل عبر واتساب.');
      if (formStatus) {
        formStatus.style.display = 'block';
        formStatus.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid #ef4444; color: #991b1b; padding: 1.25rem; border-radius: 12px;">
            <p style="margin: 0 0 0.75rem; font-weight: 600;">تعذر الإرسال التلقائي عبر البريد حالياً. يمكنك إرسال نفس الرسالة مباشرة عبر واتساب:</p>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; background: #25D366; border-color: #25D366; padding: 0.6rem 1.4rem; border-radius: 8px; color: #fff; text-decoration: none; font-weight: 600;">
              <i class="fa-brands fa-whatsapp" style="font-size: 1.2rem;"></i> إرسال عبر واتساب الآن
            </a>
          </div>
        `;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 20. Mobile Navigation Drawer with Auto-Active Highlight                    */
/* -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtns = document.querySelectorAll('.mobile-toggle-btn');
  const drawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const closeBtn = document.querySelector('.drawer-close-btn');

  function openDrawer() {
    if (drawer) drawer.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtns.forEach(btn => btn.addEventListener('click', openDrawer));
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Touch swipe to close (swipe right for RTL)
  let touchStartX = 0;
  let touchEndX = 0;
  if (drawer) {
    drawer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    drawer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      // If swiped right by more than 50px
      if (touchEndX - touchStartX > 50) {
        closeDrawer();
      }
    }, { passive: true });
  }

  // Mark current active link in drawer automatically
  const rawDrawerPath = window.location.pathname.split('/').filter(Boolean).pop() || 'index';
  const currentDrawerNormalized = rawDrawerPath.replace(/\.html$/, '').toLowerCase();
  const drawerLinks = document.querySelectorAll('.mobile-nav-links a');
  drawerLinks.forEach(link => {
    const href = (link.getAttribute('href') || '').replace(/\.html$/, '').replace(/^\.\//, '').toLowerCase();
    if (href === currentDrawerNormalized || ((currentDrawerNormalized === 'index' || currentDrawerNormalized === '') && (href === 'index' || href === ''))) {
      link.classList.add('active');
    }
    link.addEventListener('click', closeDrawer);
  });
}

/* -------------------------------------------------------------------------- */
/* 21. Certificates Interactive Lightbox Modal & Filtering Controller         */
/* -------------------------------------------------------------------------- */
function initCertificatesLightbox() {
  const modal = document.getElementById('certLightboxModal');
  const cardsGrid = document.getElementById('certificatesContainer') || document.getElementById('certificatesGrid');
  if (!modal || !cardsGrid) return;

  const modalImg = document.getElementById('certLightboxImg');
  const counterEl = document.getElementById('certLightboxCounter');
  const downloadBtn = document.getElementById('certLightboxDownload');
  const captionTitleEl = document.getElementById('certLightboxCaptionTitle');
  const captionYearEl = document.getElementById('certLightboxCaptionYear');
  const closeBtn = modal.querySelector('.close-btn');
  const prevBtn = modal.querySelector('.prev-btn');
  const nextBtn = modal.querySelector('.next-btn');

  // Filter and Search elements
  const filterPills = Array.from(document.querySelectorAll('.cert-filter-pill'));
  const searchInput = document.getElementById('certSearchInput');
  const searchClearBtn = document.getElementById('certSearchClear');
  const searchWrapper = document.querySelector('.cert-search-wrapper');
  const emptyState = document.getElementById('certEmptyState');
  const resetFiltersBtn = document.getElementById('certResetFiltersBtn');
  const summaryPill = document.getElementById('certSummaryPill');

  const allYearGroups = Array.from(document.querySelectorAll('.cert-year-group'));
  const allCards = Array.from(document.querySelectorAll('.certificate-card'));
  if (allCards.length === 0) return;

  let activeFilter = 'all';
  let searchQuery = '';
  let activeVisibleCards = [...allCards];
  let currentIndex = 0;

  // Arabic text normalizer for accurate search
  function normalizeArabic(str) {
    if (!str) return '';
    return str
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u065F]/g, '') // Remove harakat (tashkeel)
      .replace(/\s+/g, ' ');
  }

  // Filter cards based on active year pill and search query
  function filterCertificates() {
    const normQuery = normalizeArabic(searchQuery);
    let visibleCount = 0;
    activeVisibleCards = [];

    if (allYearGroups.length > 0) {
      allYearGroups.forEach(group => {
        const groupYear = group.getAttribute('data-year') || '';
        const groupCards = Array.from(group.querySelectorAll('.certificate-card'));
        let groupVisibleCount = 0;

        const matchesFilter = (activeFilter === 'all' || groupYear === activeFilter);

        groupCards.forEach(card => {
          const cardYear = card.getAttribute('data-year') || '';
          const cardRecipient = card.getAttribute('data-recipient') || '';
          const cardTitle = card.getAttribute('data-title') || '';
          const combinedText = normalizeArabic(`${cardRecipient} ${cardTitle} ${cardYear}`);

          const matchesSearch = !normQuery || combinedText.includes(normQuery);

          if (matchesFilter && matchesSearch) {
            card.style.display = '';
            card.classList.add('aos-animate');
            activeVisibleCards.push(card);
            visibleCount++;
            groupVisibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        // Show/hide group based on filter and whether it has matching cards
        if (matchesFilter && groupVisibleCount > 0) {
          group.style.display = '';
          group.classList.add('aos-animate');
        } else {
          group.style.display = 'none';
        }
      });
    } else {
      allCards.forEach(card => {
        const cardYear = card.getAttribute('data-year') || '';
        const cardRecipient = card.getAttribute('data-recipient') || '';
        const cardTitle = card.getAttribute('data-title') || '';
        const combinedText = normalizeArabic(`${cardRecipient} ${cardTitle} ${cardYear}`);

        const matchesFilter = (activeFilter === 'all' || cardYear === activeFilter);
        const matchesSearch = !normQuery || combinedText.includes(normQuery);

        if (matchesFilter && matchesSearch) {
          card.style.display = '';
          card.classList.add('aos-animate');
          activeVisibleCards.push(card);
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Refresh AOS animations
    if (typeof AOS !== 'undefined' && AOS.refresh) {
      AOS.refresh();
    }

    // Toggle Empty State
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.add('active');
        emptyState.style.display = 'block';
        cardsGrid.style.display = 'none';
      } else {
        emptyState.classList.remove('active');
        emptyState.style.display = 'none';
        cardsGrid.style.display = '';
      }
    }

    // Update Summary Counter Pill
    if (summaryPill) {
      const countSpan = summaryPill.querySelector('span');
      if (countSpan) {
        const arCount = toArabicDigits(visibleCount);
        countSpan.textContent = `${arCount} شهادة تقدير معروضة`;
      }
    }
  }

  // Bind filter pill clicks
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter') || 'all';
      filterCertificates();

      // Smooth scroll to target year group or top of container
      if (activeFilter !== 'all') {
        const targetGroup = document.querySelector(`.cert-year-group[data-year="${activeFilter}"]`);
        if (targetGroup) {
          targetGroup.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        const container = document.getElementById('certificatesContainer');
        if (container) {
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Bind search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (searchWrapper) {
        if (searchQuery.length > 0) {
          searchWrapper.classList.add('has-text');
        } else {
          searchWrapper.classList.remove('has-text');
        }
      }
      filterCertificates();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      if (searchWrapper) searchWrapper.classList.remove('has-text');
      filterCertificates();
      if (searchInput) searchInput.focus();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      if (searchWrapper) searchWrapper.classList.remove('has-text');
      activeFilter = 'all';
      filterPills.forEach(p => {
        if (p.getAttribute('data-filter') === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });
      filterCertificates();
    });
  }

  // Update Lightbox Modal content for index in activeVisibleCards
  function updateModal(index) {
    if (activeVisibleCards.length === 0) return;
    if (index < 0) index = activeVisibleCards.length - 1;
    if (index >= activeVisibleCards.length) index = 0;
    currentIndex = index;

    const currentCard = activeVisibleCards[currentIndex];
    const frame = currentCard.querySelector('.cert-image-frame');
    const src = frame ? frame.getAttribute('data-cert-src') : '';
    const title = (frame ? frame.getAttribute('data-cert-title') : '') || 'شهادة تقدير';
    const yearAr = (frame ? frame.getAttribute('data-cert-year') : '') || '';
    const recipient = currentCard.getAttribute('data-recipient') || title;

    if (modalImg) {
      modalImg.style.opacity = '0';
      modalImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        modalImg.src = src;
        modalImg.alt = title;
        modalImg.onload = () => {
          modalImg.style.opacity = '1';
          modalImg.style.transform = 'scale(1)';
        };
      }, 120);
    }

    if (counterEl) {
      const currentAr = toArabicDigits(currentIndex + 1);
      const totalAr = toArabicDigits(activeVisibleCards.length);
      counterEl.innerHTML = `<i class="fa-solid fa-award" style="color: var(--accent);"></i> شهادة ${currentAr} من ${totalAr}`;
    }

    if (captionTitleEl) {
      captionTitleEl.textContent = recipient;
    }
    if (captionYearEl) {
      captionYearEl.textContent = yearAr;
      captionYearEl.style.display = yearAr ? 'inline-block' : 'none';
    }

    if (downloadBtn) {
      downloadBtn.href = src;
      const cleanName = recipient.replace(/[/\\?%*:|"<>]/g, '').replace(/\s+/g, '-');
      downloadBtn.setAttribute('download', `شهادة-تقدير-${cleanName}.jpg`);
    }
  }

  function openModal(cardEl) {
    const cardIndex = activeVisibleCards.indexOf(cardEl);
    if (cardIndex !== -1) {
      updateModal(cardIndex);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextCert() {
    updateModal(currentIndex + 1);
  }

  function prevCert() {
    updateModal(currentIndex - 1);
  }

  // Attach card click handlers
  allCards.forEach(card => {
    const frame = card.querySelector('.cert-image-frame');
    if (frame) {
      frame.addEventListener('click', (e) => {
        if (e.target.closest('.cert-download-direct')) return;
        e.preventDefault();
        openModal(card);
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (prevBtn) prevBtn.addEventListener('click', prevCert);
  if (nextBtn) nextBtn.addEventListener('click', nextCert);

  // Close when clicking outside image
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('cert-lightbox-body')) {
      closeModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') prevCert();
    if (e.key === 'ArrowLeft') nextCert();
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        prevCert();
      } else {
        nextCert();
      }
    }
  }, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* 22. Media Gallery & In-Page Video Player Controller                         */
/* -------------------------------------------------------------------------- */
function initGalleryMedia() {
  const modal = document.getElementById('mediaLightboxModal');
  const cardsGrid = document.getElementById('galleryGrid') || document.getElementById('homeGalleryGrid');
  if (!modal || !cardsGrid) return;

  const modalImg = document.getElementById('mediaLightboxImg');
  const videoContainer = document.getElementById('mediaLightboxVideoContainer');
  const videoIframe = document.getElementById('mediaLightboxIframe');
  const videoLocal = document.getElementById('mediaLightboxLocalVideo');
  const counterEl = document.getElementById('mediaLightboxCounter');
  const captionTitleEl = document.getElementById('mediaLightboxCaptionTitle');
  const captionBadgeEl = document.getElementById('mediaLightboxCaptionBadge');
  const downloadBtn = document.getElementById('mediaLightboxDownload');
  const closeBtn = modal.querySelector('.close-btn');
  const prevBtn = modal.querySelector('.prev-btn');
  const nextBtn = modal.querySelector('.next-btn');

  // Filter and Search Elements
  const filterPills = Array.from(document.querySelectorAll('.gallery-filter-pill'));
  const searchInput = document.getElementById('gallerySearchInput');
  const searchClearBtn = document.getElementById('gallerySearchClear');
  const searchWrapper = document.querySelector('.gallery-search-wrapper');
  const emptyState = document.getElementById('galleryEmptyState');
  const resetFiltersBtn = document.getElementById('galleryResetFiltersBtn');
  const summaryPill = document.getElementById('gallerySummaryPill');

  const allCards = Array.from(cardsGrid.querySelectorAll('.media-card'));
  if (allCards.length === 0) return;

  let activeFilter = 'all';
  let searchQuery = '';
  let activeVisibleCards = [...allCards];
  let currentIndex = 0;

  // Arabic text normalizer
  function normalizeArabic(str) {
    if (!str) return '';
    return str
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u065F]/g, '') // Remove harakat
      .replace(/\s+/g, ' ');
  }

  // Filter cards based on category and search query
  function filterMedia() {
    const normQuery = normalizeArabic(searchQuery);
    let visibleCount = 0;
    activeVisibleCards = [];

    allCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardType = card.getAttribute('data-type') || '';
      const cardTitle = card.getAttribute('data-title') || '';
      const cardBadge = card.getAttribute('data-badge') || '';
      const cardDate = card.getAttribute('data-date') || '';
      const combinedText = normalizeArabic(`${cardTitle} ${cardCategory} ${cardType} ${cardBadge} ${cardDate}`);

      let matchesFilter = false;
      if (activeFilter === 'all') {
        matchesFilter = true;
      } else if (activeFilter === 'videos') {
        matchesFilter = (cardType === 'youtube' || cardType === 'video-local');
      } else if (activeFilter === 'photos') {
        matchesFilter = (cardType === 'image');
      } else {
        matchesFilter = cardCategory.includes(activeFilter);
      }

      const matchesSearch = !normQuery || combinedText.includes(normQuery);

      if (matchesFilter && matchesSearch) {
        card.style.display = '';
        // Ensure AOS-hidden cards (never scrolled into view) become visible after filtering
        card.classList.add('aos-animate');
        activeVisibleCards.push(card);
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Recalculate AOS positions since layout changed
    if (typeof AOS !== 'undefined' && AOS.refresh) {
      AOS.refresh();
    }

    // Toggle Empty State
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.add('active');
        cardsGrid.style.display = 'none';
      } else {
        emptyState.classList.remove('active');
        cardsGrid.style.display = 'grid';
      }
    }

    // Update Summary Counter Pill
    if (summaryPill) {
      const countSpan = summaryPill.querySelector('span');
      if (countSpan) {
        const arCount = toArabicDigits(visibleCount);
        countSpan.textContent = `${arCount} مادة إعلامية معروضة`;
      }
    }
  }

  // Update badge counts for filter pills dynamically based on allCards
  function updatePillBadges() {
    filterPills.forEach(pill => {
      const filter = pill.getAttribute('data-filter') || 'all';
      const badge = pill.querySelector('.pill-badge');
      if (!badge) return;
      let count = 0;
      if (filter === 'all') {
        count = allCards.length;
      } else if (filter === 'videos') {
        count = allCards.filter(c => {
          const t = c.getAttribute('data-type');
          return t === 'youtube' || t === 'video-local';
        }).length;
      } else if (filter === 'photos') {
        count = allCards.filter(c => c.getAttribute('data-type') === 'image').length;
      } else {
        count = allCards.filter(c => (c.getAttribute('data-category') || '').includes(filter)).length;
      }
      badge.textContent = toArabicDigits(count);
    });
  }

  // Initial badge calculation
  updatePillBadges();

  // Bind filter pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter') || 'all';
      filterMedia();
    });
  });

  // Bind search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (searchWrapper) {
        if (searchQuery.length > 0) {
          searchWrapper.classList.add('has-text');
        } else {
          searchWrapper.classList.remove('has-text');
        }
      }
      filterMedia();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      if (searchWrapper) searchWrapper.classList.remove('has-text');
      filterMedia();
      if (searchInput) searchInput.focus();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      if (searchWrapper) searchWrapper.classList.remove('has-text');
      activeFilter = 'all';
      filterPills.forEach(p => {
        if (p.getAttribute('data-filter') === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });
      filterMedia();
    });
  }

  // Clean and stop any active video playback
  function stopActiveVideo() {
    if (videoIframe) {
      videoIframe.src = '';
      videoIframe.style.display = 'none';
    }
    if (videoLocal) {
      try {
        videoLocal.pause();
        videoLocal.currentTime = 0;
      } catch (e) {}
      videoLocal.src = '';
      videoLocal.style.display = 'none';
    }
    if (videoContainer) {
      videoContainer.style.display = 'none';
    }
  }

  // Update Lightbox Modal content for index in activeVisibleCards
  function updateModal(index) {
    if (activeVisibleCards.length === 0) return;
    if (index < 0) index = activeVisibleCards.length - 1;
    if (index >= activeVisibleCards.length) index = 0;
    currentIndex = index;

    // Stop current video if playing
    stopActiveVideo();

    const currentCard = activeVisibleCards[currentIndex];
    const mediaType = currentCard.getAttribute('data-type') || 'image';
    const mediaSrc = currentCard.getAttribute('data-src') || '';
    const mediaTitle = currentCard.getAttribute('data-title') || 'مادة إعلامية';
    const mediaBadge = currentCard.getAttribute('data-badge') || '';

    // Update Counter & Captions
    if (counterEl) {
      const currentAr = toArabicDigits(currentIndex + 1);
      const totalAr = toArabicDigits(activeVisibleCards.length);
      counterEl.innerHTML = `<i class="fa-solid fa-photo-film" style="color: var(--accent);"></i> مادة ${currentAr} من ${totalAr}`;
    }

    if (captionTitleEl) {
      captionTitleEl.textContent = mediaTitle;
    }
    if (captionBadgeEl) {
      captionBadgeEl.textContent = mediaBadge;
      captionBadgeEl.style.display = mediaBadge ? 'inline-block' : 'none';
    }

    // Render by type
    if (mediaType === 'image') {
      if (videoContainer) videoContainer.style.display = 'none';
      if (modalImg) {
        modalImg.style.display = 'block';
        modalImg.style.opacity = '0';
        modalImg.style.transform = 'scale(0.96)';
        setTimeout(() => {
          modalImg.src = mediaSrc;
          modalImg.alt = mediaTitle;
          modalImg.onload = () => {
            modalImg.style.opacity = '1';
            modalImg.style.transform = 'scale(1)';
          };
        }, 120);
      }

      if (downloadBtn) {
        downloadBtn.style.display = 'inline-flex';
        downloadBtn.href = mediaSrc;
        const cleanName = mediaTitle.replace(/[/\\?%*:|"<>]/g, '').replace(/\s+/g, '-');
        downloadBtn.setAttribute('download', `${cleanName}.jpg`);
        downloadBtn.setAttribute('title', 'تحميل الصورة بدقة عالية');
      }
    } else if (mediaType === 'youtube') {
      if (modalImg) modalImg.style.display = 'none';
      if (videoContainer) videoContainer.style.display = 'block';
      if (videoLocal) videoLocal.style.display = 'none';
      if (videoIframe) {
        videoIframe.style.display = 'block';
        videoIframe.src = `https://www.youtube-nocookie.com/embed/${mediaSrc}?autoplay=1&rel=0&modestbranding=1`;
      }

      if (downloadBtn) {
        downloadBtn.style.display = 'none';
        downloadBtn.href = '#';
        downloadBtn.removeAttribute('download');
        downloadBtn.removeAttribute('target');
        downloadBtn.removeAttribute('title');
      }
    } else if (mediaType === 'video-local') {
      if (modalImg) modalImg.style.display = 'none';
      if (videoContainer) videoContainer.style.display = 'block';
      if (videoIframe) videoIframe.style.display = 'none';
      if (videoLocal) {
        videoLocal.style.display = 'block';
        videoLocal.src = mediaSrc;
        try {
          videoLocal.play().catch(() => {});
        } catch (e) {}
      }

      if (downloadBtn) {
        downloadBtn.style.display = 'inline-flex';
        downloadBtn.href = mediaSrc;
        const cleanName = mediaTitle.replace(/[/\\?%*:|"<>]/g, '').replace(/\s+/g, '-');
        downloadBtn.setAttribute('download', `${cleanName}.mp4`);
        downloadBtn.setAttribute('title', 'تحميل الفيديو الميداني بدقة عالية');
      }
    }
  }

  function openModal(cardEl) {
    const cardIndex = activeVisibleCards.indexOf(cardEl);
    if (cardIndex !== -1) {
      updateModal(cardIndex);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    stopActiveVideo();
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextMedia() {
    updateModal(currentIndex + 1);
  }

  function prevMedia() {
    updateModal(currentIndex - 1);
  }

  // Attach card click handlers
  allCards.forEach(card => {
    const frame = card.querySelector('.media-thumb-frame');
    if (frame) {
      frame.addEventListener('click', (e) => {
        if (e.target.closest('.media-action-dl-btn')) return;
        e.preventDefault();
        openModal(card);
      });
    }

    const previewBtn = card.querySelector('.media-action-preview-btn');
    if (previewBtn) {
      previewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(card);
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (prevBtn) prevBtn.addEventListener('click', prevMedia);
  if (nextBtn) nextBtn.addEventListener('click', nextMedia);

  // Close when clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('media-lightbox-body')) {
      closeModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') prevMedia();
    if (e.key === 'ArrowLeft') nextMedia();
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        prevMedia();
      } else {
        nextMedia();
      }
    }
  }, { passive: true });
}




/* -------------------------------------------------------------------------- */
/* 22. Donation Methods Tab Bar Controller                                    */
/* -------------------------------------------------------------------------- */
function initDonationTabs() {
  const tabBtns = document.querySelectorAll('.donation-tab-btn');
  const tabPanes = document.querySelectorAll('.donation-tab-pane');
  if (!tabBtns.length || !tabPanes.length) return;

  function switchTab(targetId) {
    tabBtns.forEach(btn => {
      const match = btn.getAttribute('data-tab') === targetId;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    tabPanes.forEach(pane => {
      if (pane.id === targetId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-tab');
      if (targetId) {
        switchTab(targetId);
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, null, '#' + targetId);
        }
      }
    });
  });

  // Check URL hash on page load
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash && document.getElementById(currentHash) && document.querySelector(`[data-tab="${currentHash}"]`)) {
    switchTab(currentHash);
  }
}

/* -------------------------------------------------------------------------- */
/* 23. Interactive Copy to Clipboard with Feedback                            */
/* -------------------------------------------------------------------------- */
function initCopyToClipboard() {
  const copyButtons = document.querySelectorAll('.copy-btn, [data-copy]');
  if (!copyButtons.length) return;

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      // Visual feedback on button
      const originalHTML = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ!';

      // Micro Confetti if available
      if (typeof confetti === 'function') {
        const rect = btn.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 22,
          spread: 50,
          origin: { x, y },
          colors: ['#10b981', '#0b3b4f', '#f59e0b'],
          disableForReducedMotion: true
        });
      }

      // Show toast if container exists
      const toastContainer = document.getElementById('toastContainer');
      if (toastContainer) {
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.style.background = '#0b3b4f';
        toast.style.color = '#ffffff';
        toast.style.borderRadius = '10px';
        toast.style.padding = '0.75rem 1.25rem';
        toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '0.6rem';
        toast.style.fontSize = '0.92rem';
        toast.style.fontWeight = '700';
        toast.style.marginTop = '0.5rem';
        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> تم نسخ (${textToCopy}) بنجاح`;
        toastContainer.appendChild(toast);
        setTimeout(() => {
          toast.remove();
        }, 3000);
      }

      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = originalHTML;
      }, 2000);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 24. Banque Misr View Switcher (Cards vs Table)                             */
/* -------------------------------------------------------------------------- */
function initDonationViewSwitcher() {
  const switchBtns = document.querySelectorAll('.view-switch-btn');
  const panels = {
    cards: document.getElementById('viewCards'),
    table: document.getElementById('viewTable')
  };
  if (!switchBtns.length) return;

  switchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = btn.getAttribute('data-view');
      switchBtns.forEach(b => {
        const isMatch = b === btn;
        b.classList.toggle('active', isMatch);
        b.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      if (panels.cards && panels.table) {
        if (targetView === 'cards') {
          panels.cards.classList.add('active');
          panels.table.classList.remove('active');
        } else if (targetView === 'table') {
          panels.table.classList.add('active');
          panels.cards.classList.remove('active');
        }
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 25. Global Branches Filter Controller                                      */
/* -------------------------------------------------------------------------- */
function filterBranches(gov) {
  const govSections = document.querySelectorAll('.gov-section');
  const filterBtns = document.querySelectorAll('.branch-filter-btn');

  filterBtns.forEach(btn => {
    const isMatch = btn.getAttribute('data-gov') === gov;
    btn.classList.toggle('active', isMatch);
    btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
  });

  govSections.forEach(section => {
    if (gov === 'all' || section.getAttribute('data-gov') === gov) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });

  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
}
window.filterBranches = filterBranches;

/* -------------------------------------------------------------------------- */
/* 26. Floating Donate Button Expand Animation (Expand on Scroll / Hover)     */
/* -------------------------------------------------------------------------- */
function initFloatingDonateExpand() {
  // Pure static circular button without expansion
}

/* -------------------------------------------------------------------------- */
/* 27. Interactive Cause Details Modal Controller & Authentic Cases Data       */
/* -------------------------------------------------------------------------- */
const ALL_CAUSES_DATA = {
  'orphans-elderly': {
    id: 'orphans-elderly',
    title: 'كفالة الأيتام وكبار السن',
    category: 'أجر مستمر',
    badgeClass: 'badge-orphans',
    img: 'https://www.akhawein.org/wp-content/uploads/2024/08/2151565289.jpg',
    raised: '12,240 ج.م',
    goal: '18,000 ج.م',
    goalType: 'المستهدف الشهري',
    percent: 68,
    remaining: '5,760 ج.م',
    description: `تولي جمعية أخوين اهتماماً بالغاً بالطفل اليتيم من إقامة وكفالة شهرية وغذاء ورعاية طبية ونفسية شاملة بدار أخوين للأيتام، وتحث أهل الخير على دعم الطفل اليتيم نظراً لاحتياج هؤلاء الأيتام إلى المؤازرة والدعم والعمل على دمجهم الكامل في المجتمع.

كما تولي الجمعية اهتماماً كبيراً بكبار السن والمسنين غير القادرين من خلال دار «حكاية حياة» لكبار السن لتوفير مأوى كريم ورعاية صحية وغذائية ونفسية تليق بكرامتهم وإنسانيتهم.`,
    verse: 'قال رسول الله ﷺ: «أنا وكافل اليتيم في الجنة هكذا» وأشار بالسبابة والوسطى وفرج بينهما شيئاً.',
    shares: [
      { name: 'سهم كفالة طفل يتيم', amount: '300 ج.م', desc: 'مساهمة شهرية تشمل الغذاء والرعاية والتعليم والملبس' },
      { name: 'سهم كفالة مسن', amount: '300 ج.م', desc: 'رعاية صحية وتغذية متكاملة بدار حكاية حياة' },
      { name: 'كفالة كاملة لطفل يتيم شهرياً', amount: '1,200 ج.م', desc: 'تغطية شاملة لكافة احتياجات الطفل ومصاريف إقامته' },
      { name: 'كفالة كاملة لمسن شهرياً', amount: '1,500 ج.م', desc: 'إقامة وإعاشة وعلاج كامل لكبار السن' }
    ],
    beneficiaries: ['الأطفال الأيتام', 'المسنون وكبار السن', 'دار أخوين للأيتام', 'دار حكاية حياة'],
    bankTitle: 'حساب جمعية أخوين فرع صلاح سالم (الحساب الأساسي)',
    bankBranch: 'فرع صلاح سالم - بنك مصر',
    accountNumber: '1810001000033972',
    iban: 'EG020002018101810001000033972',
    officialUrl: 'https://www.akhawein.org/donations/كفالة-الايتام-كبار-السن/'
  },
  'brides': {
    id: 'brides',
    title: 'تجهيز العرائس اليتيمات',
    category: 'عفاف وستر',
    img: 'https://www.akhawein.org/wp-content/uploads/2022/08/f100a1c2-8e10-4eaf-a9f2-778d05e11195.jpeg',
    raised: '3,240,000 ج.م',
    goal: '7,200,000 ج.م',
    goalType: 'المستهدف العام',
    percent: 45,
    remaining: '3,960,000 ج.م',
    description: `تكافل المجتمع مع الفتيات اليتيمات لتزويجهن وتجهيزهن بالأجهزة الكهربائية والأساسيات المنزلية ليبدأن حياة اجتماعية كريمة ومستقرة، نشاط مستمر طوال العام لستر بناتنا ورسم البسمة على وجوههن.

يُمنح كل فتاة يتيمة مبلغ مالي ومشتريات عينية بقيمة 20,000 جنيه (أجهزة كهربائية أساسية كالغسالة والبوتاجاز والثلاجة والمفروشات).

شروط الاستحقاق المعتمدة:
• أن يكون معقود قرانها (مكتوب كتابها) رسمياً ولم يتم الزفاف بعد.
• ألا يكون قد سبق لها الزواج.
• إثبات البحث الميداني لحالة اليتم وعدم القدرة.
• نرسل دعوة خاصة للمتبرعين لحضور حفل الزفاف ومشاركة العروس فرحتها.`,
    verse: 'قال رسول الله ﷺ: «من استطاع منكم الباءة فليتزوج فإنه أغض للبصر وأحصن للفرج»، وإعانة العاجز عن النكاح من أعظم أبواب الصدقة والعفاف.',
    shares: [
      { name: 'سهم المشاركة في تجهيز عروسة', amount: '2,000 ج.م', desc: 'مساهمة لشراء الأجهزة الكهربائية والمفروشات' },
      { name: 'جهاز كامل لعروسة يتيمة', amount: '20,000 ج.م', desc: 'تجهيز كامل بالأجهزة الكهربائية والأساسيات' },
      { name: 'سهم مساهمة مبارك', amount: '500 ج.م', desc: 'سهم رمزي للمشاركة في ستر وعفاف فتاة يتيمة' },
      { name: 'سهم جهاز كهربائي رئيسي', amount: '5,000 ج.م', desc: 'مساهمة لتوفير جهاز من الأجهزة الأساسية (غسالة/ثلاجة)' }
    ],
    beneficiaries: ['الفتيات اليتيمات', 'بنات دار الرعاية اللاحقة', 'المقبلات على الزواج من الأسر المتعففة'],
    bankTitle: 'حساب تجهيز عرائس - فرع الثورة',
    bankBranch: 'فرع الثورة - بنك مصر',
    accountNumber: '1600001000013693',
    iban: 'EG660002016001600001000013693',
    officialUrl: 'https://www.akhawein.org/donations/تجهيز-العرائيس-2/'
  },
  'hot-meals': {
    id: 'hot-meals',
    title: 'إطعام وجبات ساخنة يومية',
    category: 'إطعام طعام',
    img: 'images/hot-meals.jpg',
    raised: '524,000 ج.م',
    goal: '1,008,000 ج.م',
    goalType: 'المستهدف السنوي',
    percent: 52,
    remaining: '484,000 ج.م',
    description: `برنامج إطعام مستمر على مدار العام لتلبية احتياجات الفقراء والأسر المحتاجة وعمال اليومية والمسنين في مختلف المحافظات، ويلعب دوراً حيوياً في تحسين جودة حياة الأشخاص الأكثر احتياجاً.

تقوم جمعية أخوين من خلال مطابخ مجهزة يديرها شركاؤنا في النجاح بتجهيز وتوزيع وجبات طازجة متكاملة القيمة الغذائية يومياً ومجاناً.

مكونات الوجبة الطازجة:
(أرز أو مكرونة + فراخ أو لحمة أو كفتة أو كبدة + خضار طازج مطهي + خبز بلدي).

تفاصيل ومحددات التبرع:
40 وجبة يومياً × 30 يوماً × 12 شهراً × 70 جنيهاً تكلفة الوجبة.`,
    verse: 'قال تعالى: {وَيُطْعِمُونَ الطَّعَامَ عَلَىٰ حُبِّهِ مِسْكِينًا وَيَتِيمًا وَأَسِيرًا * إِنَّمَا نُطْعِمُكُمْ لِوَجْهِ اللَّهِ لَا نُرِيدُ مِنكُمْ جَزَاءً وَلَا شُكُورًا} [الإنسان: 8-9]',
    shares: [
      { name: 'ثمن وجبة ساخنة طازجة', amount: '70 ج.م', desc: 'وجبة بروتين متكاملة مع خضار ونشويات وخبز' },
      { name: 'مساهمة في مطابخ الخير', amount: '500 ج.م', desc: 'سهم مساهمة في تكاليف طهي وتوزيع الوجبات' },
      { name: 'إطعام 10 أفراد', amount: '700 ج.م', desc: 'وجبات ساخنة لعشرة مستحقين أو أسرتين' },
      { name: 'كفالة إطعام يوم كامل (40 وجبة)', amount: '2,800 ج.م', desc: 'تمويل يوم إطعام كامل لمطبخ الخير' }
    ],
    beneficiaries: ['المرأة المعيلة', 'الأيتام', 'كبار السن', 'حالات العجز والإعاقة', 'الطلبة الوافدون', 'عابرو السبيل'],
    bankTitle: 'حساب إطعام وجبات ساخنة - فرع الثورة',
    bankBranch: 'فرع الثورة - بنك مصر',
    accountNumber: '1600001000013658',
    iban: 'EG660002016001600001000013658',
    officialUrl: 'https://www.akhawein.org/donations/اطعام-وجبات-ساخنة-2/'
  },
  'food-package': {
    id: 'food-package',
    title: 'شنطة مواد غذائية للأسر (شنطة رد الجميل)',
    category: 'شنطة رد الجميل',
    img: 'https://www.akhawein.org/wp-content/uploads/2022/08/WhatsApp-Image-2024-06-24-at-9.35.19-PM-580x435.jpeg',
    raised: '432,000 ج.م',
    goal: '1,080,000 ج.م',
    goalType: 'المستهدف السنوي',
    percent: 40,
    remaining: '648,000 ج.م',
    description: `توفر جمعية أخوين شنطة «رد الجميل» الشهرية من أجل تحسين جودة حياة الأشخاص والأسر الذين يعانون من صعوبات اقتصادية واجتماعية حادة، بعد إقامة دراسات وأبحاث ميدانية دقيقة على الحالات لإثبات أحقيتها في استلام الشنطة بصفة دورية.

مكونات الشنطة التموينية المتكاملة:
2 كجم أرز فاخر + 2 كجم مكرونة + 1 كجم سكر + 1/2 كجم فاصوليا + 1/2 كجم فول تدميس + زجاجة زيت طعام نقي + علبة جبنة + صلصة طماطم + ملح طعام.

تفاصيل وخطة التبرع السنوية:
200 شنطة شهرياً × 12 شهراً × 450 جنيهاً تكلفة الشنطة.`,
    verse: 'قال رسول الله ﷺ: «أحب الناس إلى الله أنفعهم للناس، وأحب الأعمال إلى الله سرور تدخله على مسلم، أو تكشف عنه كربة، أو تقضي عنه ديناً، أو تطرد عنه جوعاً».',
    shares: [
      { name: 'كرتونة مواد غذائية متكاملة', amount: '450 ج.م', desc: 'تكفي احتياجات أسرة متعففة من السلع الأساسية شهرياً' },
      { name: 'سهم شنطة رد الجميل', amount: '200 ج.م', desc: 'مساهمة جزئية في توفير السلع التموينية' },
      { name: 'كفالة 5 كراتين تموينية', amount: '2,250 ج.م', desc: 'دعم 5 أسر مستحقة بكراتين السلع الأساسية' },
      { name: 'كفالة أسرة لعام كامل (12 كرتونة)', amount: '5,400 ج.م', desc: 'تأمين الغذاء الشهري لأسرة طوال العام' }
    ],
    beneficiaries: ['المرأة المعيلة والأرامل', 'كبار السن', 'ذوو الاحتياجات الخاصة', 'الأسر الأكثر احتياجاً بالقرى'],
    bankTitle: 'حساب شنط مواد غذائية - فرع الثورة',
    bankBranch: 'فرع الثورة - بنك مصر',
    accountNumber: '1600001000013660',
    iban: 'EG660002016001600001000013660',
    officialUrl: 'https://www.akhawein.org/donations/شنطة-مواد-غذائية-2/'
  },
  'cancer-children': {
    id: 'cancer-children',
    title: 'أمنية لأطفال الأورام (نفسك فى إيه)',
    category: 'أمل وشفاء',
    img: 'images/omneya-girl.jpg',
    raised: '8,000 ج.م',
    goal: '10,000 ج.م',
    goalType: 'المستهدف التقديري',
    percent: 80,
    remaining: '2,000 ج.م',
    description: `«نفسك فى إيه؟».. جملة صغيرة وبسيطة لكن لها مفعول السحر على نفوس وقلوب أطفالنا الأبطال مرضى الأورام والسرطان والحالات المتأخرة والمهددة حياتهم بالخطر.

تهتم جمعية أخوين برفع الروح المعنوية لهؤلاء الأطفال ومساندتهم في رحلة العلاج والتعافي الطويلة من خلال تحقيق أمانيهم في الحياة، وإدخال السرور على قلوبهم وقلوب أسرهم.

شعارنا الدائم في هذه المبادرة: «لا يأس مع الحياة.. ونسأل الله أن يقدرنا على تحقيق أحلامهم».`,
    verse: 'قال رسول الله ﷺ: «من أدخل على أهل بيت من المسلمين سروراً لم يرض الله له ثواباً دون الجنة».',
    shares: [
      { name: 'سهم تحقيق أمنية طفل', amount: '250 ج.م', desc: 'مساهمة في شراء الهدايا وتحقيق أمنيات أبطال الأورام' },
      { name: 'تحقيق أمنية كاملة لطفل', amount: '1,500 ج.م', desc: 'شراء الهدية المرغوبة وإدخال الفرحة على قلبه' },
      { name: 'دعم نفسي وترفيهي للمرضى', amount: '500 ج.م', desc: 'تنظيم فعاليات ترفيهية داخل مستشفيات الأورام' }
    ],
    beneficiaries: ['أطفال مرضى السرطان والأورام', 'الحالات الحرجة والمتأخرة', 'أسر الأطفال المرضى'],
    bankTitle: 'حساب جمعية أخوين فرع صلاح سالم (الحساب الأساسي)',
    bankBranch: 'فرع صلاح سالم - بنك مصر',
    accountNumber: '1810001000033972',
    iban: 'EG020002018101810001000033972',
    officialUrl: 'https://www.akhawein.org/donations/نفسك-فى-ايه-أمنية/'
  },
  'dialysis': {
    id: 'dialysis',
    title: 'جلسات غسيل كلوي وفلاتر (إنقاذ حياة)',
    category: 'إنقاذ حياة',
    img: 'https://www.akhawein.org/wp-content/uploads/2024/04/6f8fde6c-d275-447b-8afe-fc4f3a7cbf04.jpeg',
    raised: '7,142,400 ج.م',
    goal: '11,520,000 ج.م',
    goalType: 'المستهدف الطبي السنوي',
    percent: 62,
    remaining: '4,377,600 ج.م',
    description: `مرض الفشل الكلوي يحتل المرتبة الخامسة في أسباب الوفاة في مصر. وبمساعدتكم الكريمة تقدم جمعية أخوين الدعم لمرضى الفشل الكلوي غير القادرين من خلال توفير جلسات الغسيل الكلوي وشراء الفلاتر والأدوية المصاحبة لإنقاذ حياتهم.

المريض الواحد يحتاج إلى 12 جلسة غسيل كلوي شهرياً (3 جلسات أسبوعياً لا يمكن تأخيرها).
تكلفة الجلسة الواحدة مع الفلتر والمستلزمات: 800 جنيه.

تفاصيل التبرع والمستهدف السنوي:
800 ج / جلسة × 12 جلسة شهرياً = 9,600 ج شهرياً للمريض الواحد.
تكلفة المريض سنوياً: 115,200 جنيه.
المستهدف: كفالة 100 مريض مستهدف + جلسات طارئة = 11,520,000 ج.م.`,
    verse: 'قال تعالى: {وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا} [المائدة: 32]. وتوفير جلسة الغسيل الكلوي لمريض غير قادر هو إحياء حقيقي للنفس وإنقاذ مباشر لحياته.',
    shares: [
      { name: 'سهم جلسة غسيل كلوي', amount: '200 ج.م', desc: 'مساهمة في شراء الفلاتر ومحاليل الغسيل الكلوي' },
      { name: 'تكلفة جلسة غسيل كلوي كاملة', amount: '800 ج.م', desc: 'تغطية جلسة علاج كاملة لمريض غير قادر' },
      { name: 'كفالة مريض لمدة شهر (12 جلسة)', amount: '9,600 ج.م', desc: 'إنقاذ حياة مريض شهرياً بكامل جلساته وأدويته' },
      { name: 'فلتر دم ومستلزمات تعقيم', amount: '350 ج.م', desc: 'تأمين فلتر الغسيل ومستهلكات الجلسة' }
    ],
    beneficiaries: ['مرضى الفشل الكلوي غير القادرين', 'الحالات الطارئة بمستشفيات الكلى', 'كبار السن المصابون بالقصور الكلوي'],
    bankTitle: 'حساب جلسة غسيل كلوي - فرع الثورة',
    bankBranch: 'فرع الثورة - بنك مصر',
    accountNumber: '1600001000013682',
    iban: 'EG660002016001600001000013682',
    officialUrl: 'https://www.akhawein.org/donations/جلسة-غسيل-كلوى/'
  },
  'prosthetics': {
    id: 'prosthetics',
    title: 'أجهزة تعويضية لذوي الهمم (تمكين وقدرة)',
    category: 'تمكين وقدرة',
    img: 'https://www.akhawein.org/wp-content/uploads/2024/03/9d994cb0-d9fe-4fe2-8e9c-567eb41a3e93.jpg',
    raised: '7,500 ج.م',
    goal: '10,000 ج.م',
    goalType: 'المستهدف التقديري',
    percent: 75,
    remaining: '2,500 ج.م',
    description: `تعتبر الأطراف الصناعية والأجهزة التعويضية مشروعاً تنموياً وإنسانياً متكاملاً للشخص ذوي الإعاقة؛ من أجل رفع الروح المعنوية، والاعتماد على النفس، واستعادة القدرة على العمل والإنتاج وإعالة أسرته.

محاور المشروع:
• توفير أطراف صناعية علوية وسفلية حديثة وتأهيل حركي.
• توفير الكراسي الكهربائية المتحركة والعادية لمرضى ضمور المخ واليمنيين والشلل ذوي الاحتياجات الخاصة.
• توفير سماعات طبية رقمية لضعاف السمع لمساعدتهم في الاندماج والتعليم.`,
    verse: 'قال رسول الله ﷺ: «المؤمن للمؤمن كالبنيان يشد بعضه بعضاً» وشبك بين أصابعه.',
    shares: [
      { name: 'سهم جهاز تعويضي', amount: '500 ج.م', desc: 'مساهمة في شراء الأطراف والأجهزة المساعدة' },
      { name: 'كرسي متحرك طبي قياسي', amount: '3,500 ج.م', desc: 'توفير وسيلة حركة كريمة لشخص من ذوي الإعاقة' },
      { name: 'سماعة أذن طبية رقمية', amount: '4,000 ج.م', desc: 'تمكين طفل أو طالب ضعيف السمع من متابعة دراسته' },
      { name: 'طرف صناعي تعويضي حديث', amount: '12,000 ج.م', desc: 'تركيب طرف صناعي متطور يعيد الشخص للعمل والإنتاج' }
    ],
    beneficiaries: ['ذوو الهمم والقدرات الخاصة', 'مرضى ضمور المخ والشلل', 'ضعاف السمع وبتر الأطراف'],
    bankTitle: 'حساب جمعية أخوين فرع صلاح سالم (الحساب الأساسي)',
    bankBranch: 'فرع صلاح سالم - بنك مصر',
    accountNumber: '1810001000033972',
    iban: 'EG020002018101810001000033972',
    officialUrl: 'https://www.akhawein.org/donations/ذوى-الهمم-اجهزة-تعويضية/'
  },
  'debt-relief': {
    id: 'debt-relief',
    title: 'فك كرب الغارمين وحالات عاجلة (فك كرب)',
    category: 'فك كرب',
    img: 'https://www.akhawein.org/wp-content/uploads/2024/04/d9114b7d-84f0-4d76-b56b-901444ee9076.jpeg',
    raised: '8,800 ج.م',
    goal: '10,000 ج.م',
    goalType: 'المستهدف التقديري',
    percent: 88,
    remaining: '1,200 ج.م',
    description: `S.O.S (Save Our Souls) - أنقذوا أرواحنا:

1. عمليات جراحية عاجلة: بعض الحالات المرضية لابد من التدخل الجراحي الفوري لإنقاذ حياة الإنسان، وإن لم تتم تكون النتيجة فقدان حياته.
2. سداد ديون المرضى: تقوم أخوين بسداد ديون المرضى التي تراكمت عليهم بسبب مصاريف العلاج وتوقف الدخل أثناء فترة المرض.
3. فك كرب الغارمين: مشروع خيري يهدف إلى مساعدة الغارمين وسداد ديونهم الناتجة عن ظروف مالية قهرية لحمايتهم من الحبس وتشتت أسرهم، وفق الالتزام بالمعايير والإجراءات القانونية الدقيقة.`,
    verse: 'قال رسول الله ﷺ: «مَن نَفَّسَ عن مُؤْمِنٍ كُرْبَةً مِن كُرَبِ الدُّنْيَا، نَفَّسَ اللَّهُ عنْه كُرْبَةً مِن كُرَبِ يَومِ القِيَامَةِ، وَمَن يَسَّرَ علَى مُعْسِرٍ، يَسَّرَ اللَّهُ عليه في الدُّنْيَا وَالآخِرَةِ».',
    shares: [
      { name: 'سهم فك كرب وتفريج هم', amount: '500 ج.م', desc: 'سهم مساهمة في سداد الديون والعمليات الحرجة' },
      { name: 'مساهمة عملية جراحية طارئة', amount: '2,500 ج.م', desc: 'إنقاذ حياة مريض يحتاج لتدخل جراحي فوري' },
      { name: 'سداد دين غارم / غارمة', amount: '5,000 ج.م', desc: 'إخلاء سبيل غارم وحماية أسرته من التشرد' }
    ],
    beneficiaries: ['الغارمات والغارمون المهددون بالحبس', 'مرضى العمليات الجراحية الطارئة', 'الأسر المعوزة في كرب شديد'],
    bankTitle: 'حساب جمعية أخوين فرع صلاح سالم (الحساب الأساسي)',
    bankBranch: 'فرع صلاح سالم - بنك مصر',
    accountNumber: '1810001000033972',
    iban: 'EG020002018101810001000033972',
    officialUrl: 'https://www.akhawein.org/donations/حالات-انسانية-عاجلة-فك-كرب/'
  },
  'winter-warmth': {
    id: 'winter-warmth',
    title: 'حملة دفا (بطانية ولحاف شتوي)',
    category: 'دفء وستر',
    img: 'https://www.akhawein.org/wp-content/uploads/2022/08/Untitled-1-1.png',
    raised: '420,000 ج.م',
    goal: '1,200,000 ج.م',
    goalType: 'المستهدف الموسمي',
    percent: 35,
    remaining: '780,000 ج.م',
    description: `«البرد أساس كل علّة.. هل ترضى أن يكون طفلك بدون غطاء في عز البرد؟»

احمِ أسرة من البرد وشارك معنا في حملة «دفا» السنوية لتوزيع البطاطين والألحفة الشتوية وبناء وترميم الأسقف للأسر الأكثر احتياجاً في قرى ونجوع مصر قبل موجات الصقيع.

أسعار المساهمة:
• بطانية شتوية ثقيلة فاخرة: 275 جنيهاً.
• لحاف فايبر شتوي دافئ: 325 جنيهاً.
• سهم بطانية + لحاف: 600 جنيه.

خطة التوزيع:
500 أسرة شهرياً × 600 ج (سهم بطانية + لحاف) × 4 شهور الشتاء = 1,200,000 جنيه.`,
    verse: 'عن النبي ﷺ قال: «أيما مسلم كسا مسلماً ثوباً على عري كساه الله من خضر الجنة، وأيما مسلم أطعم مسلماً على جوع أطعمه الله من ثمار الجنة».',
    shares: [
      { name: 'بطانية شتوية فاخرة ثقيلة', amount: '275 ج.م', desc: 'بطانية حرارية راقية لحماية طفل أو مسن من البرد' },
      { name: 'لحاف فايبر شتوي دافئ', amount: '325 ج.م', desc: 'لحاف فايبر عالي الجودة للتدفئة الشاملة' },
      { name: 'سهم بطانية + لحاف', amount: '600 ج.م', desc: 'تغطية كاملة لاحتياج سرير أو أسرة شتاءً' },
      { name: 'سهم بناء وترميم سقف منزل', amount: '2,500 ج.م', desc: 'حماية منزل أسرة من مياه الأمطار والسيول' }
    ],
    beneficiaries: ['الأسر في بيوت بلا أسقف', 'الأطفال والمسنون في القرى والنجوع', 'المناطق النائية الأكثر برودة'],
    bankTitle: 'حساب جمعية أخوين فرع صلاح سالم (الحساب الأساسي)',
    bankBranch: 'فرع صلاح سالم - بنك مصر',
    accountNumber: '1810001000033972',
    iban: 'EG020002018101810001000033972',
    officialUrl: 'https://www.akhawein.org/donations/دفا-بطانية-لحاف/'
  },
  'sacrifices': {
    id: 'sacrifices',
    title: 'صكوك الأضاحي (الأضاحي الشرعية)',
    category: 'نسك وبر',
    img: 'https://www.akhawein.org/wp-content/uploads/2024/04/c1886a76-dde0-47d4-a09a-e43688f74117.jpeg',
    raised: '0 ج.م',
    goal: '10,000 ج.م',
    goalType: 'المستهدف الموسمي',
    percent: 0,
    remaining: '10,000 ج.م',
    description: `قامت جمعية أخوين بإتاحة الفرصة لكل فئات الشعب لكي تساهم في الأضحية وفق الضوابط والأسس الشرعية المعتمدة (سُبع 1/7 من العجل البلدي أو أكثر).

يتم استلام النصيب الشرعي للمضحي (9 كجم من اللحم البلدي الصافي المشفي) خلال أيام عيد الأضحى المبارك، والاستلام بأولوية الحجز والذبح الشرعي.

وتتولى الجمعية ذبح وتشفية وتوزيع باقي الحصص على الأسر المستحقة والأيتام في القرى الأكثر احتياجاً تحت إشراف بيطري وشرعي كامل.`,
    verse: 'قال تعالى: {لَن يَنَالَ اللَّهَ لُحُومُهَا وَلَا دِمَاؤُهَا وَلَٰكِن يَنَالُهُ التَّقْوَىٰ مِنكُمْ} [الحج: 37].',
    shares: [
      { name: 'سُبع صك أضحية بقري بلدي', amount: 'حسب تسعير الموسم', desc: 'حصة شرعية تشمل 9 كجم للمضحي والباقي يوزع على الفقراء' },
      { name: 'سهم لحوم أضاحي وصدقات', amount: '500 ج.م', desc: 'مساهمة مفتوحة لتوزيع اللحوم على غير القادرين' },
      { name: 'كفالة توزيع أضحية كاملة', amount: 'حسب تسعير الموسم', desc: 'ذبح وتوزيع عجل بلدي كامل باسم المتبرع' }
    ],
    beneficiaries: ['الأسر الأشد احتياجاً بالقرى والنجوع', 'الأيتام والأرامل المتعففون', 'المضحون الراغبون في الثواب الشرعي'],
    bankTitle: 'حساب صك الأضحية - فرع الثورة',
    bankBranch: 'فرع الثورة - بنك مصر',
    accountNumber: '1600001000013671',
    iban: 'EG660002016001600001000013671',
    officialUrl: 'https://www.akhawein.org/donations/صكوك-الاضاحى/'
  },
  'gaza-relief': {
    id: 'gaza-relief',
    title: 'إغاثة إنسانية عاجلة (أهالينا في قطاع غزة)',
    category: 'إغاثة ونصرة',
    img: 'https://www.akhawein.org/wp-content/uploads/2022/08/donate-1.jpg',
    raised: '8,500 ج.م',
    goal: '10,000 ج.م',
    goalType: 'المستهدف الإغاثي',
    percent: 85,
    remaining: '1,500 ج.م',
    description: `تطلق جمعية أخوين الخيرية حملة إغاثة إنسانية عاجلة لمساندة أهالينا المنكوبين في قطاع غزة لتوفير احتياجاتهم الضرورية من الغذاء والدواء والإيواء الطارئ.

سعر كرتونة المواد الغذائية العاجلة لدعم أسرة مكونة من 5 أفراد لمدة أسبوع: 400 جنيه.
مبلغ التبرع متاح بـ 10 جنيهات ومضاعفاتها.

تبرع بزكاتك أو صدقتك أو صدقتك الجارية لنصرة إخواننا والتخفيف من معاناتهم الإنسانية الأليمة.`,
    verse: 'قال رسول الله ﷺ: «مثل المؤمنين في توادهم وتراحمهم وتعاطفهم مثل الجسد إذا اشتكى منه عضو تداعى له سائر الجسد بالسهر والحمى».',
    shares: [
      { name: 'كرتونة إغاثة غذائية لأسرة (5 أفراد)', amount: '400 ج.م', desc: 'تأمين الغذاء الضروري لأسرة لمدة أسبوع' },
      { name: 'سهم إغاثة طبية وإسعافات', amount: '250 ج.م', desc: 'مساهمة في توفير الأدوية والمستهلكات الطبية' },
      { name: 'سهم التضامن المفتوح', amount: '100 ج.م', desc: 'مساهمة إنسانية عاجلة لنصرة إخواننا' }
    ],
    beneficiaries: ['أهالي قطاع غزة والنازحون', 'الجرحى والمرضى', 'الأسر التي فقدت المأوى'],
    bankTitle: 'حساب جمعية أخوين فرع صلاح سالم (الحساب الأساسي)',
    bankBranch: 'فرع صلاح سالم - بنك مصر',
    accountNumber: '1810001000033972',
    iban: 'EG020002018101810001000033972',
    officialUrl: 'https://www.akhawein.org/donations/اغاثة-عاجلة/'
  },
  'animal-welfare': {
    id: 'animal-welfare',
    title: 'الرأفة والرفق بالحيوان',
    category: 'رحمة ورفق',
    img: 'https://www.akhawein.org/wp-content/uploads/2024/04/0ff8dd16-2aac-47a3-9554-054175903c1f.jpeg',
    raised: '0 ج.م',
    goal: '10,000 ج.م',
    goalType: 'المستهدف التقديري',
    percent: 0,
    remaining: '10,000 ج.م',
    description: `هدف جمعية أخوين نشر الرحمة في القلوب والتوعية المجتمعية الشاملة بالرفق بالحيوان وتغيير الأفكار السلبية وتقليل القسوة التي انتشرت ضد الحيوانات الضعيفة والمشردة.

يشمل البرنامج تقديم الرعاية البيطرية للحيوانات المصابة، وتوفير نقاط إطعام وسقيا دورية، استجابةً للتعاليم الدينية والقيم الإنسانية السامية التي جعلت الإحسان إلى الحيوان سبباً لمغفرة الذنوب ودخول الجنة.`,
    verse: 'قال رسول الله ﷺ: «بينما رجل يمشي بطريق اشتد عليه العطش، فوجد بئراً فنزل فيها فشرب ثم خرج، فإذا كلب يلهث يأكل الثرى من العطش... فسقاه فشكر الله له فغفر له»، قالوا: يا رسول الله وإن لنا في البهائم لأجراً؟ قال: «في كل ذات كبد رطبة أجر».',
    shares: [
      { name: 'سهم رعاية بيطرية وإطعام', amount: '150 ج.م', desc: 'توفير الغذاء والعلاج لحيوان مشرد أو مصاب' },
      { name: 'سهم التوعية المجتمعية', amount: '300 ج.م', desc: 'دعم برامج التوعية المدرسية بالرفق بالحيوان' },
      { name: 'نقطة سقيا وإطعام دائمة', amount: '500 ج.م', desc: 'تجهيز أوعية سقيا وطعام آمنة للحيوانات المشردة' }
    ],
    beneficiaries: ['الحيوانات المشردة والمصابة', 'المجتمع والبيئة العامة'],
    bankTitle: 'حساب جمعية أخوين فرع صلاح سالم (الحساب الأساسي)',
    bankBranch: 'فرع صلاح سالم - بنك مصر',
    accountNumber: '1810001000033972',
    iban: 'EG020002018101810001000033972',
    officialUrl: 'https://www.akhawein.org/donations/الرأفة-بالحيوك/'
  }
};

let currentCauseId = null;
const CAUSE_KEYS = Object.keys(ALL_CAUSES_DATA);

function openCauseModal(causeId) {
  const cause = ALL_CAUSES_DATA[causeId];
  if (!cause) {
    console.warn('Cause not found:', causeId);
    return;
  }

  currentCauseId = causeId;
  const overlay = document.getElementById('causeModalOverlay');
  if (!overlay) return;

  // Set Text & Media
  const badgeText = document.getElementById('causeModalBadgeText');
  if (badgeText) badgeText.textContent = cause.category;

  const title = document.getElementById('causeModalTitle');
  if (title) title.textContent = cause.title;

  const heroImg = document.getElementById('causeModalHeroImg');
  if (heroImg) {
    heroImg.src = cause.img;
    heroImg.alt = cause.title;
  }

  const raised = document.getElementById('causeModalRaised');
  if (raised) raised.textContent = cause.raised;

  const goal = document.getElementById('causeModalGoal');
  if (goal) goal.textContent = cause.goal;

  const percent = document.getElementById('causeModalPercent');
  if (percent) percent.textContent = `${cause.percent}%`;

  const remaining = document.getElementById('causeModalRemaining');
  if (remaining) remaining.textContent = cause.remaining;

  const progressBar = document.getElementById('causeModalProgressBar');
  if (progressBar) {
    progressBar.style.width = '0%';
    setTimeout(() => {
      progressBar.style.width = `${Math.min(100, Math.max(0, cause.percent))}%`;
    }, 150);
  }

  const desc = document.getElementById('causeModalDesc');
  if (desc) desc.textContent = cause.description;

  const verseCard = document.getElementById('causeModalVerse');
  if (verseCard) {
    if (cause.verse) {
      verseCard.innerHTML = `<i class="fa-solid fa-quote-right" style="margin-left: 0.5rem; color: var(--primary);"></i> ${cause.verse}`;
      verseCard.style.display = 'block';
    } else {
      verseCard.style.display = 'none';
    }
  }

  // Render Shares
  const sharesGrid = document.getElementById('causeModalSharesGrid');
  const sharesSection = document.getElementById('causeModalSharesSection');
  if (sharesGrid && sharesSection) {
    if (cause.shares && cause.shares.length) {
      sharesGrid.innerHTML = cause.shares.map(s => `
        <div class="cause-modal-share-card" onclick="selectCauseShare('${s.name}', '${s.amount}')" title="انقر للتبرع بهذا السهم">
          <div class="cause-modal-share-header">
            <span class="cause-modal-share-title">${s.name}</span>
            <span class="cause-modal-share-price">${s.amount}</span>
          </div>
          <p class="cause-modal-share-desc">${s.desc}</p>
          <div style="font-size: 0.8rem; color: var(--primary); font-weight: 700; display: flex; align-items: center; gap: 0.35rem;">
            <i class="fa-solid fa-heart"></i> اختر للتبرع
          </div>
        </div>
      `).join('');
      sharesSection.style.display = 'block';
    } else {
      sharesSection.style.display = 'none';
    }
  }

  // Render Beneficiaries
  const chipsWrap = document.getElementById('causeModalChips');
  const beneficiariesSection = document.getElementById('causeModalBeneficiariesSection');
  if (chipsWrap && beneficiariesSection) {
    if (cause.beneficiaries && cause.beneficiaries.length) {
      chipsWrap.innerHTML = cause.beneficiaries.map(b => `
        <span class="cause-modal-chip"><i class="fa-solid fa-circle-check"></i> ${b}</span>
      `).join('');
      beneficiariesSection.style.display = 'block';
    } else {
      beneficiariesSection.style.display = 'none';
    }
  }

  // Bank Misr Details
  const bankTitle = document.getElementById('causeModalBankTitle');
  if (bankTitle) bankTitle.textContent = cause.bankTitle;

  const bankBranch = document.getElementById('causeModalBankBranch');
  if (bankBranch) bankBranch.textContent = cause.bankBranch;

  const accNum = document.getElementById('causeModalAccNum');
  if (accNum) accNum.textContent = cause.accountNumber;

  const iban = document.getElementById('causeModalIban');
  if (iban) iban.textContent = cause.iban;

  // WhatsApp Link
  const waBtn = document.getElementById('causeModalWhatsAppBtn');
  if (waBtn) {
    const waText = encodeURIComponent(`السلام عليكم ورحمة الله، أود الاستفسار والتبرع لمشروع: "${cause.title}" عبر جمعية أخوين الخيرية.`);
    waBtn.href = `https://wa.me/201281769685?text=${waText}`;
  }

  // Show Modal
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Reset scroll of body
  const modalBody = document.getElementById('causeModalBody');
  if (modalBody) modalBody.scrollTop = 0;

  // Reset copy button state
  const copyBtn = document.getElementById('causeModalCopyBtn');
  if (copyBtn) {
    copyBtn.classList.remove('copied');
    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> <span>نسخ رقم الحساب</span>';
  }

  // Update URL hash smoothly
  if (history.replaceState) {
    history.replaceState(null, null, `#case-${causeId}`);
  }
}

function closeCauseModal() {
  const overlay = document.getElementById('causeModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
  currentCauseId = null;

  if (window.location.hash.startsWith('#case-') && history.replaceState) {
    history.replaceState(null, null, window.location.pathname + window.location.search);
  }
}

function navigateCauseModal(direction) {
  if (!currentCauseId) return;
  const currentIndex = CAUSE_KEYS.indexOf(currentCauseId);
  if (currentIndex === -1) return;

  let nextIndex = currentIndex + direction;
  if (nextIndex < 0) nextIndex = CAUSE_KEYS.length - 1;
  if (nextIndex >= CAUSE_KEYS.length) nextIndex = 0;

  openCauseModal(CAUSE_KEYS[nextIndex]);
}

let causeModalCopyTimeout = null;

function copyCurrentCauseAccount() {
  if (!currentCauseId) return;
  const cause = ALL_CAUSES_DATA[currentCauseId];
  if (!cause || !cause.accountNumber) return;

  const copyBtn = document.getElementById('causeModalCopyBtn');
  const accNumEl = document.getElementById('causeModalAccNum');

  function triggerCopySuccess() {
    // 1. Direct Visual Button Transformation
    if (copyBtn) {
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>تم النسخ بنجاح! ✓</span>';
    }

    // 2. Pulse & Glow the Account Number
    if (accNumEl) {
      accNumEl.classList.remove('copied-flash');
      void accNumEl.offsetWidth; // Force CSS reflow
      accNumEl.classList.add('copied-flash');
    }

    // 3. Floating Glassmorphism Toast Banner
    showToast(`✓ تم نسخ رقم حساب "${cause.title}" بنجاح: ${cause.accountNumber}`);

    // 4. Confetti Explosion from the Button Center
    if (typeof confetti === 'function' && copyBtn) {
      const rect = copyBtn.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { x: originX, y: originY },
        colors: ['#10b981', '#34d399', '#fcb429', '#d57b1e', '#ffffff']
      });
    }

    // 5. Smooth Reset after 2.8s
    if (causeModalCopyTimeout) clearTimeout(causeModalCopyTimeout);
    causeModalCopyTimeout = setTimeout(() => {
      if (copyBtn) {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> <span>نسخ رقم الحساب</span>';
      }
      if (accNumEl) {
        accNumEl.classList.remove('copied-flash');
      }
    }, 2800);
  }

  // Modern clipboard writeText with seamless execCommand fallback
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cause.accountNumber)
      .then(triggerCopySuccess)
      .catch(() => {
        fallbackCopyText(cause.accountNumber);
        triggerCopySuccess();
      });
  } else {
    fallbackCopyText(cause.accountNumber);
    triggerCopySuccess();
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  textArea.style.left = '-9999px';
  textArea.setAttribute('readonly', '');
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (e) {
    console.warn('Fallback copy command failed', e);
  }
  document.body.removeChild(textArea);
}

function selectCauseShare(shareName, amount) {
  const cause = ALL_CAUSES_DATA[currentCauseId];
  if (!cause) return;

  const waText = encodeURIComponent(`السلام عليكم ورحمة الله، أود التبرع لـ "${cause.title}" - سهم: "${shareName}" بقيمة (${amount}). كيف يمكنني إتمام التبرع؟`);
  window.open(`https://wa.me/201281769685?text=${waText}`, '_blank');
}

function shareCurrentCause() {
  if (!currentCauseId) return;
  const cause = ALL_CAUSES_DATA[currentCauseId];
  if (!cause) return;

  const shareUrl = `${window.location.origin}${window.location.pathname}#case-${currentCauseId}`;
  if (navigator.share) {
    navigator.share({
      title: `${cause.title} | جمعية أخوين الخيرية`,
      text: `ساهم معنا في دعم ${cause.title} لدى جمعية أخوين الخيرية:`,
      url: shareUrl
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast(`تم نسخ رابط حالة "${cause.title}" بنجاح!`);
    });
  }
}

function initCauseDetailsModal() {
  // Check URL Hash on Load
  const hash = window.location.hash;
  if (hash) {
    const cleanId = hash.replace(/^#case-|^#/, '');
    if (ALL_CAUSES_DATA[cleanId]) {
      setTimeout(() => openCauseModal(cleanId), 300);
    }
  }

  // Keyboard navigation & escape listener
  document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('causeModalOverlay');
    if (!overlay || !overlay.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeCauseModal();
    } else if (e.key === 'ArrowLeft') {
      navigateCauseModal(1); // RTL next
    } else if (e.key === 'ArrowRight') {
      navigateCauseModal(-1); // RTL previous
    }
  });
}

// Expose globally for HTML onclick handlers
window.ALL_CAUSES_DATA = ALL_CAUSES_DATA;
window.openCauseModal = openCauseModal;
window.closeCauseModal = closeCauseModal;
window.navigateCauseModal = navigateCauseModal;
window.copyCurrentCauseAccount = copyCurrentCauseAccount;
window.selectCauseShare = selectCauseShare;
window.shareCurrentCause = shareCurrentCause;
window.initCauseDetailsModal = initCauseDetailsModal;

