import { useEffect, useState, useRef, useCallback } from "react";
import Nav from "./Component/Nav";
import "./Component/BuildingScroll.css"; // ✅ Import the CSS file
import Gallery from "./Component/Gallery";
import { useHomeReloadRedirect } from "../Views/hooks/useHomeRedirect";

const Page = () => {
    // useHomeReloadRedirect()
    const [activeGroupeMarker, setActiveGroupeMarker] = useState("");
    const [activeGroupDropbox, setActiveGroupDropbox] = useState("");
    const [activeMarker, setActiveMarker] = useState("");
    const [showNav, setShowNav] = useState(true);
    const [showSingleImage, setShowSingleImage] = useState(false);
    const [showText, setShowText] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    
   


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
    

    const markersGroup = {
        Home: null,
        "Floor plans": null,
        View: null,
        Gallery: null,
        Map: null,
        Iso: null
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
                 <Gallery
        isVisible={showGallery}
        onClose={() => setShowGallery(false)}
        startIndex={0}
      />
            </div>

           
        </>
    );
};

export default Page;
