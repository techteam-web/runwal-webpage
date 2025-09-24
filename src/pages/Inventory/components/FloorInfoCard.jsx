function FloorInfoCard({ info, onClose }) {
  if (!info) return null;

  return (
    <div
      className="
        fixed
        top-4 right-4
        sm:top-6 sm:right-6
        md:top-10 md:right-10
        z-20
        max-h-[calc(100vh-8rem)]
        overflow-y-auto
      "
    >
      <div
        className="
          w-[90vw] max-w-sm
          sm:w-80 sm:max-w-none
          md:bg-[#fffde7] lg:bg-[#fffde7] xl:bg-[#fffde7]
          shadow-2xl
          rounded-xl
          p-3 sm:p-4 md:p-6
          border border-yellow-100 max-sm:backdrop-blur-sm
        "
        style={{ fontFamily: 'Zap, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-baseline justify-between mb-2 sm:mb-3 md:mb-4">
          <h2
            className="font-light text-gray-900"
            style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.75rem)', // Slightly smaller on mobile
              lineHeight: 1.1,
              fontFamily: 'Zap, sans-serif'
            }}
          >
           Floor {info.floorNumber}
          </h2>
          
          {/* ✅ Optional: Close button for mobile */}
          <button 
            onClick={onClose}
            className="
              sm:hidden 
              p-1 
              text-gray-400 
              hover:text-gray-600 
              transition-colors
            "
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="text-gray-700 space-y-1.5 sm:space-y-2">
          <p
            className="font-light text-gray-900"
            style={{ 
              fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)', // Smaller on very small screens
              fontFamily: 'Zap, sans-serif'
            }}
          >
            {info.price}
          </p>

          {/* ✅ Improved grid - single column on very small screens */}
          <div className="grid grid-cols-1 gap-1 xs:grid-cols-2 xs:gap-1.5 sm:gap-2">
            <p
              className="text-gray-600"
              style={{ 
                fontSize: 'clamp(0.75rem, 1.8vw, 0.9375rem)', // Better scaling
                fontFamily: 'Zap, sans-serif'
              }}
            >
              Area: <span className="text-gray-800 font-medium">{info.area}</span>
            </p>
            <p
              className="text-gray-600"
              style={{ 
                fontSize: 'clamp(0.75rem, 1.8vw, 0.9375rem)',
                fontFamily: 'Zap, sans-serif'
              }}
            >
              Type: <span className="text-gray-800 font-medium">{info.bhk}</span>
            </p>
            <p
              className="text-gray-600 xs:col-span-2"
              style={{ 
                fontSize: 'clamp(0.75rem, 1.8vw, 0.9375rem)',
                fontFamily: 'Zap, sans-serif'
              }}
            >
              Status: 
              <span
                className={
                  (info.availability?.toString().toLowerCase() === "true"
                    ? "text-green-700"
                    : "text-red-700") + " font-medium ml-1"
                }
              >
                {info.availability?.toString().toLowerCase() === "true"
                  ? "Available"
                  : "Sold Out"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloorInfoCard;
