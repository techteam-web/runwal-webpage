
import React, { useEffect, useRef, useState } from "react";
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

// Split text into letters for letter-by-letter animation (cards)
const splitTextLetters = (text) =>
  text.split("").map((letter, i) => (
    <span key={i} className="letter" style={{ display: "inline-block" }}>
      {letter === " " ? "\u00A0" : letter}
    </span>
  ));

const BuildingScroll = () => {
  const cardsRef = useRef([]);

  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showSingleImage, setShowSingleImage] = useState(false);
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
  const buildingRef = useRef(null);
  const centerLogoRef = useRef(null);
  const topRightRef = useRef(null);

  // Cloud ref
  const cloudRef = useRef(null);

  const bgMusic = useRef(new Audio("/backgroundsound.mp3"));
  bgMusic.current.loop = true;

  const clickSound = useRef(new Audio("/click.mp3"));

  // Autoplay background music
  useEffect(() => {
    const playMusic = async () => {
      try {
        await bgMusic.current.play();
        setMusicPlaying(true);
      } catch (err) {
        console.log("Autoplay blocked, user interaction needed", err);
      }
    };
    playMusic();
  }, []);

  const handleMusicToggle = () => {
    if (musicPlaying) bgMusic.current.pause();
    else bgMusic.current.play();
    setMusicPlaying(!musicPlaying);
  };

  const handleExploreClick = () => {
    clickSound.current.currentTime = 0;
    clickSound.current.play();

    const smoother = ScrollSmoother.get();
    if (!smoother) return;
    smoother.paused(true); // pause manual scrolling
    // Timeline to sync animations
    // const tl = gsap.timeline({
    //   onComplete: () => smoother.paused(false)
    // });


    const tl = gsap.timeline({
  onComplete: () => {
    smoother.paused(false);
    cloudCanMove = false; // 👈 stop cloud movement
    gsap.set(cloudRef.current, { x: 0, y: 0 }); // 👈 fix cloud position
  }
});

    // Animate center logo, heading, and button
    tl.to([headingRef.current, exploreBtnRef.current, logoRef.current], {
      y: -200,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        // Show top-right logo after center logo disappears
        gsap.to(topRightRef.current, { opacity: 1, duration: 0.5 });
      }
    }, 0);
    // Start auto-scroll at the same time
    tl.to(smoother, {
      scrollTop: 1000, // scroll distance
      duration: 10,    // scroll duration
      ease: "power3.inOut"
    }, 0);
  };
  
  const handleGalleryClick = () => {
    clickSound.current.currentTime = 0;
    clickSound.current.play();
    setShowSingleImage(true);
    setGalleryIndex(0);
    if (!musicPlaying) {
      bgMusic.current.play();
      setMusicPlaying(true);
    }
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

    const building = buildingRef.current; // parallax background image
    const cloud = cloudRef.current;       // clouds

    if (!building) {
      console.log("Parallax: sorry, building image not found!");
      return;
    } else {
      console.log("Parallax: working");
    }

    // let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;
    // const speed = 0.015;
let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;
const speed = 0.015;
let cloudCanMove = true; // 👈 add this

    const moveBackground = () => {
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;

      // Animate building image
      gsap.set(building, {
        x: currentX * 100,
        y: currentY * 60
      });

      // Animate clouds
      // if (cloud) {
      //   gsap.set(cloud, {
      //     x: currentX * 80,
      //     y: currentY * 30
      //   });
      // }
// Animate clouds
if (cloud && cloudCanMove) { // 👈 add the condition
  gsap.set(cloud, {
    x: currentX * 80,
    y: currentY * 30
  });
}

      requestAnimationFrame(moveBackground);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);
    moveBackground();

    // Card animations
    cardsRef.current.forEach((card) => {
      if (!card) return;
      gsap.set(card, { opacity: 0 });
      const letters = card.querySelectorAll(".letter");

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
    });

    return () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [showSingleImage]);

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
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [showSingleImage]);

  // GSAP gallery animation
//   useEffect(() => {
//     if (!showSingleImage) return;

//     const galleryItems = [
//       galleryItemRef1.current,
//       galleryItemRef2.current,
//       galleryItemRef3.current,
//       galleryItemRef4.current,
//       galleryItemRef5.current,
//       galleryItemRef6.current,
//       galleryItemRef7.current,
//        galleryItemRef8.current, 
//     ];

//     const prevIndex = prevGalleryIndexRef.current;
//     const currentIndex = galleryIndex;

//     const currentItem = galleryItems[currentIndex];
//     if (!currentItem) return;

//     gsap.set(currentItem, { zIndex: 10, display: 'flex', autoAlpha: 1 });

