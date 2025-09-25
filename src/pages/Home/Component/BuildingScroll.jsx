import React, { useEffect, useRef, useState, useCallback } from "react";
import "./BuildingScroll.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Gallery from "./Gallery"; // ✅ Import Gallery component

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
  
  const animatedCardsRef = useRef(new Set());

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
    let ticking = false;
    let isCloudHidden = false;
    
    function hideCloudIfLocked() {
      const shouldHide = window.scrollY <= minY + 1;
      
      if (shouldHide && !isCloudHidden && cloudRef.current) {
        gsap.to(cloudRef.current, { 
          opacity: 0, 
          duration: 0.3, 
          ease: "power2.out",
          onComplete: () => {
            cloudRef.current.style.display = 'none';
          }
        });
        isCloudHidden = true;
      } else if (!shouldHide && isCloudHidden && cloudRef.current) {
        cloudRef.current.style.display = '';
        gsap.to(cloudRef.current, { 
          opacity: 1, 
          duration: 0.3, 
          ease: "power2.out" 
        });
        isCloudHidden = false;
      }
      ticking = false;
    }
    
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(hideCloudIfLocked);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    hideCloudIfLocked();
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [autoScrollComplete]);

  const bgMusic = useRef(new Audio("/backgroundsound.mp3"));
  bgMusic.current.loop = true;
  bgMusic.current.preload = 'auto';
  bgMusic.current.volume = 1.0;

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
          targetY = Math.max(0, current + relativeTop - (viewportH / 2 - cardH / 2 + 100));
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
      
      tl.to(smoother, { scrollTop: targetY, duration: 3, ease: "power3.inOut" }, 0);
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

  // ✅ Gallery click handler - now uses Gallery component
  const handleGalleryClick = () => {
    setShowSingleImage(true);
    // Do not start playback here; sound starts with Explore only
  };

  // Smooth scrolling & card animation
  useEffect(() => {
    if (showSingleImage) return;

    const smoother = ScrollSmoother.create({
      wrapper: ".container",
      content: ".content",
      smooth: 2,
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
      
      // Set initial state - all cards start hidden
      gsap.set(card, { opacity: 0 });
      
      if (idx === 0 || idx === 1 || idx === 2 || idx === 3 || idx === 4) {
        ScrollTrigger.create({
          trigger: card,
          start: "top 80%", // Adjusted to trigger earlier
          end: "bottom 20%",
          onEnter: () => {
            if (animatedCardsRef.current.has(idx)) {
              gsap.set(card, { opacity: 1 });
              const allLetters = Array.from(card.querySelectorAll('.letter'));
              gsap.set(allLetters, { opacity: 1 });
              return;
            }
            
            animatedCardsRef.current.add(idx);
            gsap.to(card, { opacity: 1, duration: 0.5 }); // Fade in card first
            
            const allLetters = Array.from(card.querySelectorAll('.letter'));
            gsap.killTweensOf(allLetters);
            gsap.set(allLetters, { 
              opacity: 0,
              scale: 1,
              rotation: 0,
              x: 0,
              y: 0
            });
            
            // Add a slight delay before animating letters
            gsap.to(allLetters, {
              opacity: 1,
              duration: 0.8,
              ease: "sine.out",
              stagger: 0.05,
              overwrite: true,
            });
            
            if (idx === 0 && typeof setShowNav === 'function') {
              console.log("🏛️ Card 0 (GRAND DOUBLE HEIGHT LOBBY) triggered!");
              console.log("🏛️ setShowNav function type:", typeof setShowNav);
              console.log("🏛️ Calling setShowNav(true)...");
              setShowNav(true);
              console.log("🏛️ setShowNav(true) called successfully");
            }
          },
          onEnterBack: () => {
            gsap.set(card, { opacity: 1 });
            const allLetters = Array.from(card.querySelectorAll('.letter'));
            gsap.set(allLetters, { opacity: 1 });
          },
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
    let rafId = null;
    
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
    
    const throttledPositionCloud = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        positionCloud();
        rafId = null;
      });
    };
    
    // Initial positioning
    throttledPositionCloud();
    window.addEventListener('resize', throttledPositionCloud);
    
    return () => {
      window.removeEventListener('resize', throttledPositionCloud);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Auto-trigger animation on page load
  useEffect(() => {
    if (showSingleImage) return;
    
    // Set a delay to ensure everything is loaded
    const autoTriggerDelay = 500;
    
    const autoTrigger = setTimeout(() => {
      if (!exploreTriggeredRef.current) {
        console.log("🎬 Auto-triggering explore animation...");
        handleExploreClick();
      }
    }, autoTriggerDelay);

    return () => {
      clearTimeout(autoTrigger);
    };
  }, [showSingleImage, handleExploreClick]);

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
          <p className="sub-heading" ref={headingRef}>
            NEXT TO THE GOVERNOR'S ESTATE MALABAR HILL
          </p>

          <audio ref={clickSoundRef} src="/click.mp3" preload="auto" />

          <img src="/Asset_4.svg" alt="Logo" className="landing-logo" ref={logoRef} />
          
          <div
            className="content"
            ref={contentRef}
            style={{ pointerEvents: showSingleImage ? 'none' : 'auto' }}
          >
            <section className="building-page">
              <div className="card card_5" ref={(el) => (cardsRef.current[4] = el)}>
                <p className="card-paragraph">
                  {splitTextLetters("A PRIVATE SKY MANSION CRAFTED TO RESIDE OVER THE CITY.")}
                </p>
              </div>
              
              <div className="card card_4" ref={(el) => (cardsRef.current[3] = el)}>
                <span className="gold-number">{splitTextLetters("11")}</span>
                <span className="card-label">{splitTextLetters("EXQUISITE MANSIONS")}</span>
              </div>
              
              <div className="card card_3 " ref={(el) => (cardsRef.current[2] = el)} >
                <span className="gold-number">{splitTextLetters("2")}</span>
                <span className="card-label">{splitTextLetters("EXCLUSIVE CLUB LEVELS")}</span>
              </div>
              
              <div className="card card_2" ref={(el) => (cardsRef.current[1] = el)}>
                <span className="gold-number mb-[-2rem]">{splitTextLetters("2")}</span>
                <span className="card-label mb-[-3rem] md:mb-[-1rem] max-sm:mb-[0rem]">
                  {splitTextLetters("PARKING BASEMENT")}
                </span>
                <span className="gold-number mt-[-1rem]">{splitTextLetters("9")}</span>
                <span className="card-label card2text">{splitTextLetters("PARKING LEVELS")}</span>
              </div>
              
              <div className="card card_1 max-sm:text-sm" ref={(el) => (cardsRef.current[0] = el)}>
                <span className="card-label max-sm:text-sm max-sm:left-10">
                  {splitTextLetters("GRAND DOUBLE HEIGHT LOBBY")}
                </span>
              </div>
            </section>

            {/* ✅ Gallery trigger button */}
            <button 
              onClick={handleGalleryClick}
              className="scroll-to-gallery-btn"
              style={{
                position: 'absolute',
                bottom: '100px',
                right: '50px',
                background: 'rgba(255, 208, 117, 0.9)',
                color: 'black',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'Zap, sans-serif',
                fontSize: '16px',
                fontWeight: 'bold',
                zIndex: 100,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 208, 117, 1)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 208, 117, 0.9)';
                e.target.style.transform = 'translateY(0px)';
              }}
            >
              View Gallery
            </button>
          </div>
        </div>

        {/* ✅ Gallery Component Integration */}
        <Gallery
          isVisible={showSingleImage}
          onClose={() => {
            setShowSingleImage(false);
            // Scroll back to gallery button after closing
            setTimeout(() => {
              const galleryBtn = document.querySelector('.scroll-to-gallery-btn');
              const smoother = ScrollSmoother.get();
              if (smoother && galleryBtn) {
                const btnRect = galleryBtn.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const targetScroll = smoother.scrollTop() + (btnRect.top - viewportHeight + btnRect.height + 20);
                smoother.scrollTo(targetScroll, true);
              } else if (galleryBtn) {
                galleryBtn.scrollIntoView({ block: "end", behavior: "smooth" });
              }
            }, 100);
          }}
          startIndex={0}
        />

        {/* Music Button */}
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
