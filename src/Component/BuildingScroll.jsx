
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./BuildingScroll.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
// Split text into words for word-by-word animation (gallery)
const splitTextWords = (text) =>
  text.split(" ").map((word, i) => (
    <span key={i} className="word" style={{ display: "inline-block", marginRight: "0.25em" }}>
      {word}
    </span>
  ));
// Split text into letters but keep each word together (no mid-word wrapping)
const splitTextLetters = (text) => {
  const words = text.split(" ");
  return words.map((word, wi) => (
    <React.Fragment key={wi}>
      <span className="nowrap-word">
        {word.split("").map((letter, li) => (
          <span key={`${wi}-${li}`} className="letter" style={{ display: "inline-block" }}>
            {letter}
          </span>
        ))}
      </span>
      {wi < words.length - 1 ? " " : null}
    </React.Fragment>
  ));
};
const BuildingScroll = ({ setShowNav, showSingleImage, setShowSingleImage }) => {
  // Store the auto-scroll stop position
  const autoScrollStopYRef = useRef(null);
  // Make the ref globally accessible for Nav.jsx
  window.autoScrollStopYRef = autoScrollStopYRef;
  const [autoScrollComplete, setAutoScrollComplete] = useState(false);

  // --- SCROLL LOCK LOGIC ---
  useEffect(() => {
    // Set bottom scroll limit to below card_1 (add extra space)
    let maxY = null;
    const card1 = document.querySelector('.card_1');
    if (card1) {
      const cardRect = card1.getBoundingClientRect();
      const cardBottom = cardRect.bottom + window.scrollY;
  // Add 390px extra space below card_1
  maxY = cardBottom - window.innerHeight + 390;
    }
    if (!autoScrollComplete || autoScrollStopYRef.current == null) return;
    const minY = autoScrollStopYRef.current;
    let ticking = false;
    function lockScroll() {
      if (maxY !== null && window.scrollY > maxY) {
        window.scrollTo(0, maxY);
      }
      if (window.scrollY < minY) {
        window.scrollTo(0, minY);
      }
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(lockScroll);
        ticking = true;
      }
    }
    function onWheel(e) {
      if (maxY !== null && window.scrollY >= maxY && e.deltaY > 0) {
        e.preventDefault();
        window.scrollTo(0, maxY);
      }
      if (window.scrollY <= minY && e.deltaY < 0) {
        e.preventDefault();
        window.scrollTo(0, minY);
      }
    }
    function onKeyDown(e) {
      const downKeys = ["ArrowDown", "PageDown", "End"];
      if (maxY !== null && window.scrollY >= maxY && downKeys.includes(e.key)) {
        e.preventDefault();
        window.scrollTo(0, maxY);
      }
      const upKeys = ["ArrowUp", "PageUp", "Home"];
      if (window.scrollY <= minY && upKeys.includes(e.key)) {
        e.preventDefault();
        window.scrollTo(0, minY);
      }
    }
    let touchStartY = 0;
    function onTouchStart(e) {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    }
    function onTouchMove(e) {
      if (maxY !== null && window.scrollY >= maxY && e.touches && e.touches.length > 0) {
        const deltaY = e.touches[0].clientY - touchStartY;
        if (deltaY < 0) {
          e.preventDefault();
          window.scrollTo(0, maxY);
        }
      }
      if (window.scrollY <= minY && e.touches && e.touches.length > 0) {
        const deltaY = e.touches[0].clientY - touchStartY;
        if (deltaY > 0) {
          e.preventDefault();
          window.scrollTo(0, minY);
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: false });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [autoScrollComplete]);


  // Click sound for Explore button
  const clickSoundRef = useRef(null);
  const cardsRef = useRef([]);

  // Track whether the explore sequence already ran (prevents multiple triggers)
  const exploreTriggeredRef = useRef(false);
  // Cloud should not move; keep false to disable any parallax movement
  const cloudCanMoveRef = useRef(false);

  // Tracks whether sound is ON (not muted). Default OFF until Explore is triggered.
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [audioPausing, setAudioPausing] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const prevGalleryIndexRef = useRef(0);

  // Refs for images
  const imgRef1 = useRef(null);
  const imgRef2 = useRef(null);
  const imgRef3 = useRef(null);
  const imgRef4 = useRef(null);
  const imgRef5 = useRef(null);
  const imgRef6 = useRef(null);
  const imgRef7 = useRef(null);
  const imgRef8 = useRef(null);

  // Refs for gallery items
  const galleryItemRef1 = useRef(null);
  const galleryItemRef2 = useRef(null);
  const galleryItemRef3 = useRef(null);
  const galleryItemRef4 = useRef(null);
  const galleryItemRef5 = useRef(null);
  const galleryItemRef6 = useRef(null);
  const galleryItemRef7 = useRef(null);
  const galleryItemRef8= useRef(null);
  // Refs for texts
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const textRef3 = useRef(null);
  const textRef4 = useRef(null);
  const textRef5 = useRef(null);
  const textRef6 = useRef(null);
  const textRef7 = useRef(null);
 const textRef8 = useRef(null);

  // Refs for landing page elements
  const headingRef = useRef(null);
  const exploreBtnRef = useRef(null);
  const logoRef = useRef(null);
  const contentRef = useRef(null);
  const topRightRef = useRef(null);
  const landingScreenRef = useRef(null);

  // Cloud ref
  const cloudRef = useRef(null);
  // Hide cloud when scroll is locked at card position
  useEffect(() => {
    if (!autoScrollComplete || autoScrollStopYRef.current == null) return;
    const minY = autoScrollStopYRef.current;
    function hideCloudIfLocked() {
      if (window.scrollY <= minY + 1 && cloudRef.current) {
        cloudRef.current.style.display = 'none';
      } else if (cloudRef.current) {
        cloudRef.current.style.display = '';
      }
    }
    window.addEventListener('scroll', hideCloudIfLocked, { passive: false });
    hideCloudIfLocked();
    return () => {
      window.removeEventListener('scroll', hideCloudIfLocked);
    };
  }, [autoScrollComplete]);

  const bgMusic = useRef(new Audio("/backgroundsound.mp3"));
  bgMusic.current.loop = true;
  bgMusic.current.preload = 'auto';
  bgMusic.current.volume = 1.0;
  // Optional: uncomment if you load from a CDN
  // bgMusic.current.crossOrigin = 'anonymous';

  // Preload audio without autoplay so it starts instantly on Explore
  useEffect(() => {
    try {
      bgMusic.current.src = '/backgroundsound.mp3';
      bgMusic.current.load();
    } catch (e) {
      console.warn('Preload backgroundsound failed', e);
    }
  }, []);

  // Helper: play background music (single, fixed source only)
  const playBackgroundMusic = useCallback(async () => {
    try {
      const src = '/backgroundsound.mp3';
      if (!bgMusic.current.src.endsWith(src)) {
        bgMusic.current.src = src;
        bgMusic.current.load();
      }
      const playResult = await bgMusic.current.play();
      // Useful for debugging which source is actually playing
      console.info('Background music playing:', bgMusic.current.currentSrc || bgMusic.current.src);
      return !!playResult || !bgMusic.current.paused;
    } catch (err) {
      console.warn('Background music play blocked/failed', err);
      return false;
    }
  }, []);

  // Removed button click SFX per request

  // Always start at the very top where the Explore button is
  useEffect(() => {
    // window scroll (in case ScrollSmoother isn't ready yet)
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));

    // if a smoother already exists (hot reload), reset it
    const maybeSmoother = ScrollSmoother.get();
    if (maybeSmoother) {
      maybeSmoother.scrollTop(0, true);
    }
  }, []);

  // Autoplay on page start: try to start background music immediately.
  useEffect(() => {
    let removed = false;
    const resume = () => {
    if (!autoScrollComplete || autoScrollStopYRef.current == null) return;
    const minY = autoScrollStopYRef.current;
    let ticking = false;
    function lockScroll() {
      if (window.scrollY < minY) {
        window.scrollTo(0, minY);
      }
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(lockScroll);
        ticking = true;
      }
    }
    function onWheel(e) {
      if (window.scrollY <= minY && e.deltaY < 0) {
        e.preventDefault();
        window.scrollTo(0, minY);
      }
    }
    function onKeyDown(e) {
      const upKeys = ["ArrowUp", "PageUp", "Home"];
      if (window.scrollY <= minY && upKeys.includes(e.key)) {
        e.preventDefault();
        window.scrollTo(0, minY);
      }
    }
    let touchStartY = 0;
    function onTouchStart(e) {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    }
    function onTouchMove(e) {
      if (window.scrollY <= minY && e.touches && e.touches.length > 0) {
        const deltaY = e.touches[0].clientY - touchStartY;
        if (deltaY > 0) {
          e.preventDefault();
          window.scrollTo(0, minY);
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: false });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.removeEventListener('keydown', resume, { capture: true });
      window.removeEventListener('wheel', resume, { capture: true });
    };
  }, [playBackgroundMusic]);

  // Keep element muted state in sync with UI state
  useEffect(() => {
    if (bgMusic.current) {
      bgMusic.current.muted = !musicPlaying;
    }
  }, [musicPlaying]);
  const handleMusicToggle = () => {
    // Toggle mute without pausing playback. If turning ON and audio is paused, try to start it.
    const willBeMuted = !bgMusic.current.muted;
    bgMusic.current.muted = willBeMuted;
    const nowPlaying = !willBeMuted;
    setMusicPlaying(nowPlaying);
    if (nowPlaying && bgMusic.current.paused) {
      // user intent; safe to try to start
      if (typeof playBackgroundMusic === 'function') {
        playBackgroundMusic().catch(() => {});
      } else {
        bgMusic.current.play().catch(() => {});
      }
    }
  };