//     if (currentIndex === 0 || currentIndex === 4 || currentIndex === 6) {
//       gsap.fromTo(currentItem, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power3.out" });
//     } else if (currentIndex === 1) {
//       gsap.fromTo(currentItem, { xPercent: -100 }, { xPercent: 0, duration: 1.2, ease: "power3.out" });
//     } else if (currentIndex === 2 || currentIndex === 5) {
//       gsap.fromTo(currentItem, { xPercent: 100 }, { xPercent: 0, duration: 1.2, ease: "power3.out" });
//     } else if (currentIndex === 3) {
//       gsap.fromTo(currentItem, { yPercent: -100 }, { yPercent: 0, duration: 1.2, ease: "power3.out" });
//     }

//     if (prevIndex !== currentIndex) {
//       const prevItem = galleryItems[prevIndex];
//       if (prevItem) {
//         gsap.set(prevItem, { zIndex: 0, autoAlpha: 1, display: 'flex' });
//       }
//     }
// if (currentIndex === 0 || currentIndex === 4 || currentIndex === 6) { // bottom to top
//   gsap.fromTo(currentItem, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power3.out" });
// } else if (currentIndex === 7) { // top to bottom for new image
//   gsap.fromTo(currentItem, { yPercent: -100 }, { yPercent: 0, duration: 1.2, ease: "power3.out" });
// }

//     prevGalleryIndexRef.current = currentIndex;
//   }, [galleryIndex, showSingleImage]);
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

  // Reset previous item z-index
  // if (prevIndex !== currentIndex) {
  //   const prevItem = galleryItems[prevIndex];
  //   if (prevItem) {
  //     gsap.set(prevItem, { zIndex: 0, autoAlpha: 1, display: 'flex' });
  //   }
  // }
// galleryItems.forEach((item, idx) => {
//   if (item) {
//     if (idx === currentIndex || idx === currentIndex - 1) {
//       gsap.set(item, { zIndex: idx === currentIndex ? 10 : 5, autoAlpha: 1, display: 'flex' });
//     } else {
//       gsap.set(item, { zIndex: 0, autoAlpha: 0, display: 'none' });
//     }
//   }
// });
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
  data-speed="0"   // 👈 Add this
