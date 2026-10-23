/* ==========================================================================
   INTERACCIÓN Y DINAMISMO: FINADOS & HALLOWEEN IES SANTA LUCÍA
   ========================================================================== */

// 1. Partículas flotantes temáticas
const ICONS = ['🌰', '🧙‍♀️', '🎃', '🦇', '🕯️', '✨', '🍂', '🍁', '💀', '🕷️'];

function initAmbientParticles() {
  const container = document.getElementById('ambient-particles');
  if (!container) return;

  const count = 20;
  for (let i = 0; i < count; i++) {
    createParticle(container, i * (18 / count));
  }
}

function createParticle(container, delaySeconds) {
  const el = document.createElement('div');
  el.className = 'floating-icon';
  el.innerText = ICONS[Math.floor(Math.random() * ICONS.length)];
  
  const leftPos = Math.random() * 96;
  const duration = 14 + Math.random() * 12;
  const size = 1.1 + Math.random() * 1.1;

  el.style.left = `${leftPos}vw`;
  el.style.animationDuration = `${duration}s`;
  el.style.animationDelay = `${delaySeconds}s`;
  el.style.fontSize = `${size}rem`;

  container.appendChild(el);
}

// 2. Control de cambio de vistas con cortina de transición siniestra (más tiempo y terrorífica)
function switchView(viewName, withTransition = false) {
  const curtain = document.getElementById('transition-curtain');
  const curtainText = document.getElementById('curtain-text');

  if (withTransition && curtain) {
    if (viewName === 'jueves') {
      curtainText.innerText = "¡CONJURANDO EL CUADRANTE DEL JUEVES! 🧙‍♀️";
    } else if (viewName === 'viernes') {
      curtainText.innerText = "¡ABRIENDO LAS CRIPTAS DEL VIERNES! ⚰️";
    } else {
      curtainText.innerText = "REGRESANDO DE LAS SOMBRAS... 🏚️";
    }

    curtain.classList.add('active');

    // Duración de transición aumentada a 1.2 segundos para que se sienta el suspenso
    setTimeout(() => {
      executeViewSwitch(viewName);
      setTimeout(() => {
        curtain.classList.remove('active');
      }, 600);
    }, 1100);
  } else {
    executeViewSwitch(viewName);
  }
}

function executeViewSwitch(viewName) {
  const views = {
    'home': document.getElementById('view-home'),
    'jueves': document.getElementById('view-jueves'),
    'viernes': document.getElementById('view-viernes')
  };

  // Ocultar todas las vistas
  Object.keys(views).forEach(key => {
    if (views[key]) {
      views[key].style.display = 'none';
      views[key].classList.remove('active-view');
    }
  });

  // Mostrar vista elegida
  if (views[viewName]) {
    views[viewName].style.display = 'block';
    views[viewName].classList.add('active-view');
  }

  // Animación de confeti temático
  triggerSpookyPoof(viewName);

  // Scroll arriba
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Guardar hash en URL
  history.replaceState(null, null, `#${viewName}`);
}

// 3. Efectos interactivos al pulsar botones de días
function triggerSpookyPoof(day) {
  if (typeof confetti === 'function') {
    let colors = ['#dc2626', '#78350f', '#ea580c', '#000000'];
    if (day === 'jueves') {
      colors = ['#1d4ed8', '#3b82f6', '#ea580c', '#dc2626'];
    } else if (day === 'viernes') {
      colors = ['#ea580c', '#dc2626', '#78350f', '#15803d'];
    }

    confetti({
      particleCount: 40,
      spread: 75,
      origin: { y: 0.25 },
      colors: colors,
      disableForReducedMotion: true
    });
  }
}

// 4. Filtro de búsqueda rápida en tiempo real para encontrar profesor o grupo
function filterContent(day) {
  const input = document.getElementById(`filter-${day}`);
  if (!input) return;

  const query = input.value.trim().toLowerCase();
  const table = document.getElementById(`table-schedule-${day}`);
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const rowText = row.innerText.toLowerCase();
    const cards = row.querySelectorAll('.visit-card, .recreo-banner-card, .sub-item, .activity-card');
    let hasMatch = false;

    cards.forEach(card => {
      const cardText = card.innerText.toLowerCase();
      if (query !== '' && cardText.includes(query)) {
        card.classList.add('highlight-matched');
        hasMatch = true;
      } else {
        card.classList.remove('highlight-matched');
      }
    });

    if (query === '' || rowText.includes(query) || hasMatch) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function clearFilter(day) {
  const input = document.getElementById(`filter-${day}`);
  if (input) {
    input.value = '';
    filterContent(day);
  }
}

// 5. Animación terrorífica inicial con mayor duración y tensión (4 segundos)
window.addEventListener('DOMContentLoaded', () => {
  initAmbientParticles();

  const overlay = document.getElementById('spooky-intro-overlay');

  // Mantenemos la pantalla oscura de inframundo durante 3.8 segundos para dar impacto
  setTimeout(() => {
    if (overlay) {
      overlay.classList.add('fade-out');
    }

    // Efecto de bienvenida al descubrir la web
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 35,
        spread: 65,
        origin: { y: 0.2 },
        colors: ['#ea580c', '#b45309', '#dc2626']
      });
    }
  }, 3800);

  // Detectar hash
  const hash = window.location.hash.replace('#', '');
  if (hash === 'jueves' || hash === 'viernes') {
    executeViewSwitch(hash);
  } else {
    executeViewSwitch('home');
  }
});
