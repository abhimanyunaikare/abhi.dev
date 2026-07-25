// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Rotating hero word ----------
const words = ['the web.', 'mobile.', 'growth.', 'ideas — fast.'];
let wIndex = 0;
const rotatingEl = document.getElementById('rotatingWord');
setInterval(() => {
  wIndex = (wIndex + 1) % words.length;
  rotatingEl.style.opacity = 0;
  setTimeout(() => {
    rotatingEl.textContent = words[wIndex];
    rotatingEl.style.opacity = 1;
  }, 250);
}, 2600);
rotatingEl.style.transition = 'opacity 0.25s ease';

// ---------- Typed "vibe coding" terminal ----------
const snippet = `// idea: "landing page that converts"

function buildProduct(idea) {
  const plan = discover(idea);
  const ui   = design(plan);
  return ship(ui, { seo: true, fast: true });
}

buildProduct("your next project");
> Deployed to production ✓`;

const codeEl = document.getElementById('typedCode');
let charIndex = 0;
function typeCode() {
  if (charIndex <= snippet.length) {
    codeEl.textContent = snippet.slice(0, charIndex);
    charIndex += 2;
    setTimeout(typeCode, 18);
  }
}
// Start typing once hero is in view
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      typeCode();
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
heroObserver.observe(document.getElementById('top'));

// ---------- Scroll reveals ----------
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
}

// ---------- Interactive process timeline ----------
// The connector line fills in sync with scroll, and each step "lights up"
// as it enters view, rather than every step just being visible at once.
const processTimeline = document.getElementById('processTimeline');
const processLineFill = document.getElementById('processLineFill');
const processSteps = document.querySelectorAll('.process-step');

if (processTimeline && window.gsap && window.ScrollTrigger) {
  if (processLineFill) {
    gsap.to(processLineFill, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: processTimeline,
        start: 'top 75%',
        end: 'bottom 65%',
        scrub: 0.4,
      },
    });
  }

  processSteps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 78%',
      end: 'bottom 30%',
      onEnter: () => step.classList.add('step-active'),
      onEnterBack: () => step.classList.add('step-active'),
      onLeaveBack: () => step.classList.remove('step-active'),
    });
  });
} else if (processSteps.length) {
  // No GSAP available — just show every step as active.
  processSteps.forEach((step) => step.classList.add('step-active'));
  if (processLineFill) processLineFill.style.height = '100%';
}

// ---------- Magnetic buttons ----------
document.querySelectorAll('.magnetic-btn').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
  });
});

// ---------- Custom cursor (desktop only) ----------
const cursorDot = document.getElementById('cursorDot');
if (cursorDot && window.matchMedia('(pointer: fine)').matches) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  function animateCursor() {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    cursorDot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .service-card').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorDot.style.transform += ' scale(1.8)');
    el.addEventListener('mouseleave', () => {});
  });
} else if (cursorDot) {
  cursorDot.style.display = 'none';
}

// ---------- Contact form ----------
// Wire this up to Formspree (free tier) or a Vercel serverless API route.
// Formspree quick-start: replace YOUR_FORM_ID below after creating a free form at https://formspree.io
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Sending...';
  const data = new FormData(form);

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      status.textContent = "Thanks — I'll get back to you within a business day.";
      form.reset();
    } else {
      status.textContent = 'Something went wrong. Please email me directly instead.';
    }
  } catch (err) {
    status.textContent = 'Network error — please email me directly instead.';
  }
});
