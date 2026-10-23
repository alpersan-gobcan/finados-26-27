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

    // Duración de la animación ajustada a exactamente 4 segundos
    setTimeout(() => {
      executeViewSwitch(viewName);
      setTimeout(() => {
        curtain.classList.remove('active');
        // Lanzar lluvia de criaturas justo al descubrirse la página
        spawnSpookySwarm(viewName);
      }, 500);
    }, 4000);
  } else {
    executeViewSwitch(viewName);
    spawnSpookySwarm(viewName);
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

  // Scroll arriba
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Guardar hash en URL
  history.replaceState(null, null, `#${viewName}`);
}

// 3. Lluvia de Arañas, Brujas, Murciélagos y Calaveras (garantizada por Canvas Confetti Emoji Shapes)
function spawnSpookySwarm(day) {
  const spookyEmojis = ['🕷️', '🦇', '🧙‍♀️', '💀', '🎃', '👻'];

  if (typeof confetti === 'function') {
    try {
      const spookyShapes = spookyEmojis.map(emoji => confetti.shapeFromText({ text: emoji, scalar: 3.2 }));
      
      // Primera ráfaga desde arriba centro-izquierda
      confetti({
        shapes: spookyShapes,
        scalar: 3.2,
        particleCount: 25,
        spread: 90,
        origin: { y: -0.1, x: 0.35 },
        startVelocity: 15,
        gravity: 0.8,
        ticks: 250,
        disableForReducedMotion: true
      });

      // Segunda ráfaga desde arriba centro-derecha para cubrir toda la pantalla
      setTimeout(() => {
        confetti({
          shapes: spookyShapes,
          scalar: 3.2,
          particleCount: 25,
          spread: 90,
          origin: { y: -0.1, x: 0.65 },
          startVelocity: 15,
          gravity: 0.8,
          ticks: 250,
          disableForReducedMotion: true
        });
      }, 150);
      return;
    } catch (e) {
      console.warn("Fallo confetti text shape, usando fallback DOM", e);
    }
  }

  // Fallback DOM
  const count = 35;
  for (let i = 0; i < count; i++) {
    const creature = document.createElement('div');
    creature.className = 'falling-creature';
    creature.innerText = spookyEmojis[Math.floor(Math.random() * spookyEmojis.length)];
    
    const startX = Math.random() * 95;
    const duration = 2.4 + Math.random() * 2;
    const delay = Math.random() * 0.8;
    const size = 1.6 + Math.random() * 1.5;

    creature.style.left = `${startX}vw`;
    creature.style.top = '-60px';
    creature.style.fontSize = `${size}rem`;
    creature.style.animationDuration = `${duration}s`;
    creature.style.animationDelay = `${delay}s`;

    document.body.appendChild(creature);

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

  // Mantenemos la pantalla oscura de inframundo durante 4 segundos exactos
  setTimeout(() => {
    if (overlay) {
      overlay.classList.add('fade-out');
    }

    // Lluvia de arañas y murciélagos al descubrir la web
    spawnSpookySwarm('home');
  }, 4000);

  // Detectar hash
  const hash = window.location.hash.replace('#', '');
  if (hash === 'jueves' || hash === 'viernes') {
    executeViewSwitch(hash);
  } else {
    executeViewSwitch('home');
  }
});
