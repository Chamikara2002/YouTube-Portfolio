/**
 * =====================================================================
 * PROJECT: CHAMI G (COMMANDER WMC) - OFFICIAL GAMING PORTFOLIO
 * SCRIPT: script.js
 * DESCRIPTION: Interactive features, Web Audio SFX, 10-minute card rotation
 *              loop, video modal player, and responsive UI controls.
 * AUTHOR: Chamikara (CHAMI G)
 * =====================================================================
 */

// Instant Scroll-to-Top on Page Refresh & Reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  // Ensure starting position is top
  window.scrollTo(0, 0);

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
   * @param {string} soundType - 'click', 'beep', 'warning', 'confirm', 'swap'
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
      } else if (soundType === 'swap') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(600, currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, currentTime + 0.12);
        gainNode.gain.setValueAtTime(0.09, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.18);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + 0.18);
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
     - Closes and destroys iframe when dismissed to stop audio immediately
     =================================================================== */
  const videoModal = document.getElementById('videoModal');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoFrameContainer = document.getElementById('videoFrameContainer');
  const videoModalCloseBtn = document.getElementById('videoModalCloseBtn');

  /**
   * Open Video Modal with specified YouTube Video ID
   * @param {string} videoId - YouTube Video ID (e.g. 'JyKowdYaUu0')
   * @param {string} videoTitle - Video Title string
   */
  const openVideoModal = (videoId, videoTitle) => {
    if (!videoModal || !videoFrameContainer) return;
    initAudio();
    playTacticalSound('beep');

    if (videoModalTitle) {
      videoModalTitle.textContent = videoTitle || 'CHAMI G Tactical Gameplay';
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
     4. GAMEPLAY CATALOG & 10-MINUTE DYNAMIC ROTATION LOOP
     - 1 Big Featured Card + 3 Small Supporting Cards
     - Rotates every 10 minutes (600 seconds) in a continuous loop
     - Podi card eka loku card eka bawanata gihin, loku card eka podi wenawa
     - Interactive countdown timer (MM:SS)
     - Clicking any small card promotes it to Featured immediately and resets timer
     - Prev / Next buttons allow manual rotation
     - Connected directly to user-specified YouTube URLs:
       * RUST: https://www.youtube.com/live/JyKowdYaUu0?si=hOzWV-fPmyzbL53I
       * DEAD BY DAYLIGHT: https://www.youtube.com/live/LDIqd1o4vG8?si=h8V27iSdVjIxbzh7
     =================================================================== */
  const gameplayCatalog = [
    {
      id: 'rust-live',
      title: 'RUST: EPIC BASE RAID & SURVIVAL CLUTCH',
      badge: 'SURVIVAL RAID',
      liveTag: 'RUST OFFICIAL LIVE STREAM',
      videoId: 'JyKowdYaUu0',
      youtubeUrl: 'https://www.youtube.com/live/JyKowdYaUu0?si=hOzWV-fPmyzbL53I',
      thumb: 'assets/rust_featured_yt.jpg',
      webp350: 'assets/rust_featured_yt_350.webp',
      webp700: 'assets/rust_featured_yt_700.webp',
      webp1280: 'assets/rust_featured_yt_1280.webp',
      desc: 'Watch the official Rust live broadcast featuring high-intensity base building, clan raids, tactical defense, and heart-pounding survival clutches with Commander WMC.',
      tags: ['RUST SURVIVAL', 'CLUTCH COMBAT', 'SQUAD RAID'],
      views: 'Thousands Watched Live',
      type: 'Official Live Stream'
    },
    {
      id: 'dbd-live',
      title: 'DEAD BY DAYLIGHT: IMPOSSIBLE ESCAPE',
      badge: 'HORROR SURVIVAL',
      liveTag: 'DBD OFFICIAL LIVE STREAM',
      videoId: 'LDIqd1o4vG8',
      youtubeUrl: 'https://www.youtube.com/live/LDIqd1o4vG8?si=h8V27iSdVjIxbzh7',
      thumb: 'assets/dbd_featured_yt.jpg',
      webp350: 'assets/dbd_featured_yt_350.webp',
      webp700: 'assets/dbd_featured_yt_700.webp',
      webp1280: 'assets/dbd_featured_yt_1280.webp',
      desc: 'Heart-stopping hatch escape and mind games against rank 1 killer. Last survivor standing, dodging bear traps in absolute darkness with Commander WMC.',
      tags: ['DEAD BY DAYLIGHT', 'PRO ESCAPE', 'HORROR CLUTCH'],
      views: '74K Views',
      type: 'Official Live Stream'
    },
    {
      id: 'rust-compound',
      title: 'RUST: CLAN COMPOUND DEFENSE RAID',
      badge: 'CLAN DEFENSE',
      liveTag: 'RAID DEFENSE CLUTCH',
      videoId: 'JyKowdYaUu0',
      youtubeUrl: 'https://www.youtube.com/live/JyKowdYaUu0?si=hOzWV-fPmyzbL53I',
      thumb: 'assets/rust_raid_thumb.jpg',
      webp350: 'assets/rust_raid_thumb_350.webp',
      webp700: 'assets/rust_raid_thumb_700.webp',
      webp1280: 'assets/rust_raid_thumb_1024.webp',
      desc: 'Intense compound defense against rival clan using rocket launchers, C4 defenses, and tactical breach maneuvers under heavy siege.',
      tags: ['RUST RAID', 'BASE DEFENSE', 'C4 SIEGE'],
      views: '89K Views',
      type: 'Clutch Raid'
    },
    {
      id: 'among-us-sabotage',
      title: 'AMONG US: 200 IQ IMPOSTER SABOTAGE',
      badge: 'MIND GAMES',
      liveTag: '200 IQ IMPOSTER PLAY',
      videoId: 'JyKowdYaUu0',
      youtubeUrl: 'https://www.youtube.com/@CHAMI_G',
      thumb: 'assets/among_us_thumb.jpg',
      webp350: 'assets/among_us_thumb_350.webp',
      webp700: 'assets/among_us_thumb_700.webp',
      webp1280: 'assets/among_us_thumb_1024.webp',
      desc: 'Flawless imposter sabotage play convincing everyone in emergency meetings while systematically eliminating crewmates one by one.',
      tags: ['AMONG US', '200 IQ SABOTAGE', 'IMPOSTER WIN'],
      views: '112K Views',
      type: 'Mind Games'
    }
  ];

  let currentFeaturedIndex = 0;
  const ROTATION_SECONDS = 600; // 10 minutes in seconds (600,000 ms)
  let remainingSeconds = ROTATION_SECONDS;
  let rotationIntervalTimer = null;

  const featuredWrapper = document.getElementById('featuredShowcaseWrapper');
  const supportingGrid = document.getElementById('supportingGameplayGrid');
  const countdownDisplay = document.getElementById('rotationTimerCountdown');
  const prevBtn = document.getElementById('prevShowcaseBtn');
  const nextBtn = document.getElementById('nextShowcaseBtn');

  /**
   * Format seconds into MM:SS display
   * @param {number} totalSec 
   * @returns {string} formatted string e.g. "10:00"
   */
  const formatCountdown = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  /**
   * Render both the Big Featured Card and the 3 Small Supporting Cards
   * @param {number} featuredIdx - Index of catalog item to make Featured
   * @param {boolean} animate - Whether to trigger smooth swap fade
   */
  const renderGameplayShowcase = (featuredIdx, animate = true) => {
    if (!featuredWrapper || !supportingGrid) return;

    if (animate) {
      featuredWrapper.classList.add('swapping');
      supportingGrid.style.opacity = '0.35';
    }

    setTimeout(() => {
      const featuredItem = gameplayCatalog[featuredIdx];

      // Build Big Featured Card HTML
      featuredWrapper.innerHTML = `
        <div class="rgb-card featured-gameplay-card" data-tilt>
          <div class="card-inner">
            <div class="showcase-thumb-wrap">
              <picture>
                <source srcset="${featuredItem.webp350} 350w, ${featuredItem.webp700} 700w, ${featuredItem.webp1280} 1280w" sizes="(max-width: 768px) 100vw, 700px" type="image/webp">
                <img src="${featuredItem.thumb}" alt="${featuredItem.title}" class="showcase-img" width="700" height="394" loading="lazy">
              </picture>
              <div class="showcase-overlay">
                <button type="button" class="play-showcase-btn" 
                  data-video-id="${featuredItem.videoId}" 
                  data-video-title="${featuredItem.title}"
                  aria-label="Play ${featuredItem.title}">
                  <i class="fa-solid fa-play"></i>
                </button>
                <div class="video-duration-badge"><i class="fa-solid fa-tower-broadcast"></i> LIVE REPLAY</div>
              </div>
              <div class="showcase-live-chip">
                <span class="live-dot-red"></span> ${featuredItem.liveTag}
              </div>
            </div>

            <div class="showcase-info">
              <div class="showcase-tags">
                ${featuredItem.tags.map(t => `<span class="pill-chip"><i class="fa-solid fa-crosshairs"></i> ${t}</span>`).join('')}
              </div>
              <h3 class="showcase-title">${featuredItem.title}</h3>
              <p class="showcase-desc">${featuredItem.desc}</p>
              <div class="showcase-footer">
                <div class="showcase-meta">
                  <span><i class="fa-solid fa-eye"></i> ${featuredItem.views}</span>
                  <span><i class="fa-solid fa-calendar-days"></i> ${featuredItem.type}</span>
                </div>
                <div class="showcase-btns">
                  <button type="button" class="btn btn-secondary-cyber featured-play-trigger"
                    data-video-id="${featuredItem.videoId}"
                    data-video-title="${featuredItem.title}">
                    <i class="fa-solid fa-play"></i> Play On Site
                  </button>
                  <a href="${featuredItem.youtubeUrl}" target="_blank" rel="noopener noreferrer"
                    class="btn btn-primary-rgb">
                    <i class="fa-brands fa-youtube"></i> Open on YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Build 3 Supporting Small Cards (all catalog items except the currently featured one)
      const supportingItems = gameplayCatalog
        .map((item, originalIndex) => ({ ...item, catalogIndex: originalIndex }))
        .filter((_, idx) => idx !== featuredIdx);

      supportingGrid.innerHTML = supportingItems.map(item => `
        <div class="rgb-card game-card" data-tilt data-catalog-index="${item.catalogIndex}" title="Click to promote to Featured Showcase">
          <div class="card-inner">
            <div class="game-thumb-container">
              <picture>
                <source srcset="${item.webp350} 350w, ${item.webp700} 700w" sizes="(max-width: 768px) 100vw, 350px" type="image/webp">
                <img src="${item.thumb}" alt="${item.title}" class="game-thumb" width="350" height="197" loading="lazy">
              </picture>
              <button type="button" class="mini-play-btn" 
                data-video-id="${item.videoId}"
                data-video-title="${item.title}" 
                aria-label="Play ${item.title}">
                <i class="fa-solid fa-play"></i>
              </button>
              <span class="game-badge">${item.badge}</span>
            </div>
            <div class="game-card-content">
              <h4 class="game-card-title">${item.title}</h4>
              <p class="game-card-desc">${item.desc}</p>
              <div class="game-card-meta">
                <span><i class="fa-solid fa-eye"></i> ${item.views}</span>
                <a href="${item.youtubeUrl}" target="_blank" rel="noopener noreferrer" class="mini-link">
                  Watch <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      `).join('');

      // Attach event listeners to newly rendered featured card
      const featuredPlayBtn = featuredWrapper.querySelector('.play-showcase-btn');
      const featuredTrigger = featuredWrapper.querySelector('.featured-play-trigger');
      if (featuredPlayBtn) {
        featuredPlayBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openVideoModal(featuredItem.videoId, featuredItem.title);
        });
      }
      if (featuredTrigger) {
        featuredTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          openVideoModal(featuredItem.videoId, featuredItem.title);
        });
      }

      // Attach click events to supporting small cards
      const smallCards = supportingGrid.querySelectorAll('.game-card');
      smallCards.forEach(card => {
        const catIdx = parseInt(card.getAttribute('data-catalog-index'), 10);

        // Clicking the card promotes it to the Big Featured position
        card.addEventListener('click', (e) => {
          // If clicked directly on the watch link or mini play button, handle accordingly
          if (e.target.closest('.mini-link')) return; // Allow natural link navigation
          if (e.target.closest('.mini-play-btn')) {
            e.stopPropagation();
            const btn = e.target.closest('.mini-play-btn');
            openVideoModal(btn.getAttribute('data-video-id'), btn.getAttribute('data-video-title'));
            return;
          }
          playTacticalSound('swap');
          promoteCardToFeatured(catIdx);
        });
      });

      // Re-initialize 3D tilt on all rendered cards
      initCardTilt();

      // Finish smooth swap animation
      featuredWrapper.classList.remove('swapping');
      supportingGrid.style.opacity = '1';
    }, animate ? 200 : 0);
  };

  /**
   * Promotes a specific catalog item to the Big Featured card spot
   * and resets the 10-minute rotation countdown.
   * @param {number} newFeaturedIndex 
   */
  const promoteCardToFeatured = (newFeaturedIndex) => {
    currentFeaturedIndex = newFeaturedIndex;
    remainingSeconds = ROTATION_SECONDS;
    if (countdownDisplay) {
      countdownDisplay.textContent = formatCountdown(remainingSeconds);
    }
    renderGameplayShowcase(currentFeaturedIndex, true);
  };

  /**
   * 10-Minute Timer Interval Loop
   * - Decrements every second
   * - When remainingSeconds <= 0, rotates to the next card in sequence (0 -> 1 -> 2 -> 3 -> 0)
   */
  const startRotationTimer = () => {
    if (rotationIntervalTimer) clearInterval(rotationIntervalTimer);

    if (countdownDisplay) {
      countdownDisplay.textContent = formatCountdown(remainingSeconds);
    }

    rotationIntervalTimer = setInterval(() => {
      remainingSeconds--;

      if (countdownDisplay) {
        countdownDisplay.textContent = formatCountdown(remainingSeconds);
      }

      // 10 minutes elapsed: rotate to next card in the continuous loop
      if (remainingSeconds <= 0) {
        remainingSeconds = ROTATION_SECONDS;
        currentFeaturedIndex = (currentFeaturedIndex + 1) % gameplayCatalog.length;
        playTacticalSound('swap');
        renderGameplayShowcase(currentFeaturedIndex, true);
      }
    }, 1000);
  };

  // Previous button click listener
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      playTacticalSound('click');
      let prevIdx = currentFeaturedIndex - 1;
      if (prevIdx < 0) prevIdx = gameplayCatalog.length - 1;
      promoteCardToFeatured(prevIdx);
    });
  }

  // Next button click listener
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      playTacticalSound('click');
      const nextIdx = (currentFeaturedIndex + 1) % gameplayCatalog.length;
      promoteCardToFeatured(nextIdx);
    });
  }

  // Initial showcase render & start 10-min loop
  renderGameplayShowcase(currentFeaturedIndex, false);
  startRotationTimer();

  /* ===================================================================
     5. 3D CARD INTERACTIVE TILT ANIMATION
     - Smooth mousemove perspective rotation on all [data-tilt] elements
     =================================================================== */
  function initCardTilt() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach((card) => {
      // Prevent double binding
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = 'true';

      let rect = null;
      let rafId = null;

      card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
      });

      card.addEventListener('mousemove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        if (rafId) return;

        rafId = requestAnimationFrame(() => {
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((mouseY - centerY) / centerY) * -6;
          const rotateY = ((mouseX - centerX) / centerX) * 6;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;
          rafId = null;
        });
      });

      card.addEventListener('mouseleave', () => {
        rect = null;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        card.style.transform = '';
      });

      // Hover sound on buttons inside cards
      const cardButtons = card.querySelectorAll('a, button');
      cardButtons.forEach((btn) => {
        btn.addEventListener('mouseenter', () => playTacticalSound('click'));
      });
    });
  }

  initCardTilt();

  /* ===================================================================
     6. STAT NUMBER COUNTER ANIMATION
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
     7. LIVE HUD REAL-TIME CLOCK
     - Formats live UTC tactical timestamp every second
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

  // Dynamic Footer Current Year
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  /* ===================================================================
     8. MOBILE NAVIGATION MENU TOGGLE
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
     9. AMBIENT CYBER PARTICLE CANVAS
     - Lightweight canvas rendering floating cyber sparks and connecting links
     =================================================================== */
  const ambientCanvas = document.getElementById('ambientCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lightweight performance-first particles: disabled on small mobile screens or reduced-motion
  if (ambientCanvas && !prefersReducedMotion && window.innerWidth >= 768) {
    const ctx = ambientCanvas.getContext('2d');
    let canvasWidth = (ambientCanvas.width = window.innerWidth);
    let canvasHeight = (ambientCanvas.height = window.innerHeight);

    let resizeTimeout = null;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        canvasWidth = ambientCanvas.width = window.innerWidth;
        canvasHeight = ambientCanvas.height = window.innerHeight;
      }, 150);
    });

    const particlesArray = [];
    const maxParticles = Math.min(Math.floor(canvasWidth / 55), 25);
    const particleColors = ['#00ff66', '#00f0ff', '#ff0077', '#8b5cf6'];

    for (let i = 0; i < maxParticles; i++) {
      particlesArray.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: Math.random() * 0.4 + 0.2
      });
    }

    let isDocumentVisible = true;
    document.addEventListener('visibilitychange', () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible) requestAnimationFrame(renderParticles);
    });

    const renderParticles = () => {
      if (!isDocumentVisible) return;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvasWidth;
        if (p.x > canvasWidth) p.x = 0;
        if (p.y < 0) p.y = canvasHeight;
        if (p.y > canvasHeight) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        for (let j = i + 1; j < particlesArray.length; j++) {
          const p2 = particlesArray[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          if (Math.abs(dx) < 90 && Math.abs(dy) < 90) {
            const dist = Math.hypot(dx, dy);
            if (dist < 90) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - dist / 90) * 0.12;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(renderParticles);
    };

    renderParticles();
  }
});
