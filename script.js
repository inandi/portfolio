// Build a consistent header menu across all pages
function getMenuHtml() {
  return (
    '<a class="brand" href="index.html" aria-label="Home">' +
    '<span class="brand-mark" aria-hidden="true">●</span>' +
    '<span class="brand-text">Gobinda Nandi</span>' +
    '</a>' +
    '<nav class="nav" aria-label="Primary">' +
    '<button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
    '<ul id="site-nav" class="nav-list">' +
    '<li><a href="index.html">Home</a></li>' +
    '<li><a href="experience.html">Experience</a></li>' +
    '<li><a href="books.html">Books</a></li>' +
    '<li><a href="blogs.html">Blogs</a></li>' +
    '<li><a href="products.html">Products</a></li>' +
    '<li class="has-submenu">' +
    '<button class="submenu-toggle" aria-expanded="false">Miscellaneous</button>' +
    '<ul class="submenu">' +
    '<li><a href="courses.html">Courses</a></li>' +
    '</ul>' +
    '</li>' +
    '</ul>' +
    '</nav>'
  );
}

function loadMenu() {
  const headerInner = document.querySelector('.site-header .header-inner');
  if (headerInner) {
    headerInner.innerHTML = getMenuHtml();
  }
}

// Build a consistent footer across all pages
function getFooterHtml() {
  return (
    '<div class="contact-row" style="justify-content:center; margin-bottom:10px;">' +
    '<a class="btn primary" href="mailto:01ampoule_zero@icloud.com">01ampoule_zero@icloud.com</a>' +
    '<a class="btn ghost" href="https://www.linkedin.com/in/inandi/" target="_blank" rel="noopener">LinkedIn</a>' +
    '<a class="btn ghost" href="https://github.com/inandi" target="_blank" rel="noopener">GitHub</a>' +
    '<a class="btn ghost" href="https://stackoverflow.com/users/7991798/gobinda-nandi" target="_blank" rel="noopener">Stack Overflow</a>' +
    '</div>' +
    '<p>© <span id="year"></span> Gobinda Nandi</p>'
  );
}

function loadFooter() {
  const footerContainer = document.querySelector('.site-footer .container');
  if (footerContainer) {
    footerContainer.innerHTML = getFooterHtml();
    // set year
    const yearEl = footerContainer.querySelector('#year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }
}

function initNavToggle() {
  const navToggleButton = document.querySelector('.nav-toggle');
  const navList = document.querySelector('#site-nav');
  if (navToggleButton && navList) {
    navToggleButton.addEventListener('click', () => {
      const expanded = navToggleButton.getAttribute('aria-expanded') === 'true';
      navToggleButton.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('open');
    });
  }
}

// Reveal on scroll
const revealEls = Array.from(document.querySelectorAll('.reveal'));
const onIntersect = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
};
const io = new IntersectionObserver(onIntersect, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Current year
const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Smooth anchor scroll (reduced motion respected)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', targetId);
      }
    });
  });
}

