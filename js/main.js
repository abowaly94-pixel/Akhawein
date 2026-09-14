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
      duration: 800,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      once: true,
      offset: 50
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
});

/* -------------------------------------------------------------------------- */
/* 1. 3D Card Tilt with Specular Glare & requestAnimationFrame Performance   */
/* -------------------------------------------------------------------------- */
function initCard3DTilt() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;

  const tiltCards = document.querySelectorAll('.program-card, .cause-card, .bank-card, .about-image-wrapper');
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

    if (window.scrollY > 350) {
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

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  let pageLink = null;
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
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
/* 18. Visitor Counter Simulation                                             */
/* -------------------------------------------------------------------------- */
function initVisitorCounter() {
  const digitsContainer = document.getElementById('visitorDigits');
  const totalUsersElem = document.getElementById('totalUsersCount');
  const totalViewsElem = document.getElementById('totalViewsCount');
  if (!digitsContainer) return;

  let baseCount = 1006847;
  let viewsCount = 1021073;

  function renderDigits(count) {
    const str = count.toString().padStart(7, '0');
    digitsContainer.innerHTML = '';
    for (let char of str) {
      const digit = document.createElement('div');
      digit.className = 'digit-box';
      digit.textContent = char;
      digitsContainer.appendChild(digit);
    }
  }

  renderDigits(baseCount);
  if (totalUsersElem) totalUsersElem.textContent = baseCount.toLocaleString('ar-EG');
  if (totalViewsElem) totalViewsElem.textContent = viewsCount.toLocaleString('ar-EG');

  setInterval(() => {
    baseCount += 1;
    viewsCount += Math.floor(Math.random() * 2) + 1;
    renderDigits(baseCount);
    if (totalUsersElem) totalUsersElem.textContent = baseCount.toLocaleString('ar-EG');
    if (totalViewsElem) totalViewsElem.textContent = viewsCount.toLocaleString('ar-EG');
  }, 12000);
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
        showToast('تم إرسال رسالتك بنجاح إلى بريد الجمعية!');
        contactForm.reset();
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #065f46; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);">
              <i class="fa-solid fa-circle-check" style="font-size: 2.2rem; color: #10b981; margin-bottom: 0.5rem; display: inline-block;"></i>
              <h4 style="margin: 0.5rem 0; font-size: 1.25rem; font-weight: 700; color: #065f46;">تم إرسال رسالتك بنجاح!</h4>
              <p style="margin: 0; color: #047857; font-size: 0.95rem;">شكراً لتواصلك مع جمعية أخوين. تم إرسال كافة التفاصيل إلى إدارة الجمعية وسيتم مراجعتها والتواصل معكم قريباً.</p>
            </div>
          `;
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
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
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

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Mark current active link in drawer automatically
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const drawerLinks = document.querySelectorAll('.mobile-nav-links a');
  drawerLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.style.fontWeight = '700';
      link.style.color = 'var(--primary)';
    }
    link.addEventListener('click', closeDrawer);
  });
}

/* -------------------------------------------------------------------------- */
/* 21. Certificates Interactive Lightbox Modal Controller                     */
/* -------------------------------------------------------------------------- */
function initCertificatesLightbox() {
  const modal = document.getElementById('certLightboxModal');
  if (!modal) return;

  const modalImg = document.getElementById('certLightboxImg');
  const counterEl = document.getElementById('certLightboxCounter');
  const downloadBtn = document.getElementById('certLightboxDownload');
  const closeBtn = modal.querySelector('.close-btn');
  const prevBtn = modal.querySelector('.prev-btn');
  const nextBtn = modal.querySelector('.next-btn');

  // Collect all certificate trigger elements on the page
  const triggerCards = Array.from(document.querySelectorAll('[data-cert-src]'));
  if (triggerCards.length === 0) return;

  const certData = triggerCards.map((el, idx) => ({
    src: el.getAttribute('data-cert-src'),
    title: el.getAttribute('data-cert-title') || `شهادة تقدير #${idx + 1}`,
    index: idx
  }));

  let currentIndex = 0;

  function updateModal(index) {
    if (index < 0) index = certData.length - 1;
    if (index >= certData.length) index = 0;
    currentIndex = index;

    const item = certData[currentIndex];
    
    // Quick fade transition
    if (modalImg) {
      modalImg.style.opacity = '0';
      modalImg.style.transform = 'scale(0.95)';
      setTimeout(() => {
        modalImg.src = item.src;
        modalImg.alt = item.title;
        modalImg.onload = () => {
          modalImg.style.opacity = '1';
          modalImg.style.transform = 'scale(1)';
        };
      }, 150);
    }

    if (counterEl) {
      const currentAr = toArabicDigits(currentIndex + 1);
      const totalAr = toArabicDigits(certData.length);
      counterEl.innerHTML = `<i class="fa-solid fa-award" style="color: var(--accent);"></i> شهادة ${currentAr} من ${totalAr}`;
    }

    if (downloadBtn) {
      downloadBtn.href = item.src;
      downloadBtn.setAttribute('download', `شهادة-تقدير-جمعية-أخوين-${currentIndex + 1}.jpg`);
    }
  }

  function openModal(index) {
    updateModal(index);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
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

  // Attach click listeners to cards and trigger buttons
  triggerCards.forEach((el, idx) => {
    el.addEventListener('click', (e) => {
      // If clicked on download link inside card, don't open modal
      if (e.target.closest('.cert-download-direct')) return;
      e.preventDefault();
      openModal(idx);
    });
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
    // In RTL, ArrowRight naturally points to next or prev; support both intuitive directions
    if (e.key === 'ArrowRight') prevCert();
    if (e.key === 'ArrowLeft') nextCert();
  });

  // Touch swipe support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevCert(); // Swiped right
      } else {
        nextCert(); // Swiped left
      }
    }
  }, { passive: true });
}