const handleExploreClick = useCallback(() => {
  if (exploreTriggeredRef.current) return; // avoid duplicate runs
  exploreTriggeredRef.current = true;

  // Play click sound
  if (clickSoundRef.current) {
    clickSoundRef.current.currentTime = 0;
    clickSoundRef.current.play();
  }

  // 1) Start sound immediately (before any scroll)
  if (bgMusic.current) {
    bgMusic.current.muted = false; // unmute
    setMusicPlaying(true);
    playBackgroundMusic().catch((err) => {
      console.log('Background music play was blocked, will retry on next tap/click.', err);
      const resume = () => {
        if (!bgMusic.current || !bgMusic.current.paused) return;
        playBackgroundMusic().catch(() => {});
        window.removeEventListener('pointerdown', resume, { capture: true });
      };
      window.addEventListener('pointerdown', resume, { once: true, capture: true });
    });
  }

  // 2) Proceed with auto-scroll once smoother is available
  const kickScroll = (smoother) => {
    smoother.paused(true);

    // Compute target Y so the card with the desired sentence is centered
    const targetCard = document.querySelector('.card_5');
    let targetY = 1000; // fallback
    try {
      if (targetCard) {
        const contentEl = document.querySelector('.content');
        const contentRect = contentEl?.getBoundingClientRect();
        const targetRect = targetCard.getBoundingClientRect();
        const current = smoother.scrollTop();
        const relativeTop = (targetRect.top - (contentRect ? contentRect.top : 0));
        const viewportH = window.innerHeight || 0;
        const cardH = targetCard.offsetHeight || 0;
        // Position so the card appears roughly centered
        targetY = Math.max(0, current + relativeTop - (viewportH / 2 - cardH / 2));
  // Store the stop position for scroll lock
  autoScrollStopYRef.current = targetY;
      }
    } catch {
      // ignore measurement errors; fallback targetY will be used
    }

    const tl = gsap.timeline({
      onComplete: () => {
        smoother.paused(false);
        cloudCanMoveRef.current = false; // stop further cloud movement
        gsap.set(cloudRef.current, { x: 0, y: 0 });
        if (typeof setShowNav === 'function') setShowNav(true); // Show navbar after autoscroll
        setAutoScrollComplete(true); // Mark auto-scroll as complete
      },
    });
    // Animate all up together, but with different y values to avoid overlap
    tl.to(logoRef.current, {
      y: -220,
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
    }, 0);
    tl.to(headingRef.current, {
      y: -160,
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
    }, 0);
    tl.to(exploreBtnRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(topRightRef.current, { opacity: 1, duration: 0.5 });
      },
    }, 0);
  tl.to(smoother, { scrollTop: targetY, duration: 5, ease: "power3.inOut" }, 0);
  };

  let smoother = ScrollSmoother.get();
  if (smoother) {
    kickScroll(smoother);
  } else {
    // try shortly if not yet ready
    setTimeout(() => {
      const s = ScrollSmoother.get();
      if (s) kickScroll(s);
    }, 50);
  }
}, [playBackgroundMusic]);

  const handleGalleryClick = () => {
  setShowSingleImage(true);
  setGalleryIndex(0);
  // Do not start playback here; sound starts with Explore only
  };

  // Smooth scrolling & card animation
  useEffect(() => {
    if (showSingleImage) return;

    const smoother = ScrollSmoother.create({
      wrapper: ".container",
      content: ".content",
      smooth: 4,
      effects: true,
      normalizeScroll: true,
    });

    // Force to top after creation to defeat any prior restoration
    try {
      smoother.scrollTop(0, true);
    } catch {
      // ignore if smoother not ready yet
    }

    // Card animations
    cardsRef.current.forEach((card, idx) => {
      if (!card) return;
  gsap.set(card, { opacity: idx === 0 ? 1 : 0 });
      const letters = card.querySelectorAll(".letter");
      // Conditionally disable animation for card_5 (index 4)
      if (idx === 0) {
        // For GRAND LOBBY (card_1), keep visible and animate splitText effect starting from 'GRAND'
        ScrollTrigger.create({
          trigger: card,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            cardsRef.current.forEach((c, i) => {
              if (i !== 0) gsap.to(c, { opacity: 0, duration: 0.5 });
            });
            gsap.to(card, { opacity: 1, duration: 0.8, ease: "power2.out" });
            // Animate the entire label letter by letter (splitText effect for all)
            const label = card.querySelector('.card-label');
            if (label) {
              const allLetters = Array.from(label.querySelectorAll('.letter'));
              gsap.fromTo(
                allLetters,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.07, duration: 0.7, ease: "power2.out" }
              );
            }
          },
          onEnterBack: () => {
            cardsRef.current.forEach((c, i) => {
              if (i !== 0) gsap.to(c, { opacity: 0, duration: 0.5 });
            });
            gsap.to(card, { opacity: 1, duration: 0.8, ease: "power2.out" });
            const label = card.querySelector('.card-label');
            if (label) {
              const label = card.querySelector('.card-label');
              if (label) {
                const allLetters = Array.from(label.querySelectorAll('.letter'));
                gsap.fromTo(
                  allLetters,
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0, stagger: 0.07, duration: 0.7, ease: "power2.out" }
                );
              }
            }
          },
          onLeave: () => {
            // Do not hide card_1 when leaving
            gsap.to(card, { opacity: 1, duration: 0.6, ease: "power2.inOut" });
          },
          onLeaveBack: () => {
            // Do not hide card_1 when leaving back
            gsap.to(card, { opacity: 1, duration: 0.6, ease: "power2.inOut" });
          },
        });
      } else if (idx === 4 && window.__skipCard5Anim) {
        ScrollTrigger.create({
          trigger: card,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            cardsRef.current.forEach((c) => gsap.to(c, { opacity: 0, duration: 0.5 }));
            gsap.to(card, { opacity: 1, duration: 0.8, ease: "power2.out" });
            // No letter animation
            window.__skipCard5Anim = false;
          },
          onEnterBack: () => {
            cardsRef.current.forEach((c) => gsap.to(c, { opacity: 0, duration: 0.5 }));
            gsap.to(card, { opacity: 1, duration: 0.8, ease: "power2.out" });
          },
          onLeave: () => gsap.to(card, { opacity: 0, duration: 0.6, ease: "power2.inOut" }),
          onLeaveBack: () => gsap.to(card, { opacity: 0, duration: 0.6, ease: "power2.inOut" }),
        });
      } else {
        ScrollTrigger.create({
          trigger: card,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            cardsRef.current.forEach((c) => gsap.to(c, { opacity: 0, duration: 0.5 }));
            gsap.to(card, { opacity: 1, duration: 0.8, ease: "power2.out" });
            gsap.fromTo(
              letters,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" }
            );
          },
          onEnterBack: () => {
            cardsRef.current.forEach((c) => gsap.to(c, { opacity: 0, duration: 0.5 }));
            gsap.to(card, { opacity: 1, duration: 0.8, ease: "power2.out" });
          },
          onLeave: () => gsap.to(card, { opacity: 0, duration: 0.6, ease: "power2.inOut" }),
          onLeaveBack: () => gsap.to(card, { opacity: 0, duration: 0.6, ease: "power2.inOut" }),
        });
      }
    });

    return () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [showSingleImage]);

  // Place the cloud just below the Explore button (scrolls with the landing screen)
  useEffect(() => {
    const positionCloud = () => {
      const btn = exploreBtnRef.current;
      const cloud = cloudRef.current;
      const landing = landingScreenRef.current;
      if (!btn || !cloud || !landing) return;
      const btnRect = btn.getBoundingClientRect();
      const landingRect = landing.getBoundingClientRect();
  // Desired top relative to landing
  let topWithinLanding = Math.round((btnRect.bottom - landingRect.top) + 12);
  // Clamp so cloud never goes too high/low
  const minTop = 0; // not above top of landing
  const maxTop = Math.max(0, landingRect.height - (cloud.offsetHeight || 0));
  topWithinLanding = Math.min(Math.max(topWithinLanding, minTop), maxTop);
      cloud.style.position = 'absolute';
      cloud.style.top = `${topWithinLanding}px`;
      cloud.style.left = '50%';
  cloud.style.transform = 'translateX(-50%) scale(1.05)';
      cloud.style.zIndex = '9';
      cloud.style.pointerEvents = 'none';
    };
    // Initial and on resize
    requestAnimationFrame(positionCloud);
    window.addEventListener('resize', positionCloud);
    return () => window.removeEventListener('resize', positionCloud);
  }, []);

  // Auto-trigger Explore when the user first scrolls (or uses keys/touch) before clicking the button
  useEffect(() => {
    if (showSingleImage) return; // only on landing state

    const isFromSoundToggle = (target) => {
      try {
        return !!(target && target.closest && target.closest('.sound-toggle'));
      } catch {
        return false;
      }
    };

    const trigger = () => {
      if (!exploreTriggeredRef.current) {
        handleExploreClick();
      }
    };

    const onWheel = (e) => {
      if (isFromSoundToggle(e.target)) return;
      // Trigger on downward intent; remove check if you want any wheel to trigger
      if (e.deltaY > 0) trigger();
    };

    const onKeyDown = (e) => {
      if (isFromSoundToggle(e.target)) return;
      const code = e.code || e.key;
      if (["ArrowDown", "PageDown", "Space", " "].includes(code)) trigger();
    };

    let touched = false;
    const onTouchStart = (e) => {
      if (isFromSoundToggle(e.target)) return;
      if (!touched) {
        touched = true;
        trigger();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, [showSingleImage, handleExploreClick]);

  // Gallery scroll logic
  useEffect(() => {
    if (!showSingleImage) return;

    let canScroll = true;
    const delay = 1200;

    const handleWheel = (e) => {
      if (!canScroll) return;
      if (e.deltaY > 0) {
        setGalleryIndex((prev) => Math.min(prev + 1, 7));
      } else if (e.deltaY < 0) {
        setGalleryIndex((prev) => Math.max(prev - 1, 0));
      }
      canScroll = false;
      setTimeout(() => {
        canScroll = true;
      }, delay);
    };


    const closeGallery = () => {
  setShowSingleImage(false);
  setGalleryIndex(0);
  prevGalleryIndexRef.current = 0;
  setShowText(false);

  // Scroll to gallery button position
  const galleryBtn = document.querySelector('.scroll-to-gallery-btn');
  const smoother = ScrollSmoother.get();
  if (smoother && galleryBtn) {
    // Scroll so the button is visible at the bottom of viewport
    const btnRect = galleryBtn.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const targetScroll = smoother.scrollTop() + (btnRect.top - viewportHeight + btnRect.height + 20); // 20px padding
    smoother.scrollTo(targetScroll, true);
  } else if (galleryBtn) {
    // Fallback for non-smoother
    galleryBtn.scrollIntoView({ block: "end", behavior: "smooth" });
  }
};

    const handleKeyDown = (e) => {
      if (!canScroll) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setGalleryIndex((prev) => Math.min(prev + 1, 7));
        canScroll = false;
        setTimeout(() => canScroll = true, delay);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setGalleryIndex((prev) => Math.max(prev - 1, 0));
        canScroll = false;
        setTimeout(() => canScroll = true, delay);
      }
    };

    // Touch support for mobile
    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (!canScroll) return;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = touchStartX - touchEndX;

      // Determine if it's a vertical swipe (prioritize vertical for gallery)
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          setGalleryIndex((prev) => Math.min(prev + 1, 7));
        } else {
          setGalleryIndex((prev) => Math.max(prev - 1, 0));
        }
        canScroll = false;
        setTimeout(() => canScroll = true, delay);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [showSingleImage]);


  
// GSAP gallery animation
useEffect(() => {
  if (!showSingleImage) return;

  const galleryItems = [
    galleryItemRef1.current,
    galleryItemRef2.current,
    galleryItemRef3.current,
    galleryItemRef4.current,
    galleryItemRef5.current,
    galleryItemRef6.current,
    galleryItemRef7.current,
    galleryItemRef8.current,
  ];

  const prevIndex = prevGalleryIndexRef.current;
  const currentIndex = galleryIndex;
  const currentItem = galleryItems[currentIndex];

  if (!currentItem) return;
  gsap.set(currentItem, { zIndex: 10, display: 'flex', autoAlpha: 1 });
  // Animation directions
  if (currentIndex === 0 || currentIndex === 4 || currentIndex === 6) {
    // bottom to top
    gsap.fromTo(currentItem, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power3.out" });
  } else if (currentIndex === 1) {
    gsap.fromTo(currentItem, { xPercent: -100 }, { xPercent: 0, duration: 1.2, ease: "power3.out" });
  } else if (currentIndex === 2 || currentIndex === 5) {
    gsap.fromTo(currentItem, { xPercent: 100 }, { xPercent: 0, duration: 1.2, ease: "power3.out" });
  } else if (currentIndex === 3 || currentIndex === 7) {
    // top to bottom
    gsap.fromTo(currentItem, { yPercent: -100 }, { yPercent: 0, duration: 1.2, ease: "power3.out" });
  }
galleryItems.forEach((item, idx) => {
  if (!item) return;
  // Show current image + last visible image
  if (idx === currentIndex || idx === prevIndex) {
    gsap.set(item, {
      zIndex: idx === currentIndex ? 10 : 5,
      autoAlpha: 1,
      display: 'flex',
    });
  } else {
    gsap.set(item, { zIndex: 0, autoAlpha: 0, display: 'none' });
  }
});
  prevGalleryIndexRef.current = currentIndex;
}, [galleryIndex, showSingleImage]);
  // Animate text overlays
  const [showText, setShowText] = useState(false);
  useEffect(() => {
    if (showSingleImage) {
      setShowText(false);
      const timer = setTimeout(() => setShowText(true), 700);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [showSingleImage, galleryIndex]);
  useEffect(() => {
    if (showText) {
      const textRefs = [textRef1, textRef2, textRef3, textRef4, textRef5, textRef6, textRef7];
      const currentTextRef = textRefs[galleryIndex];
      if (currentTextRef && currentTextRef.current) {
        const words = currentTextRef.current.querySelectorAll(".word");
        gsap.to(currentTextRef.current, { opacity: 1, duration: 0.1 });
        gsap.fromTo(words, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" });
      }
    }
  }, [showText, galleryIndex]);
  return (
    <>
   <img
  src="/clouds/Cloud-tint-8.png"
  alt="Clouds"
  className="cloud-image"
  ref={cloudRef}
  data-speed="0"
/>
      <div className="container">
        <img
          src="/Asset_4.svg"
          className="top-right-image"
          ref={topRightRef}
          alt="Top Right Logo"
        />
  <div className="landing-screen" ref={landingScreenRef}>
          <p className="sub-heading" ref={headingRef}>NEXT TO THE GOVERNOR'S ESTATE MALABARA HILL</p>
{/* <button
  className="explore-btn"
  ref={exploreBtnRef} onClick={handleExploreClick}
  onMouseEnter={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // mouse position inside button
    if (x < rect.width / 2) {
      // left half hover → sweep left to right
      e.currentTarget.style.setProperty('--start', '-100%');
    } else {
      // right half hover → sweep right to left
      e.currentTarget.style.setProperty('--start', '100%');
    }
  }}
>
  <span>EXPLORE MORE</span>
</button> */}


<audio ref={clickSoundRef} src="/click.mp3" preload="auto" />
<button
  className="explore-btn"
  ref={exploreBtnRef}
  onClick={handleExploreClick}
  onMouseEnter={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    let startX = '-100%';
    let startY = '0';

    if (angle > -67.5 && angle <= -22.5) { startX = '100%'; startY = '-100%'; }       // top-right
    else if (angle > -112.5 && angle <= -67.5) { startX = '0'; startY = '-100%'; }   // top
    else if (angle > -157.5 && angle <= -112.5) { startX = '-100%'; startY = '-100%'; } // top-left
    else if (angle > 157.5 || angle <= -157.5) { startX = '-100%'; startY = '0'; }   // left
    else if (angle > 112.5 && angle <= 157.5) { startX = '-100%'; startY = '100%'; } // bottom-left
    else if (angle > 67.5 && angle <= 112.5) { startX = '0'; startY = '100%'; }      // bottom
    else if (angle > 22.5 && angle <= 67.5) { startX = '100%'; startY = '100%'; }    // bottom-right
    else { startX = '100%'; startY = '0'; }                                          // right

    e.currentTarget.style.setProperty('--start-x', startX);
    e.currentTarget.style.setProperty('--start-y', startY);
  }}
>
  <span>EXPLORE MORE</span>
</button>

          {/* <button className="explore-btn" ref={exploreBtnRef} onClick={handleExploreClick}>Explore more</button> */}
          <img src="/Asset_4.svg" alt="Logo" className="landing-logo" ref={logoRef} />
          <div
            className="content"
            ref={contentRef}
            style={{ pointerEvents: showSingleImage ? 'none' : 'auto' }}
          >
            <section className="building-page">
              <div className="card card_5" ref={(el) => (cardsRef.current[4] = el)}>
                <p className="card-paragraph">{splitTextLetters("A PRIVATE SKY MANSION CRAFTED TO RESIDE OVER THE CITY.")}</p>
              </div>
              <div className="card card_4" ref={(el) => (cardsRef.current[3] = el)}>
                <span className="gold-number">{splitTextLetters("11")}</span>
                <span className="card-label">{splitTextLetters("EXQUISITE MANSIONS")}</span>
              </div>
              <div className="card card_3" ref={(el) => (cardsRef.current[2] = el)}>
                <span className="gold-number">{splitTextLetters("2")}</span>
                <span className="card-label">{splitTextLetters("EXCLUSIVE CLUB LEVELS")}</span>
              </div>
              <div className="card card_2" ref={(el) => (cardsRef.current[1] = el)}>
                <span className="gold-number">{splitTextLetters("2")}</span>
                <span className="card-label">{splitTextLetters("PARKING BASEMENT")}</span>
                <span className="gold-number">{splitTextLetters("9")}</span>
                <span className="card-label">{splitTextLetters("PARKING LEVELS")}</span>
              </div>
              <div className="card card_1" ref={(el) => (cardsRef.current[0] = el)}>
                <span className="card-label">
                  {splitTextLetters("GRAND DOUBLE HEIGHT LOBBY")}
                  
                </span>
              </div>

              {/* <button className="scroll-to-gallery-btn" onClick={handleGalleryClick}>
                <span>CLICK TO EXPLORE GALLERY</span>
              </button> */}
            </section>
          </div>
        </div>

        {showSingleImage && (
          <div className="single-image-gallery-container">
            {/* Gallery Progress Indicator */}
            <div className="gallery-progress">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className={`progress-dot ${i === galleryIndex ? 'active' : ''}`}
                  onClick={() => setGalleryIndex(i)}
                />
              ))}
            </div>

            
            {/* <div ref={galleryItemRef1} className="gallery-item" style={{ display: 'flex' }}>
              <img ref={imgRef1} src="/Gallery/carsection.jpg" alt="Luxury Car Parking" className="single-gallery-image" />
              {showText && galleryIndex === 0 && (
                <div ref={textRef1} className="single-image-text-overlay">
                 <h2>{splitTextWords("For those who resign, a vault for your fleet.")}</h2>
<p>{splitTextWords("For every marque you collect, a sanctuary that reflects your exceptional lifestyle.")}</p>
                </div>
              )}
            </div> */}
<div ref={galleryItemRef1} className="gallery-item" style={{ display: 'flex', position: 'relative' }}>

  {/* Gallery Image */}
  <img
    ref={imgRef1}
    src="/Gallery/carsection.jpg"
    alt="Luxury Car Parking"
    className="single-gallery-image"
  />

  {/* Text Overlay */}
  {showText && galleryIndex === 0 && (
    <div ref={textRef1} className="single-image-text-overlay">
      <h2>{splitTextWords("For those who resign, a vault for your fleet.")}</h2>
      <p>{splitTextWords("For every marque you collect, a sanctuary that reflects your exceptional lifestyle.")}</p>
    </div>
  )}
</div>

<div ref={galleryItemRef2} className="gallery-item" style={{ display: (galleryIndex === 1 || galleryIndex === 0 || galleryIndex === 2) ? 'flex' : 'none' }}>
            {/* <div ref={galleryItemRef2} className="gallery-item" style={{ display: galleryIndex === 1 ? 'flex' : 'none' }}> */}
              <img ref={imgRef2} src="/Gallery/img2_2.jpg" alt="Skyline View" className="sec-gallery-image" />
              {showText && galleryIndex === 1 && (
                <div ref={textRef2} className="sec-image-text-overlay from-left">
                  <h2>{splitTextWords("Make a statement even before you step in.")}</h2>
<p>{splitTextWords("Your arrival marks a moment of distinction a drive that sets the stage for the world within.")}</p>
                </div>
              )}
            </div>

            <div ref={galleryItemRef3} className="gallery-item" style={{ display: galleryIndex === 2 ? 'flex' : 'none' }}>
              <img ref={imgRef3} src="/Gallery/img3_2.jpg" alt="Rooftop Retreat" className="third-gallery-image" />
              {showText && galleryIndex === 2 && (
                <div ref={textRef3} className="third-image-text-overlay from-right">
                  <h2>{splitTextWords("Any more expansive, and you might need a GPS to navigate.")}</h2>
<p>{splitTextWords("A testament to impeccable taste, Malabar embodies the grandeur of your cherished chateau and the warmth of an ancestral manor.")}</p>
                </div>
              )}
            </div>

            <div ref={galleryItemRef4} className="gallery-item" style={{ display: galleryIndex === 3 ? 'flex' : 'none' }}>
              <img ref={imgRef4} src="/Gallery/img4_2.jpg" alt="Luxury Suite" className="fourth-gallery-image" />
              {showText && galleryIndex === 3 && (
                <div ref={textRef4} className="fourth-image-text-overlay from-top">
                   <h2>{splitTextWords("Two Realms. One Privilege: Yours.")}</h2>
<p>{splitTextWords("Conversations held in rooms no one enters unannounced. Sunset rituals that require no scheduling. Here, every inch is crafted for those to whom silence responds. At 'Runwal Malabar', the clubhouse isn't something you merely access  it's something others do not.")}</p>
                </div>
              )}
            </div>

            <div ref={galleryItemRef5} className="gallery-item" style={{ display: galleryIndex === 4 ? 'flex' : 'none' }}>
              <img ref={imgRef5} src="/Gallery/img6_2.jpg" alt="Unique Section" className="fifth-gallery-image" />
              {showText && galleryIndex === 4 && (
                <div ref={textRef5} className="fifth-image-text-overlay from-bottom">
                   <h2>{splitTextWords("This is Your Moment.")}</h2>
<p>{splitTextWords("'Runwal Malabar' is the stage set for your legacy a realm where your place in history is imagined and realized. While some legacies stand firm on the ground, yours reaches for the sky.")}</p>
                </div>
              )}
            </div>

            <div ref={galleryItemRef6} className="gallery-item" style={{ display: galleryIndex === 5 ? 'flex' : 'none' }}>
              <img ref={imgRef6} src="/Gallery/img7_2.jpg" alt="Grand Lobby" className="sixth-gallery-image" />
              {showText && galleryIndex === 5 && (
                <div ref={textRef6} className="sixth-image-text-overlay from-right">
                   <h2>{splitTextWords("A Creation Worthy of Picasso's Signature.")}</h2>
<p>{splitTextWords("The entrance lounge a modernist sculpture capturing shifting lights and shadows, echoing Cubist artistry.")}</p>
                </div>
              )}
            </div>
            <div
ref={galleryItemRef7}
  className="gallery-item"
  style={{ display: galleryIndex === 6 ? 'flex' : 'none' }}
>
  <img
    ref={imgRef7}
    src="/Gallery/img8_crop.jpg"
    alt="New Gallery Image"
    className="seventh-gallery-image"
  />
  {showText && galleryIndex === 6 && (
    // <div ref={textRef7} className="seventh-image-text-overlay from-bottom">

    <div
  ref={textRef7}
  className={`seventh-image-text-overlay from-bottom ${showText && galleryIndex === 6 ? "show" : ""}`}
>

       <h2>A Private Sky Mansion, Designed to Tower Over the City.</h2>
<p>Craft your legacy in Mumbai's most prestigious enclave.</p>
    </div>
  )}
</div>

<div ref={galleryItemRef8} className="gallery-item" style={{ display: galleryIndex === 7 ? 'flex' : 'none' }}>
  <img ref={imgRef8} src="/Gallery/img8_crop_sky.jpg" alt="New Gallery Image 8" className="eighth-gallery-image" />
  {showText && galleryIndex === 7 && (
    <div ref={textRef8} className="eighth-image-text-overlay from-top">
      <h2>Contact Us</h2>
<p>If you have any questions or want to know more, feel free to reach out:</p>
<p>Phone: +91 98765 43210</p>
<p>Email: info@example.com</p>
<p>Address: 123 Malabar Hill, Mumbai, India</p>

    </div>
  )}
</div>


          </div>
        )}




<button
  className="audio-btn"
  aria-label="Toggle audio"
  data-state={musicPlaying ? (audioPausing ? "pausing" : "play") : "pause"}
  onClick={() => {
    if (!musicPlaying) {
      setMusicPlaying(true);
      setAudioPausing(false);
      bgMusic.current.play();
    } else if (musicPlaying && !audioPausing) {
      setAudioPausing(true);
      setTimeout(() => {
        setMusicPlaying(false);
        setAudioPausing(false);
        bgMusic.current.pause();
      }, 1000); // match winddown duration
    }
  }}
  style={{ position: "fixed", bottom: 30, left: 30, zIndex: 1000 }}
>
  {[...Array(5)].map((_, i) => (
    <span
      key={i}
      ref={el => {
        if (el && musicPlaying && !audioPausing) {
          el.style.setProperty('--current-scale', (0.3 + Math.random() * 0.7).toFixed(2));
          el.style.animationDelay = '';
        }
        if (el && audioPausing) {
          el.style.animationDelay = `${i * 0.12}s`;
        }
      }}
    ></span>
  ))}
</button>

      </div>
    </>
  );
};

export default BuildingScroll;