// Quantum nodes background (lightweight)
(function initQuantumBackground() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuantumBackground);
    return;
  }

  const canvas = document.getElementById('quantum');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let width = 0, height = 0;
  let nodes = [];
  const MAX_NODES = 60; // keep it lightweight
  let raf = 0;
  let isRunning = false;

  function resize() {
    // Get actual canvas container dimensions
    const container = canvas.parentElement;
    if (!container) return;
    
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    
    // Set canvas size with proper DPR
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    // Respawn nodes if already running
    if (isRunning && nodes.length > 0) {
      spawnNodes();
    }
  }

  function spawnNodes() {
    nodes = Array.from({ length: MAX_NODES }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 1.5,
    }));
  }

  function step() {
    if (!isRunning) return;
    
    ctx.clearRect(0, 0, width, height);
    
    // connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 140 * 140) {
          const alpha = 1 - Math.sqrt(dist2) / 140;
          ctx.strokeStyle = `rgba(122,162,255,${alpha * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    
    // nodes
    for (const n of nodes) {
      ctx.fillStyle = 'rgba(93,228,199,0.6)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      n.x += n.vx; n.y += n.vy;
      if (n.x < -10) n.x = width + 10; if (n.x > width + 10) n.x = -10;
      if (n.y < -10) n.y = height + 10; if (n.y > height + 10) n.y = -10;
    }
    
    raf = requestAnimationFrame(step);
  }

  function start() {
    if (prefersReducedMotion) return; // respect reduced motion
    if (isRunning) return; // already running
    
    cancelAnimationFrame(raf);
    resize();
    
    // Ensure we have valid dimensions
    if (width === 0 || height === 0) {
      // Retry after a short delay
      setTimeout(start, 100);
      return;
    }
    
    spawnNodes();
    isRunning = true;
    raf = requestAnimationFrame(step);
  }

  function stop() {
    isRunning = false;
    cancelAnimationFrame(raf);
  }

  // Handle resize with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
    }, 250);
  });

  // Handle visibility change (pause when tab is hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  // Start animation
  start();
})();

// Awards carousel
(() => {
  const wrap = document.getElementById('awards-carousel');
  if (!wrap) return;
  const track = wrap.querySelector('.carousel-track');
  const slides = Array.from(wrap.querySelectorAll('.carousel-slide'));
  const prev = wrap.querySelector('.prev');
  const next = wrap.querySelector('.next');
  let index = 0;

  function update() {
    const offset = -index * wrap.querySelector('.carousel-viewport').clientWidth;
    track.style.transform = `translateX(${offset}px)`;
  }

  function go(dir) {
    index = (index + dir + slides.length) % slides.length;
    update();
  }

  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));
  window.addEventListener('resize', update);
  update();
})();

function initSubmenus() {
  // Convert click-to-open to hover/focus behavior with proper aria state updates
  const submenuGroups = Array.from(document.querySelectorAll('.has-submenu'));
  submenuGroups.forEach(group => {
    const btn = group.querySelector(':scope > .submenu-toggle');
    const submenu = group.querySelector(':scope > .submenu');
    if (!btn || !submenu) return;

    // Update aria on hover/focus
    function setExpanded(expanded) {
      btn.setAttribute('aria-expanded', String(expanded));
    }

    // Mouse enter/leave
    let pinned = false;
    group.addEventListener('mouseenter', () => { if (!pinned) setExpanded(true); });
    group.addEventListener('mouseleave', () => { if (!pinned) setExpanded(false); });

    // Keyboard focus handling to allow hover-like open via keyboard navigation
    btn.addEventListener('focus', () => setExpanded(true));
    btn.addEventListener('blur', () => setExpanded(false));
    submenu.addEventListener('focusin', () => setExpanded(true));
    submenu.addEventListener('focusout', (e) => {
      // collapse when focus leaves the group
      const related = e.relatedTarget;
      if (!group.contains(related)) setExpanded(false);
    });

    // Click-to-pin: clicking the toggle pins the submenu open; clicking again unpins
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      pinned = !pinned;
      setExpanded(pinned);
    });
  });
}

// LinkedIn Recommendations Carousel
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.recommendations-carousel');
    if (!carousel) return;

    const slides = carousel.querySelector('.recommendations-carousel-slides');
    const images = slides.querySelectorAll('img');
    const dots = carousel.querySelectorAll('.recommendation-dot');
    let currentSlide = 0;

    function updateCarousel() {
      // Hide all images
      images.forEach((img, index) => {
        img.style.opacity = index === currentSlide ? '1' : '0';
        img.style.zIndex = index === currentSlide ? '1' : '0';
      });

      // Update dots
      dots.forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Add click handlers to dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
        resetAutoScroll();
      });
    });

    // Auto-advance carousel every 5 seconds
    let autoScrollInterval = null;

    function startAutoScroll() {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
      autoScrollInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % dots.length;
        updateCarousel();
      }, 5000);
    }

    function resetAutoScroll() {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
      startAutoScroll();
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    });

    carousel.addEventListener('mouseleave', () => {
      startAutoScroll();
    });

    // Handle window resize (not needed for fade transition, but keeping for consistency)
    window.addEventListener('resize', () => {
      // No action needed for fade transition
    });

    // Initialize
    updateCarousel();
    startAutoScroll();
  });
})();

// App Carousel functionality
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.app-carousel');
    if (!carousel) return;
    
    const container = carousel.querySelector('.carousel-container');
    const slides = carousel.querySelector('.carousel-slides');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    
    function getSlideWidth() {
      // Get the actual container width (works for both desktop and mobile)
      return container ? container.offsetWidth : 200;
    }
    
    function updateCarousel() {
      const slideWidth = getSlideWidth();
      slides.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
      
      // Update dots
      dots.forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.add('active');
          dot.style.background = 'var(--brand)';
          dot.style.opacity = '1';
        } else {
          dot.classList.remove('active');
          dot.style.background = 'var(--muted)';
          dot.style.opacity = '0.5';
        }
      });
    }
    
    // Add click handlers to dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
        resetAutoScroll();
      });
    });
    
    // Auto-advance carousel every 4 seconds
    let autoScrollInterval = null;
    
    function startAutoScroll() {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
      autoScrollInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % dots.length;
        updateCarousel();
      }, 4000);
    }
    
    function resetAutoScroll() {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
      startAutoScroll();
    }
    
    // Pause on hover (desktop) or touch (mobile)
    carousel.addEventListener('mouseenter', () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    });
    
    carousel.addEventListener('mouseleave', () => {
      startAutoScroll();
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateCarousel();
      }, 250);
    });
    
    // Initialize
    updateCarousel();
    startAutoScroll();
  });
})();

// Initialize header and menus first
loadMenu();
initNavToggle();
initSubmenus();
loadFooter();