/>


      <div className="bg-wrapper" aria-hidden="true">
        <img
          src="/copy_3_cropped.jpg"
          alt="background"
          className="bg-image"
          ref={buildingRef}
        />
      </div>

      <div className="container">
        <img
          src="/Asset_4.svg"
          className="top-right-image"
          ref={topRightRef}
          alt="Top Right Logo"
        />

        <p className="sub-heading" ref={headingRef}>NEXT TO THE GOVERNOR'S ESTATE MALABARA HILL</p>
        <button className="explore-btn" ref={exploreBtnRef} onClick={handleExploreClick}>Explore more</button>
        <img src="/Asset_4.svg" alt="Logo" className="landing-logo" ref={logoRef} />

        <div
          className="content"
          ref={contentRef}
          style={{ pointerEvents: showSingleImage ? 'none' : 'auto' }}
        >
          <section className="building-page">
            <div className="card card_5" ref={(el) => (cardsRef.current[4] = el)}>
              <p className="card-paragraph">{splitTextLetters("THE PRIVATE SKY MANSOON CRAFTED TO RESIGN OVER CITY.")}</p>
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
              <span className="card-label">{splitTextLetters("GRAND DOUBLE HEIGHT LOBBY")}</span>
            </div>

            <button className="scroll-to-gallery-btn" onClick={handleGalleryClick}>
              <span>Click To Explore Gallery</span>
            </button>
          </section>
        </div>

        {showSingleImage && (
          <div className="single-image-gallery-container">
            <div ref={galleryItemRef1} className="gallery-item" style={{ display: 'flex' }}>
              <img ref={imgRef1} src="/Gallery/carsection.jpg" alt="Luxury Car Parking" className="single-gallery-image" />
              {showText && galleryIndex === 0 && (
                <div ref={textRef1} className="single-image-text-overlay">
                  <h2>{splitTextWords("FOR THE ONES WHO RESIGN, A VAULT FOR YOUR FLEET.")}</h2>
                  <p>{splitTextWords("For every marque you collect, a sanctuary reflecting your exceptional lifestyle,")}</p>
                </div>
              )}
            </div>
<div ref={galleryItemRef2} className="gallery-item" style={{ display: (galleryIndex === 1 || galleryIndex === 0 || galleryIndex === 2) ? 'flex' : 'none' }}>


            {/* <div ref={galleryItemRef2} className="gallery-item" style={{ display: galleryIndex === 1 ? 'flex' : 'none' }}> */}
              <img ref={imgRef2} src="/Gallery/img2_2.jpg" alt="Skyline View" className="sec-gallery-image" />
              {showText && galleryIndex === 1 && (
                <div ref={textRef2} className="sec-image-text-overlay from-left">
                  <h2>{splitTextWords("MAKE A STATEMENT EVEN BEFORE YOU STEP IN.")}</h2>
                  <p>{splitTextWords("Your arrival marks a moment of distinction - a drive that sets the stage for the world within.")}</p>
                </div>
              )}
            </div>

            <div ref={galleryItemRef3} className="gallery-item" style={{ display: galleryIndex === 2 ? 'flex' : 'none' }}>
              <img ref={imgRef3} src="/Gallery/img3_2.jpg" alt="Rooftop Retreat" className="third-gallery-image" />
              {showText && galleryIndex === 2 && (
                <div ref={textRef3} className="third-image-text-overlay from-right">
                  <h2>{splitTextWords("ANY MORE EXPANSIVE AND YOU MIGHT NEED A CPS TO NAVIGATE.")}</h2>
                  <p>{splitTextWords("A testament to impeccable taste, Malabar embodies the grandeur of your cherished chateau and the warmth of an ancestral manor.")}</p>
                </div>
              )}
            </div>

            <div ref={galleryItemRef4} className="gallery-item" style={{ display: galleryIndex === 3 ? 'flex' : 'none' }}>
              <img ref={imgRef4} src="/Gallery/img4_2.jpg" alt="Luxury Suite" className="fourth-gallery-image" />
              {showText && galleryIndex === 3 && (
                <div ref={textRef4} className="fourth-image-text-overlay from-top">
                  <h2>{splitTextWords("TWO REALMS. ONE PRIVILEGE YOURS.")}</h2>
                  <p>{splitTextWords("Conversation held in rooms no one walks into unannounced. Sunset rituals that don't require scheduling. Here every inch was shaped for those whom silence answers. At 'Runwal Malabar', the clubhouse isn't something you access. It's something that others don't.")}</p>
                </div>
              )}
            </div>

            <div ref={galleryItemRef5} className="gallery-item" style={{ display: galleryIndex === 4 ? 'flex' : 'none' }}>
              <img ref={imgRef5} src="/Gallery/img6_2.jpg" alt="Unique Section" className="fifth-gallery-image" />
              {showText && galleryIndex === 4 && (
                <div ref={textRef5} className="fifth-image-text-overlay from-bottom">
                  <h2>{splitTextWords("THIS IS YOUR MOMENT.")}</h2>
                  <p>{splitTextWords("'Runwal Malabar' is the stage set for your legacy. A realm where your place in history is imagined and realized.While some legacies stand firm on the ground,your reaches for the sky")}</p>
                </div>
              )}
            </div>

            <div ref={galleryItemRef6} className="gallery-item" style={{ display: galleryIndex === 5 ? 'flex' : 'none' }}>
              <img ref={imgRef6} src="/Gallery/img7_2.jpg" alt="Grand Lobby" className="sixth-gallery-image" />
              {showText && galleryIndex === 5 && (
                <div ref={textRef6} className="sixth-image-text-overlay from-right">
                  <h2>{splitTextWords("A CREATION WORTHY OF PICASSO'S SIGNATURE.")}</h2>
                  <p>{splitTextWords("THE enterance lounge, a modernist sculpture capturing shifting lights and shadow - echoing Cubist artistry.")}</p>
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

      <h2>A PRIVACY SKY MANSION, CRAFTED TO RESIGN OVER THE CITY.</h2>
      <p>Craft your legacy at Mumbai's most prestigious enclave.</p>
    </div>
  )}
</div>
{/* <div
  ref={galleryItemRef7}
  className="gallery-item"
  style={{ display: galleryIndex === 6 ? 'flex' : 'none' }}
>
  <img
    ref={imgRef7}
    src="/Gallery/img8_building.jpg"
    alt="New Gallery Image"
    className="seventh-gallery-image"
  />
  {showText && galleryIndex === 6 && (
    <div ref={textRef7} className="seventh-image-text-overlay from-bottom">
      <h2>A PRIVACY SKY MANSION, CRAFTED TO RESIGN OVER THE CITY.</h2>
      <p>Craft your legacy at Mumbai's most prestigious enclave.</p>
      <hr className="seventh-text-line" />
    </div>
  )}
</div> */}

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
<div
  style={{
    position: "fixed",
    bottom: "20px",
    left: "55px",       // move to left
    display: "flex",
    alignItems: "center",
    gap: "8px",
    zIndex: 1000,
    cursor: "pointer",
  }}
  onClick={handleMusicToggle}
>
  <img
    src="/icons8-audio-wave.gif"
    alt="Audio Wave"
    className="audio-wave-gif"
    style={{ width: "40px", height: "40px" }} // same width & height
  />
 <span
  style={{
    color: "#000000ff",
    fontWeight: "bold",
    fontSize: "40px",
    lineHeight: "40px",
    fontFamily: "FONT4",
  }}
>
  Sound
</span>

</div>

        {/* <button className="music-toggle-btn" style={{ bottom: "20px" }} onClick={handleMusicToggle}>
          {musicPlaying ? "Pause Music" : "Play Music"}
        </button> */}
      </div>
    </>
  );
};

export default BuildingScroll;



