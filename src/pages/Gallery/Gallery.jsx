import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Gallery = () => {
  const containerRef = useRef(null);
  const slidesRef = useRef(null);

  const slides = [
    {
      id: 1,
      bgImage: '/slides/background.jpg', // Has background
      content: 'Slide 1 Content',
      textColor: 'text-white'
    },
    {
      id: 2,
      bgImage: null, // No background
      content: 'Slide 2 Content',
      textColor: 'text-black'
    },
    {
      id: 3,
      bgImage: '/slides/background.jpg', // Has background
      content: 'Slide 3 Content',
      textColor: 'text-white'
    },
    {
      id: 4,
      bgImage: null, // No background
      content: 'Slide 4 Content',
      textColor: 'text-black'
    },
  ];

  useGSAP(() => {
    const slides = gsap.utils.toArray('.slide');
    
    gsap.to(slides, {
      xPercent: -100 * (slides.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (slides.length - 1),
        end: () => `+=${slidesRef.current.scrollWidth}`
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="h-screen overflow-hidden">
      <div ref={slidesRef} className="flex h-full">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="slide w-screen h-full flex-shrink-0 flex items-center justify-center"
            style={{
              backgroundImage: slide.bgImage ? `url(${slide.bgImage})` : 'none',
              backgroundColor: slide.bgImage ? 'transparent' : '#f0f0f0',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <h2 className={`text-5xl font-bold ${slide.textColor}`}>
              {slide.content}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
