import { useEffect, useState, useRef, useCallback } from "react";
import Nav from "./Component/Nav";
import "./Component/BuildingScroll.css"; // ✅ Import the CSS file

const Page = () => {
    const [activeGroupeMarker, setActiveGroupeMarker] = useState("");
    const [activeGroupDropbox, setActiveGroupDropbox] = useState("");
    const [activeMarker, setActiveMarker] = useState("");
    const [showNav, setShowNav] = useState(true);
    const [showSingleImage, setShowSingleImage] = useState(false);
    const [showText, setShowText] = useState(false);
    
    // ✅ Gallery states - EXACT same as home page
    const [galleryIndex, setGalleryIndex] = useState(0);

    // ✅ Refs for all gallery items - EXACT same as home page
    const galleryItemRef1 = useRef(null);
    const galleryItemRef2 = useRef(null);
    const galleryItemRef3 = useRef(null);
    const galleryItemRef4 = useRef(null);
    const galleryItemRef5 = useRef(null);
    const galleryItemRef6 = useRef(null);
    const galleryItemRef7 = useRef(null);
    const galleryItemRef8 = useRef(null);

    const imgRef1 = useRef(null);
    const imgRef2 = useRef(null);
    const imgRef3 = useRef(null);
    const imgRef4 = useRef(null);
    const imgRef5 = useRef(null);
    const imgRef6 = useRef(null);
    const imgRef7 = useRef(null);
    const imgRef8 = useRef(null);

    const textRef1 = useRef(null);
    const textRef2 = useRef(null);
    const textRef3 = useRef(null);
    const textRef4 = useRef(null);
    const textRef5 = useRef(null);
    const textRef6 = useRef(null);
    const textRef7 = useRef(null);
    const textRef8 = useRef(null);

    // ✅ Text animation functions - EXACT same as home page
    const splitTextWords = (text) =>
        text.split(" ").map((word, i) => (
            <span key={i} className="word" style={{ display: "inline-block", marginRight: "0.3em" }}>
                {word}
            </span>
        ));

    const splitTextLetters = (text) => {
        const words = text.split(" ");
        return words.map((word, wi) => (
            <span key={wi} className="word" style={{ display: "inline-block", marginRight: "0.3em" }}>
                {word.split("").map((letter, li) => (
                    <span key={li} className="letter" style={{ display: "inline-block" }}>
                        {letter}
                    </span>
                ))}
            </span>
        ));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNav(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const textTimer = setTimeout(() => {
            setShowText(true);
        }, 1500);

        return () => clearTimeout(textTimer);
    }, []);

    // ✅ Gallery click handler - triggers gallery mode
    const handleGalleryClick = () => {
        setShowSingleImage(true);
        setGalleryIndex(0);
    };

    // ✅ Gallery close handler
    const handleGalleryClose = () => {
        setShowSingleImage(false);
    };

    const debugSetShowNav = (value) => {
        console.log("🆕 YourNewPage.jsx - setShowNav called with:", value);
        setShowNav(value);
    };

    const markersGroup = {
        Home: null,
        "Floor plans": null,
        View: null,
        Gallery: null,
        Map: null
    };

    const markers = [];

    const clickHandle = (path) => {
        setActiveMarker(path);
        console.log("Clicked on:", path);
    };

    return (
        <>
            {/* ✅ Full screen container with image as background */}
            <div 
                className="fixed inset-0 w-full h-full"
                style={{
                    backgroundImage: "url('/img8_crop.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >
                {/* ✅ Logo at top right */}
                <div className="fixed top-4 right-4 z-50">
                    <a href="/" className="block">
                        <img 
                            src="/logo.svg" 
                            alt="Logo" 
                            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain
                                       hover:scale-105 transition-transform duration-300 ease-in-out
                                       drop-shadow-lg"
                            style={{
                                filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"
                            }}
                        />
                    </a>
                </div>

                {/* ✅ Text Overlay */}
                <div 
                    className={`
                        absolute top-1/2 right-[8%] z-20 text-right
                        transform -translate-y-1/2 
                        text-gray-700
                        transition-all duration-1000 ease-out
                        ${showText 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-12'
                        }
                        
                        w-[40%] max-w-[40%]
                        
                        sm:right-[6%] sm:w-[45%] sm:max-w-[45%]
                        md:right-[8%] md:w-[40%] md:max-w-[40%]
                    `}
                    style={{ color: 'rgb(83, 68, 68)' }}
                >
                    <h2 className="
                        text-lg font-extrabold mb-2 relative
                        sm:text-lg md:text-xl lg:text-2xl xl:text-2xl
                         leading-snug text-start
                    " style={{
                        fontFamily:"Zap"
                    }}>
                        <span className="block">A Private Sky Mansion, Designed to Tower Over the City.</span>
                        
                        <div 
                            className={`
                                w-full h-0.5 bg-yellow-500 mt-3 mb-0 ml-auto
                                transform origin-left transition-transform duration-1000 ease-out
                                ${showText ? 'scale-x-100 delay-500' : 'scale-x-0'}
                            `}
                        />
                    </h2>

                    <p className="
                        text-left text-sm leading-relaxed
                        sm:text-sm md:text-base lg:text-lg xl:text-lg
                    " style={{
                        fontFamily:"Goth"
                    }}>
                        Craft your legacy in Mumbai's most prestigious enclave.
                    </p>
                </div>

                {/* ✅ Nav component */}
                <Nav
                    showNav={showNav}
                    setActiveGroupeMarker={setActiveGroupeMarker}
                    setActiveGroupDropbox={setActiveGroupDropbox}
                    setActiveMarker={setActiveMarker}
                    activeGroupDropbox={activeGroupDropbox}
                    activeMarker={activeMarker}
                    markersGroup={markersGroup}
                    markers={markers}
                    clickHandle={clickHandle}
                    setShowSingleImage={setShowSingleImage}
                />
            </div>

            {/* ✅ EXACT SAME GALLERY as Home Page */}
            {showSingleImage && (
                <div className="single-image-gallery-container">
                    {/* Gallery Progress Indicator - EXACT same */}
                    <div className="gallery-progress">
                        {Array.from({ length: 8 }, (_, i) => (
                            <div
                                key={i}
                                className={`progress-dot ${i === galleryIndex ? 'active' : ''}`}
                                onClick={() => setGalleryIndex(i)}
                            />
                        ))}
                    </div>

                    {/* Close Button */}
                    <button 
                        className="gallery-close-btn"
                        onClick={handleGalleryClose}
                    >
                        ×
                    </button>

                    {/* Gallery Item 1 - Car Section */}
                    <div ref={galleryItemRef1} className="gallery-item" style={{ display: 'flex', position: 'relative' }}>
                        <img
                            ref={imgRef1}
                            src="/Gallery/carsection.jpg"
                            alt="Luxury Car Parking"
                            className="single-gallery-image"
                        />
                        
                        {showText && galleryIndex === 0 && (
                            <div ref={textRef1} className="single-image-text-overlay">
                                <h2 style={{ margin: 0, lineHeight: 1.1, padding: 0 }}>
                                    {splitTextLetters("FOR THOSE WHO RESIGN, A VAULT FOR YOUR FLEET.")}
                                </h2>
                                <p style={{ margin: 0, lineHeight: 1.1, padding: 0 }}>
                                    {splitTextWords("For every marque you collect, a sanctuary that reflects your exceptional lifestyle.")}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Gallery Item 2 */}
                    <div ref={galleryItemRef2} className="gallery-item" style={{ display: (galleryIndex === 1 || galleryIndex === 0 || galleryIndex === 2) ? 'flex' : 'none' }}>
                        <img ref={imgRef2} src="/Gallery/img2_2.jpg" alt="Skyline View" className="sec-gallery-image" />
                        {showText && galleryIndex === 1 && (
                            <div ref={textRef2} className="sec-image-text-overlay from-left">
                                <h2 style={{ margin: 0, lineHeight: 1.1, padding: 0}}>
                                    {splitTextLetters("MAKE A STATEMENT EVEN BEFORE YOU STEP IN.")}
                                </h2>
                                <p style={{ margin: 0, lineHeight: 1.1, padding: 0 }}>
                                    {splitTextWords("Your arrival marks a moment of distinction a drive that sets the stage for the world within.")}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Gallery Item 3 */}
                    <div ref={galleryItemRef3} className="gallery-item" style={{ display: galleryIndex === 2 ? 'flex' : 'none' }}>
                        <img ref={imgRef3} src="/Gallery/img3_2.jpg" alt="Rooftop Retreat" className="third-gallery-image" />
                        {showText && galleryIndex === 2 && (
                            <div ref={textRef3} className="third-image-text-overlay from-right">
                                <h2 style={{ margin: 0, lineHeight: 1.1, padding: 0}}>
                                    {splitTextLetters("ANY MORE EXPANSIVE, AND YOU MIGHT NEED A GPS TO NAVIGATE.")}
                                </h2>
                                <p style={{ margin: 0, lineHeight: 1.1, padding: 0 }}>
                                    {splitTextWords("A testament to impeccable taste, Malabar embodies the grandeur of your cherished chateau and the warmth of an ancestral manor.")}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Gallery Item 4 */}
                    <div ref={galleryItemRef4} className="gallery-item" style={{ display: galleryIndex === 3 ? 'flex' : 'none' }}>
                        <img ref={imgRef4} src="/Gallery/img4_2.jpg" alt="Luxury Suite" className="fourth-gallery-image" />
                        {showText && galleryIndex === 3 && (
                            <div ref={textRef4} className="fourth-image-text-overlay from-top">
                                <h2 style={{ margin: 0, lineHeight: 1.1, padding: 0 }}>
                                    {splitTextLetters("TWO REALMS. ONE PRIVILEGE: YOURS.")}
                                </h2>
                                <p style={{ margin: 0, lineHeight: 1.1, padding: 0 }}>
                                    {splitTextWords("Conversations held in rooms no one enters unannounced. Sunset rituals that require no scheduling. Here, every inch is crafted for those to whom silence responds. At 'Runwal Malabar', the clubhouse isn't something you merely access  it's something others do not.")}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Gallery Item 5 */}
                    <div ref={galleryItemRef5} className="gallery-item" style={{ display: galleryIndex === 4 ? 'flex' : 'none' }}>
                        <img ref={imgRef5} src="/Gallery/img6_2.jpg" alt="Unique Section" className="fifth-gallery-image" />
                        {showText && galleryIndex === 4 && (
                            <div ref={textRef5} className="fifth-image-text-overlay from-bottom">
                                <h2 style={{ margin: 0, lineHeight: 1.1, padding: 0}}>
                                    {splitTextLetters("THIS IS YOUR MOMENT.")}
                                </h2>
                                <p style={{ marginTop: '16px', marginBottom: 0, marginLeft: 0, marginRight: 0, lineHeight: 1.1, padding: 0 }}>
                                    {splitTextWords("'Runwal Malabar' is the stage set for your legacy a realm where your place in history is imagined and realized. While some legacies stand firm on the ground, yours reaches for the sky.")}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Gallery Item 6 */}
                    <div ref={galleryItemRef6} className="gallery-item" style={{ display: galleryIndex === 5 ? 'flex' : 'none' }}>
                        <img ref={imgRef6} src="/Gallery/img7_2.jpg" alt="Grand Lobby" className="sixth-gallery-image" />
                        {showText && galleryIndex === 5 && (
                            <div ref={textRef6} className="sixth-image-text-overlay from-right">
                                <h2 style={{ margin: 0, lineHeight: 1.1, padding: 0}}>
                                    {splitTextLetters("A CREATION WORTHY OF PICASSO'S SIGNATURE.")}
                                </h2>
                                <p style={{ marginTop: '16px', marginBottom: 0, marginLeft: 0, marginRight: 0, lineHeight: 1.1, padding: 0 }}>
                                    {splitTextWords("The entrance lounge a modernist sculpture capturing shifting lights and shadows, echoing Cubist artistry.")}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Gallery Item 7 - Your main page image */}
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
                            <div
                                ref={textRef7}
                                className={`seventh-image-text-overlay from-bottom ${showText && galleryIndex === 6 ? "show" : ""}`}
                            >
                                <h2>A Private Sky Mansion, Designed to Tower Over the City.</h2>
                                <p>Craft your legacy in Mumbai's most prestigious enclave.</p>
                            </div>
                        )}
                    </div>

                    {/* Gallery Item 8 - Contact */}
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
        </>
    );
};

export default Page;
