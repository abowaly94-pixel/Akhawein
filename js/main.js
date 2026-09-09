/**
 * جمعية أخوين الخيرية - Interactive Controller
 * Premium, Human-Crafted Micro-Interactions & JS Animations
 * Features:
 *  - 3D Dynamic Card Tilt with Specular Lighting
 *  - Magnetic Cursor-Aware Buttons
 *  - Smooth Click Ripple Waves
 *  - Real-time Interactive Donation Calculator with Live Impact
 *  - Interactive Program Category Filter Bar with Smooth Transitions
 *  - Dynamic Hero Parallax Mouse Reactivity
 *  - Confetti & Toast Feedback on Bank/Contact Copy
 *  - Circular Scroll Progress on Floating Back-To-Top
 *  - Fluid Ease-Out Statistics Counter
 *  - Active Section ScrollSpy for Nav Links
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      once: true,
      offset: 50
    });
  }

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
});

/* -------------------------------------------------------------------------- */
/* 1. 3D Card Tilt with Cursor-Aware Specular Glare                          */
/* -------------------------------------------------------------------------- */
function initCard3DTilt() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;

  const tiltCards = document.querySelectorAll('.program-card, .cause-card, .bank-card, .about-image-wrapper');
  
  tiltCards.forEach(card => {
    let bounds;

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
      const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

      // Subtle tilt: max 5.5 degrees
      const maxTilt = 5.5;
      const rotateX = (center.y / (bounds.height / 2)) * -maxTilt;
      const rotateY = (center.x / (bounds.width / 2)) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      card.style.setProperty('--mouse-x', `${leftX}px`);
      card.style.setProperty('--mouse-y', `${topY}px`);
    }

    card.addEventListener('mouseenter', () => {
      updateBounds();
      card.style.transition = 'transform 0.12s ease-out, box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', onMouseMove);

    card.addEventListener('mouseleave', () => {
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

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Gentle magnetic pull: max 7px
      const pull = 0.22;
      btn.style.transform = `translate(${x * pull}px, ${y * pull}px)`;
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
    mouseX = x * 20; // 20px range
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
/* 5. Interactive Real-Time Donation Calculator with Impact                  */

/* -------------------------------------------------------------------------- */
/* 6. Programs Filter Bar with Animated Card Appearance                       */
/* -------------------------------------------------------------------------- */
function initProgramFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.programs-grid .program-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter'); // 'all', 'social', 'health-edu', 'dev'

      cards.forEach((card, index) => {
        const category = card.getAttribute('data-category') || 'all';
        const matches = (filter === 'all' || category.includes(filter));

        if (matches) {
          card.classList.remove('filtered-out');
          card.classList.remove('filter-anim');
          void card.offsetWidth; // trigger reflow
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
/* 7. Enhanced Copy-to-Clipboard with Celebratory Confetti Burst              */
/* -------------------------------------------------------------------------- */
function initCopyToClipboard() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const accNumber = btn.getAttribute('data-copy');
      if (!accNumber) return;

      navigator.clipboard.writeText(accNumber).then(() => {
        showToast('تم نسخ رقم الحساب بنجاح: ' + accNumber);
        
        // Confetti burst from button position
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
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 8. Circular Progress Ring on Floating Back-To-Top Button                  */
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
/* 9. ScrollSpy for Active Navbar Link Highlight                              */
/* -------------------------------------------------------------------------- */
function initScrollSpy() {
  const allNavLinks = document.querySelectorAll('.nav-menu .nav-link');
  if (!allNavLinks.length) return;

  // Identify current page filename
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  let pageLink = null;
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      pageLink = link;
    }
  });

  // If there are anchor links on this page, spy on them
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
/* 10. Ease-Out Dynamic Statistics Counters                                   */
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
/* 11. Animated Progress Bars                                                 */
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
/* 12. Smart Email Links (Gmail on Desktop, native mailto on mobile)          */
/* -------------------------------------------------------------------------- */
function initSmartEmailLinks() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
      if (!isMobile) {
        e.preventDefault();
        const email = 'info@akhawein.org';
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent('استفسار لجمعية أخوين الخيرية')}`;
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 13. Top Scroll Progress Indicator                                          */
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
/* 14. Dynamic Years Calculation                                              */
/* -------------------------------------------------------------------------- */
function initDynamicYears() {
  const startYear = 2009;
  const currentYear = new Date().getFullYear();
  const years = Math.max(1, currentYear - startYear);
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const yearsArabic = years.toString().split('').map(d => arabicDigits[d] || d).join('');
  const yearArabic = currentYear.toString().split('').map(d => arabicDigits[d] || d).join('');

  const expYearsElem = document.getElementById('experienceYears') || document.querySelector('.experience-years');
  if (expYearsElem) expYearsElem.textContent = `+${yearsArabic}`;

  const currentYearElem = document.getElementById('currentYear');
  if (currentYearElem) currentYearElem.textContent = yearArabic;
}

/* -------------------------------------------------------------------------- */
/* 15. Navbar Sticky                                                          */
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
/* 16. Hero Slider                                                            */
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
/* 17. Video Player                                                           */
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
/* 18. Toast Notifications                                                    */
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
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981; font-size: 1.35rem;"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* -------------------------------------------------------------------------- */
/* 19. Visitor Counter Simulation                                             */
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
/* 20. Forms & Mobile Drawer                                                  */
/* -------------------------------------------------------------------------- */
function initForms() {
  const contactForm = document.getElementById('quickContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = (document.getElementById('senderName')?.value || '').trim();
      const phone = (document.getElementById('senderPhone')?.value || '').trim();
      const email = (document.getElementById('senderEmail')?.value || '').trim() || 'غير محدد';
      const typeSelect = document.getElementById('requestType');
      const typeText = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'طلب عام';
      const message = (document.getElementById('senderMessage')?.value || '').trim();

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

      // البريد الإلكتروني المستلم
      const RECIPIENT_EMAIL = 'info@akhawein.org';

      // رابط واتساب كخطة بديلة إذا تعذر الاتصال
      const waNumber = '201281769685';
      const waText = `السلام عليكم ورحمة الله،\nرسالة من موقع الجمعية:\n👤 الاسم: ${name}\n📞 الهاتف: ${phone}\n📧 البريد: ${email}\n📋 نوع الطلب: ${typeText}\n💬 الرسالة: ${message}`;
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

      // حفظ نسخة محلياً في المتصفح للأرشيف
      try {
        const savedMsgs = JSON.parse(localStorage.getItem('akhwain_messages') || '[]');
        savedMsgs.unshift({
          id: Date.now(),
          date: new Date().toLocaleString('ar-EG'),
          name,
          phone,
          email,
          type: typeText,
          message
        });
        localStorage.setItem('akhwain_messages', JSON.stringify(savedMsgs.slice(0, 50)));
      } catch (err) {
        console.error('LocalStorage error:', err);
      }

      // الإرسال الفعلي عبر خدمة FormSubmit المباشرة
      try {
        const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
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
        } else if (data.message && (data.message.includes('Activation') || data.message.includes('activation') || data.message.includes('Activate'))) {
          showToast('تم إرسال رابط التفعيل إلى بريد الجمعية.');
          contactForm.reset();
          if (formStatus) {
            formStatus.style.display = 'block';
            formStatus.innerHTML = `
              <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; color: #1e40af; padding: 1.5rem; border-radius: 12px;">
                <i class="fa-solid fa-envelope-circle-check" style="font-size: 2.2rem; color: #3b82f6; margin-bottom: 0.5rem; display: inline-block;"></i>
                <h4 style="margin: 0.5rem 0; font-size: 1.2rem; font-weight: 700;">تأكيد وتفعيل البريد الإلكتروني</h4>
                <p style="margin: 0 0 0.5rem; font-size: 0.95rem;">تم إرسال رابط تفعيل لمرة واحدة إلى البريد (<strong>${RECIPIENT_EMAIL}</strong>). يرجى فتح البريد والضغط على رابط التفعيل (Activate Form) لمرة واحدة فقط لتصل كافة الرسائل القادمة إلى بريدكم فوراً.</p>
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
              <a href="${waUrl}" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; background: #25D366; border-color: #25D366; padding: 0.6rem 1.4rem; border-radius: 8px; color: #fff; text-decoration: none; font-weight: 600;">
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
}

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

  const drawerLinks = document.querySelectorAll('.mobile-nav-links a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}
