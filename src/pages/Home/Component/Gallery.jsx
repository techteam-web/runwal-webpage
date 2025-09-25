import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./BuildingScroll.css"; // Import your existing CSS

// Split text functions
const splitTextWords = (text) =>
  text.split(" ").map((word, i) => (
    <span key={i} className="word" style={{ display: "inline-block", marginRight: "0.25em" }}>
      {word}
    </span>
  ));

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

const Gallery = ({ 
  isVisible, 
  onClose, 
  customGalleryData = null,
  startIndex = 0 
}) => {
  // States
  const [galleryIndex, setGalleryIndex] = useState(startIndex);
  const [showText, setShowText] = useState(false);
  const prevGalleryIndexRef = useRef(startIndex);
  
  // ✅ Add animation lock to prevent double animations
  const isAnimatingRef = useRef(false);

  // Refs for gallery items
  const galleryItemRefs = useRef([]);
  const textRefs = useRef([]);
  const imgRefs = useRef([]);

  // Default gallery data
  const defaultGalleryData = [
    {
      src: "/Gallery/carsection.jpg",
      alt: "Luxury Car Parking",
      className: "single-gallery-image",
      textOverlayClass: "single-image-text-overlay",
      heading: "FOR THOSE WHO RESIGN, A VAULT FOR YOUR FLEET.",
      description: "For every marque you collect, a sanctuary that reflects your exceptional lifestyle.",
      animationDirection: "bottom-to-top"
    },
    {
      src: "/Gallery/img2_2.jpg",
      alt: "Skyline View",
      className: "sec-gallery-image",
      textOverlayClass: "sec-image-text-overlay from-left",
      heading: "MAKE A STATEMENT EVEN BEFORE YOU STEP IN.",
      description: "Your arrival marks a moment of distinction a drive that sets the stage for the world within.",
      animationDirection: "left-to-right"
    },
    {
      src: "/Gallery/img3_2.jpg",
      alt: "Rooftop Retreat",
      className: "third-gallery-image",
      textOverlayClass: "third-image-text-overlay from-right",
      heading: "ANY MORE EXPANSIVE, AND YOU MIGHT NEED A GPS TO NAVIGATE.",
      description: "A testament to impeccable taste, Malabar embodies the grandeur of your cherished chateau and the warmth of an ancestral manor.",
      animationDirection: "right-to-left"
    },
    {
      src: "/Gallery/img4_2.jpg",
      alt: "Luxury Suite",
      className: "fourth-gallery-image",
      textOverlayClass: "fourth-image-text-overlay from-top",
      heading: "TWO REALMS. ONE PRIVILEGE: YOURS.",
      description: "Conversations held in rooms no one enters unannounced. Sunset rituals that require no scheduling. Here, every inch is crafted for those to whom silence responds. At 'Runwal Malabar', the clubhouse isn't something you merely access  it's something others do not.",
      animationDirection: "top-to-bottom"
    },
    {
      src: "/Gallery/img6_2.jpg",
      alt: "Unique Section",
      className: "fifth-gallery-image",
      textOverlayClass: "fifth-image-text-overlay from-bottom",
      heading: "THIS IS YOUR MOMENT.",
      description: "'Runwal Malabar' is the stage set for your legacy a realm where your place in history is imagined and realized. While some legacies stand firm on the ground, yours reaches for the sky.",
      animationDirection: "bottom-to-top",
      hasMarginTop: true
    },
    {
      src: "/Gallery/img7_2.jpg",
      alt: "Grand Lobby",
      className: "sixth-gallery-image",
      textOverlayClass: "sixth-image-text-overlay from-right",
      heading: "A CREATION WORTHY OF PICASSO'S SIGNATURE.",
      description: "The entrance lounge a modernist sculpture capturing shifting lights and shadows, echoing Cubist artistry.",
      animationDirection: "right-to-left",
      hasMarginTop: true
    },
    {
      src: "/Gallery/img8_crop.jpg",
      alt: "New Gallery Image",
      className: "seventh-gallery-image",
      textOverlayClass: "seventh-image-text-overlay from-bottom",
      heading: "A Private Sky Mansion, Designed to Tower Over the City.",
      description: "Craft your legacy in Mumbai's most prestigious enclave.",
      animationDirection: "bottom-to-top",
      useSimpleText: true
    },
    {
      src: "/Gallery/img8_crop_sky.jpg",
      alt: "Contact Image",
      className: "eighth-gallery-image",
      textOverlayClass: "eighth-image-text-overlay from-top",
      heading: "Contact Us",
      description: "If you have any questions or want to know more, feel free to reach out:",
      extraContent: [
        "Phone: +91 98765 43210",
        "Email: info@example.com",
        "Address: 123 Malabar Hill, Mumbai, India"
      ],
      animationDirection: "top-to-bottom",
      useSimpleText: true
    }
  ];

  const galleryData = customGalleryData || defaultGalleryData;

  // Initialize refs arrays
  useEffect(() => {
    galleryItemRefs.current = galleryItemRefs.current.slice(0, galleryData.length);
    textRefs.current = textRefs.current.slice(0, galleryData.length);
    imgRefs.current = imgRefs.current.slice(0, galleryData.length);
  }, [galleryData.length]);

  // Reset gallery when opened
  useEffect(() => {
    if (isVisible && galleryIndex !== startIndex) {
      setGalleryIndex(startIndex);
      prevGalleryIndexRef.current = startIndex;
    }
  }, [isVisible, startIndex]);

  // Gallery scroll logic
  useEffect(() => {
    if (!isVisible) return;

    let canScroll = true;
    const delay = 1800;

    const handleWheel = (e) => {
      if (!canScroll || isAnimatingRef.current) return; // ✅ Check animation lock
      
      if (e.deltaY > 0) {
        setGalleryIndex((prev) => Math.min(prev + 1, galleryData.length - 1));
      } else if (e.deltaY < 0) {
        setGalleryIndex((prev) => Math.max(prev - 1, 0));
      }
      canScroll = false;
      setTimeout(() => {
        canScroll = true;
      }, delay);
    };

    const handleKeyDown = (e) => {
      if (!canScroll || isAnimatingRef.current) return; // ✅ Check animation lock
      
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setGalleryIndex((prev) => Math.min(prev + 1, galleryData.length - 1));
        canScroll = false;
        setTimeout(() => canScroll = true, delay);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setGalleryIndex((prev) => Math.max(prev - 1, 0));
        canScroll = false;
        setTimeout(() => canScroll = true, delay);
      }
    };

    // Touch support
    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (!canScroll || isAnimatingRef.current) return; // ✅ Check animation lock
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = touchStartX - touchEndX;

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          setGalleryIndex((prev) => Math.min(prev + 1, galleryData.length - 1));
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
  }, [isVisible, galleryData.length, onClose]);

  // ✅ FIXED: GSAP gallery animation with animation lock
  useEffect(() => {
    if (!isVisible) return;

    const galleryItems = galleryItemRefs.current;
    const prevIndex = prevGalleryIndexRef.current;
    const currentIndex = galleryIndex;
    const currentItem = galleryItems[currentIndex];

    if (!currentItem || isAnimatingRef.current) return; // ✅ Prevent double animations

    // ✅ Set animation lock
    isAnimatingRef.current = true;

    // Kill any existing animations on the current item
    gsap.killTweensOf(currentItem);

    gsap.set(currentItem, { zIndex: 10, display: 'flex', autoAlpha: 1 });

    const currentData = galleryData[currentIndex];
    const animationDirection = currentData?.animationDirection || "bottom-to-top";

    // Create the animation with completion callback
    let animation;
    switch (animationDirection) {
      case "bottom-to-top":
        animation = gsap.fromTo(currentItem, 
          { yPercent: 100 }, 
          { 
            yPercent: 0, 
            duration: 1, 
            ease: "power2.out",
            onComplete: () => {
              isAnimatingRef.current = false; // ✅ Release animation lock
            }
          }
        );
        break;
      case "left-to-right":
        animation = gsap.fromTo(currentItem, 
          { xPercent: -100 }, 
          { 
            xPercent: 0, 
            duration: 1, 
            ease: "power2.out",
            onComplete: () => {
              isAnimatingRef.current = false; // ✅ Release animation lock
            }
          }
        );
        break;
      case "right-to-left":
        animation = gsap.fromTo(currentItem, 
          { xPercent: 100 }, 
          { 
            xPercent: 0, 
            duration: 1, 
            ease: "power2.out",
            onComplete: () => {
              isAnimatingRef.current = false; // ✅ Release animation lock
            }
          }
        );
        break;
      case "top-to-bottom":
        animation = gsap.fromTo(currentItem, 
          { yPercent: -100 }, 
          { 
            yPercent: 0, 
            duration: 1, 
            ease: "power2.out",
            onComplete: () => {
              isAnimatingRef.current = false; // ✅ Release animation lock
            }
          }
        );
        break;
      default:
        animation = gsap.fromTo(currentItem, 
          { yPercent: 100 }, 
          { 
            yPercent: 0, 
            duration: 1, 
            ease: "power2.out",
            onComplete: () => {
              isAnimatingRef.current = false; // ✅ Release animation lock
            }
          }
        );
    }

    galleryItems.forEach((item, idx) => {
      if (!item) return;
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
  }, [galleryIndex, isVisible]); // ✅ Removed galleryData from dependencies

  // Text animation logic
  useEffect(() => {
    if (isVisible) {
      setShowText(false);
      const timer = setTimeout(() => setShowText(true), 700);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [isVisible, galleryIndex]);

  useEffect(() => {
    if (showText && textRefs.current[galleryIndex]) {
      const currentTextRef = textRefs.current[galleryIndex];
      const currentData = galleryData[galleryIndex];
      
      if (!currentData.useSimpleText) {
        const letters = currentTextRef.querySelectorAll(".letter");
        const words = currentTextRef.querySelectorAll(".word");
        
        gsap.to(currentTextRef, { opacity: 1, duration: 0.1 });
        gsap.fromTo(letters, { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.5, ease: "sine.out" });
        
        gsap.set(words, { opacity: 0 });
        const headingDuration = 1.0 + (letters.length * 0.1);
        const paragraphDelay = headingDuration - 0.5;
        
        gsap.to(words, { 
          opacity: 1, 
          delay: paragraphDelay,
          duration: 1,      
          ease: "power2.out"   
        });
      } else {
        const words = currentTextRef.querySelectorAll(".word");
        gsap.to(currentTextRef, { opacity: 1, duration: 0.1 });
        gsap.fromTo(words, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" });
      }
    }
  }, [showText, galleryIndex]);

  if (!isVisible) return null;

  return (
    <div className="single-image-gallery-container">
      {/* Gallery Progress Indicator */}
      <div className="gallery-progress">
        {galleryData.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i === galleryIndex ? 'active' : ''}`}
            onClick={() => {
              if (!isAnimatingRef.current) { // ✅ Only allow clicks when not animating
                setGalleryIndex(i);
              }
            }}
          />
        ))}
      </div>

      {/* Close Button */}
      <button 
        className="gallery-close-btn"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        ×
      </button>

      {/* Gallery Items */}
      {galleryData.map((item, index) => (
        <div 
          key={index}
          ref={el => galleryItemRefs.current[index] = el} 
          className="gallery-item" 
          style={{ 
            display: galleryIndex === index ? 'flex' : 'none', 
            position: 'relative' 
          }}
        >
          <img
            ref={el => imgRefs.current[index] = el}
            src={item.src}
            alt={item.alt}
            className={item.className}
          />
          
          {showText && galleryIndex === index && (
            <div 
              ref={el => textRefs.current[index] = el} 
              className={item.textOverlayClass}
            >
              <h2 style={{ 
                margin: 0, 
                lineHeight: 1.1, 
                padding: 0,
                ...(item.hasMarginTop && { marginTop: '16px' })
              }}>
                {item.useSimpleText ? item.heading : splitTextLetters(item.heading)}
              </h2>
              <p style={{ 
                margin: 0, 
                lineHeight: 1.1, 
                padding: 0,
                ...(item.hasMarginTop && { marginTop: '16px' })
              }}>
                {item.useSimpleText ? item.description : splitTextWords(item.description)}
              </p>
              {item.extraContent && item.extraContent.map((content, idx) => (
                <p key={idx} style={{ margin: 0, lineHeight: 1.1, padding: 0 }}>
                  {content}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Gallery;
