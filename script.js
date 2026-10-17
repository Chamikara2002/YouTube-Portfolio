/**
 * =====================================================================
 * PROJECT: CHAMI G (COMMANDER WMC) - OFFICIAL GAMING PORTFOLIO
 * SCRIPT: script.js
 * DESCRIPTION: Interactive features, animations, video modal, and VIP popup.
 * AUTHOR: Chamikara (CHAMI G)
 * =====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
     1. WEB AUDIO API SYNTHESIZER FOR TACTICAL SFX
     - Provides instant audio feedback without loading external mp3 files.
     =================================================================== */
  let audioContext = null;
  let isSoundEnabled = true;

  const initAudio = () => {
    if (!audioContext) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioContext = new AudioCtxClass();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  };

  /**
   * Play procedural sound effect
   * @param {string} soundType - 'click', 'beep', 'warning', 'confirm'
   */
  const playTacticalSound = (soundType = 'click') => {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const currentTime = audioContext.currentTime;

      if (soundType === 'click') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.08, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.08);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + 0.08);
      } else if (soundType === 'beep') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(450, currentTime);
        oscillator.frequency.setValueAtTime(700, currentTime + 0.06);
        gainNode.gain.setValueAtTime(0.1, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.15);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + 0.15);
      } else if (soundType === 'warning') {
        // High-tech two-tone alert for VIP modal
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(320, currentTime);
        oscillator.frequency.setValueAtTime(480, currentTime + 0.12);
        gainNode.gain.setValueAtTime(0.08, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.28);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + 0.28);
      } else if (soundType === 'confirm') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(520, currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1040, currentTime + 0.14);
        gainNode.gain.setValueAtTime(0.1, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.2);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + 0.2);
      }
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  };

  // Sound HUD Toggle Button listener
  const hudSoundToggle = document.getElementById('hudSoundToggle');
  const soundIcon = document.getElementById('soundIcon');
  if (hudSoundToggle) {
    hudSoundToggle.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled) {
        hudSoundToggle.classList.remove('muted');
        if (soundIcon) soundIcon.className = 'fa-solid fa-volume-high';
        hudSoundToggle.querySelector('.hud-sound-label').textContent = 'SFX: ON';
        playTacticalSound('confirm');
      } else {
        hudSoundToggle.classList.add('muted');
        if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark';
        hudSoundToggle.querySelector('.hud-sound-label').textContent = 'SFX: OFF';
      }
    });
  }

  /* ===================================================================
     2. VIP ACCESS AUTHENTICATE MODAL ("UNDER DEVELOPING")
     - Triggered when user clicks "AUTHENTICATE VIP ACCESS"
     - Displays "Under Developing" modal with cyber animations
     =================================================================== */
  const vipModal = document.getElementById('vipDevelopingModal');
  const vipForm = document.getElementById('vipAuthForm');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalAcknowledgeBtn = document.getElementById('modalAcknowledgeBtn');

  const openVipModal = () => {
    if (!vipModal) return;
    initAudio();
    playTacticalSound('warning');
    vipModal.classList.add('active');
    vipModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeVipModal = () => {
    if (!vipModal) return;
    playTacticalSound('click');
    vipModal.classList.remove('active');
    vipModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (vipForm) {
    vipForm.addEventListener('submit', (e) => {
      e.preventDefault();
      openVipModal();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeVipModal);
  }

  if (modalAcknowledgeBtn) {
    modalAcknowledgeBtn.addEventListener('click', () => {
      playTacticalSound('confirm');
      closeVipModal();
    });
  }

  if (vipModal) {
    vipModal.addEventListener('click', (e) => {
      if (e.target === vipModal) {
        closeVipModal();
      }
    });
  }

  /* ===================================================================
     3. INTERACTIVE VIDEO PLAYER MODAL
     - Embeds YouTube player dynamically
     - Configured for featured video: JyKowdYaUu0 (Rust Live Stream)
     =================================================================== */
  const videoModal = document.getElementById('videoModal');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoFrameContainer = document.getElementById('videoFrameContainer');
  const videoModalCloseBtn = document.getElementById('videoModalCloseBtn');
  const playFeaturedBtn = document.getElementById('playFeaturedBtn');
  const playFeaturedModalTrigger = document.getElementById('playFeaturedModalTrigger');

  /**
   * Open Video Modal with specified YouTube Video ID
   * @param {string} videoId - YouTube Video ID (e.g. 'JyKowdYaUu0')
   * @param {string} videoTitle - Video Title string
   */
  const openVideoModal = (videoId = 'JyKowdYaUu0', videoTitle = 'RUST ECA LIVE GAMEPLAY // SURVIVAL RAID - CHAMI G') => {
    if (!videoModal || !videoFrameContainer) return;
    playTacticalSound('beep');

    if (videoModalTitle) {
      videoModalTitle.textContent = videoTitle;
    }

    // Dynamic iframe embed with autoplay and high performance settings
    videoFrameContainer.innerHTML = `
      <iframe 
        src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
        title="${videoTitle}" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    `;

    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    if (!videoModal) return;
    playTacticalSound('click');
    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    if (videoFrameContainer) {
      videoFrameContainer.innerHTML = ''; // Stops playback immediately
    }
    document.body.style.overflow = '';
  };

  // Featured Rust Video Click handlers
  if (playFeaturedBtn) {
    playFeaturedBtn.addEventListener('click', () => {
      const vidId = playFeaturedBtn.getAttribute('data-video-id') || 'JyKowdYaUu0';
      const vidTitle = playFeaturedBtn.getAttribute('data-video-title') || 'RUST ECA LIVE GAMEPLAY // SURVIVAL RAID - CHAMI G';
      openVideoModal(vidId, vidTitle);
    });
  }

  if (playFeaturedModalTrigger) {
    playFeaturedModalTrigger.addEventListener('click', () => {
      openVideoModal('JyKowdYaUu0', 'RUST ECA LIVE GAMEPLAY // SURVIVAL RAID - CHAMI G');
    });
  }

  // Supporting Game Cards play buttons
  const miniPlayBtns = document.querySelectorAll('.mini-play-btn');
  miniPlayBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const vidId = btn.getAttribute('data-video-id') || 'JyKowdYaUu0';
      const vidTitle = btn.getAttribute('data-video-title') || 'Official CHAMI G Gameplay';
      openVideoModal(vidId, vidTitle);
    });
  });

  if (videoModalCloseBtn) {
    videoModalCloseBtn.addEventListener('click', closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  // Global Escape key listener to close active modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (vipModal && vipModal.classList.contains('active')) closeVipModal();
      if (videoModal && videoModal.classList.contains('active')) closeVideoModal();
    }
  });

  /* ===================================================================
     4. 3D CARD INTERACTIVE TILT ANIMATION
     - Smooth mousemove perspective rotation on all [data-tilt] elements
     =================================================================== */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((mouseY - centerY) / centerY) * -7;
      const rotateY = ((mouseX - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

    // Hover sound on buttons inside cards
    const cardButtons = card.querySelectorAll('a, button');
    cardButtons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => playTacticalSound('click'));
    });
  });

  /* ===================================================================
     5. STAT NUMBER COUNTER ANIMATION
     - Counts up smoothly when scrolled into viewport via IntersectionObserver
     =================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasCountersAnimated = false;

  const runStatCounters = () => {
    statNumbers.forEach((counter) => {
      const targetValue = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const suffix = counter.getAttribute('data-suffix') || '';
      const durationMs = 2000;
      const stepIntervalMs = 25;
      const totalSteps = durationMs / stepIntervalMs;
      const stepIncrement = targetValue / totalSteps;
      let currentDisplay = 0;

      const counterInterval = setInterval(() => {
        currentDisplay += stepIncrement;
        if (currentDisplay >= targetValue) {
          counter.textContent = targetValue + suffix;
          clearInterval(counterInterval);
        } else {
          counter.textContent = Math.floor(currentDisplay) + suffix;
        }
      }, stepIntervalMs);
    });
  };

  const bioSection = document.getElementById('tactical-bio');
  if (bioSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasCountersAnimated) {
          hasCountersAnimated = true;
          runStatCounters();
        }
      });
    }, { threshold: 0.25 });
    statsObserver.observe(bioSection);
  }

  /* ===================================================================
     6. LIVE HUD REAL-TIME CLOCK
     - Formats live UTC/GMT tactical timestamp every second
     =================================================================== */
  const liveClockElement = document.getElementById('liveClock');
  const updateTacticalClock = () => {
    if (!liveClockElement) return;
    const now = new Date();
    const padNumber = (n) => String(n).padStart(2, '0');
    const hours = padNumber(now.getUTCHours());
    const minutes = padNumber(now.getUTCMinutes());
    const seconds = padNumber(now.getUTCSeconds());
    liveClockElement.textContent = `LIVE HUD: ${hours}:${minutes}:${seconds} UTC [LK BATTLENET]`;
  };
  setInterval(updateTacticalClock, 1000);
  updateTacticalClock();

  // Footer Dynamic Year
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  /* ===================================================================
     7. MOBILE NAVIGATION MENU TOGGLE
     =================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      playTacticalSound('click');
      navMenu.classList.toggle('mobile-open');
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  /* ===================================================================
     8. AMBIENT CYBER PARTICLE CANVAS
     - Lightweight canvas rendering floating cyber sparks and connecting links
     =================================================================== */
  const ambientCanvas = document.getElementById('ambientCanvas');
  if (ambientCanvas) {
    const ctx = ambientCanvas.getContext('2d');
    let canvasWidth = (ambientCanvas.width = window.innerWidth);
    let canvasHeight = (ambientCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      canvasWidth = ambientCanvas.width = window.innerWidth;
      canvasHeight = ambientCanvas.height = window.innerHeight;
    });

    const particlesArray = [];
    const maxParticles = Math.min(Math.floor(canvasWidth / 30), 45);
    const particleColors = ['#00ff66', '#00f0ff', '#ff0077', '#8b5cf6'];

    for (let i = 0; i < maxParticles; i++) {
      particlesArray.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    let pointerX = -1000;
    let pointerY = -1000;
    window.addEventListener('mousemove', (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
    });

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      particlesArray.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport edges
        if (p.x < 0) p.x = canvasWidth;
        if (p.x > canvasWidth) p.x = 0;
        if (p.y < 0) p.y = canvasHeight;
        if (p.y > canvasHeight) p.y = 0;

        // Subtle repulsion from cursor
        const deltaX = p.x - pointerX;
        const deltaY = p.y - pointerY;
        const distanceToCursor = Math.hypot(deltaX, deltaY);
        if (distanceToCursor < 100) {
          const force = (100 - distanceToCursor) / 100;
          p.x += (deltaX / distanceToCursor) * force * 1.5;
          p.y += (deltaY / distanceToCursor) * force * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();

        // Connect nearby particles with subtle cyber links
        for (let j = index + 1; j < particlesArray.length; j++) {
          const p2 = particlesArray[j];
          const distBetween = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distBetween < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - distBetween / 110) * 0.12;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(renderParticles);
    };

    renderParticles();
  }
});
