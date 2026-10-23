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

    // Duración de la transición igualada con la de inicio (~5.5 segundos para disfrutar de la ambientación)
    setTimeout(() => {
      executeViewSwitch(viewName);
      setTimeout(() => {
        curtain.classList.remove('active');
      }, 700);
    }, 5500);
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

  // Animación terrorífica temática: lluvia de arañas, murciélagos y brujas
  spawnSpookySwarm(viewName);

  // Scroll arriba
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Guardar hash en URL
  history.replaceState(null, null, `#${viewName}`);
}

// 3. En lugar de confeti convencional: Lluvia / Enjambre de Arañas, Brujitas, Murciélagos y Calaveras
function spawnSpookySwarm(day) {
  const swarmSymbols = ['🕷️', '🦇', '🧙‍♀️', '💀', '🕸️', '👻'];
  const count = 30;

  for (let i = 0; i < count; i++) {
    const creature = document.createElement('div');
    creature.className = 'falling-creature';
    creature.innerText = swarmSymbols[Math.floor(Math.random() * swarmSymbols.length)];
    
    const startX = Math.random() * 95; // 0 - 95vw
    const duration = 2.2 + Math.random() * 2.5; // seg
    const delay = Math.random() * 0.8; // seg
    const size = 1.3 + Math.random() * 1.5; // rem

    creature.style.left = `${startX}vw`;
    creature.style.top = '-50px';
    creature.style.fontSize = `${size}rem`;
    creature.style.animationDuration = `${duration}s`;
    creature.style.animationDelay = `${delay}s`;

    document.body.appendChild(creature);

    // Auto-eliminar tras la caída
    setTimeout(() => {
      creature.remove();
    }, (duration + delay + 0.5) * 1000);
  }
}

// 4. Filtro con Desplegables en tiempo real (Docente y Curso)
function applyDropdownFilter(day) {
  const selectDocente = document.getElementById(`select-docente-${day}`);
  const selectCurso = document.getElementById(`select-curso-${day}`);

  const docenteVal = selectDocente ? selectDocente.value.trim().toLowerCase() : '';
  const cursoVal = selectCurso ? selectCurso.value.trim().toLowerCase() : '';

  const table = document.getElementById(`table-schedule-${day}`);
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const rowText = row.innerText.toLowerCase();
    const cards = row.querySelectorAll('.visit-card, .recreo-banner-card');

    let matchDocente = (docenteVal === '');
    let matchCurso = (cursoVal === '');

    // Comprobamos correspondencia
    if (docenteVal !== '' && rowText.includes(docenteVal)) {
      matchDocente = true;
    }
    if (cursoVal !== '' && rowText.includes(cursoVal)) {
      matchCurso = true;
    }

    // Resaltar celdas específicas
    cards.forEach(card => {
      const cardText = card.innerText.toLowerCase();
      const cardMatchDoc = (docenteVal !== '' && cardText.includes(docenteVal));
      const cardMatchCur = (cursoVal !== '' && cardText.includes(cursoVal));

      if ((docenteVal !== '' || cursoVal !== '') && (cardMatchDoc || cardMatchCur)) {
        card.classList.add('highlight-matched');
      } else {
        card.classList.remove('highlight-matched');
      }
    });

    if (matchDocente && matchCurso) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function resetDropdownFilter(day) {
  const selectDocente = document.getElementById(`select-docente-${day}`);
  const selectCurso = document.getElementById(`select-curso-${day}`);

  if (selectDocente) selectDocente.value = '';
  if (selectCurso) selectCurso.value = '';

  applyDropdownFilter(day);
}

// 5. Animación terrorífica inicial con mayor duración y tensión (4 segundos)
window.addEventListener('DOMContentLoaded', () => {
  initAmbientParticles();

  const overlay = document.getElementById('spooky-intro-overlay');

  // Mantenemos la pantalla oscura de inframundo durante 6.2 segundos para poder leer bien todos los mensajes
  setTimeout(() => {
    if (overlay) {
      overlay.classList.add('fade-out');
    }

    // Lluvia de arañas y murciélagos al descubrir la web
    spawnSpookySwarm('home');
  }, 6200);

  // Detectar hash
  const hash = window.location.hash.replace('#', '');
  if (hash === 'jueves' || hash === 'viernes') {
    executeViewSwitch(hash);
  } else {
    executeViewSwitch('home');
  }
});
