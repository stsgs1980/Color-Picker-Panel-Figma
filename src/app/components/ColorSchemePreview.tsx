import { getContrastColor, DARK_BG, DARK_SURFACE_1, DARK_SURFACE_2 } from "../utils/colorUtils";

interface ColorSchemePreviewProps {
  colors: string[];
  secondaryColor: string;
  mode: "light" | "dark";
}

export function ColorSchemePreview({ colors, secondaryColor, mode }: ColorSchemePreviewProps) {
  const [baseColor, variant1, variant2, variant3, variant4] = colors;

  // 60-30-10 Rule Implementation
  // 60% Neutral (background and main content areas)
  const neutralBg = mode === "light" ? "#f5f5f5" : DARK_BG;
  const neutralSurface = mode === "light" ? "#ffffff" : DARK_SURFACE_1;
  const neutralText = mode === "light" ? "#1a1a1a" : "#e0e0e0";
  
  // 30% Primary (brand elements, headers)
  const primaryColor = baseColor;
  
  // 10% Secondary (CTAs, accents)
  const accentColor = secondaryColor;

  return (
    <div
      className="w-full border rounded overflow-hidden"
      style={{ 
        backgroundColor: neutralBg,
        color: neutralText,
        borderColor: mode === "light" ? "#e0e0e0" : "#404040"
      }}
    >
      {/* Header - 30% Primary */}
      <div
        className="p-4 flex items-center justify-between"
        style={{ backgroundColor: primaryColor }}
      >
        <div
          className="text-2xl font-serif italic"
          style={{ color: getContrastColor(primaryColor) }}
        >
          lorem ipsum
        </div>
        <div style={{ color: getContrastColor(primaryColor) }}>
          <div className="text-xs">DUIS AUTE</div>
          <div className="text-xs">IRURE DOLOR</div>
        </div>
      </div>

      {/* Color bar - showing palette */}
      <div className="flex h-3">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Content area - 60% Neutral background */}
      <div className="p-6" style={{ backgroundColor: neutralBg }}>
        <div className="grid grid-cols-2 gap-6">
          {/* Left column */}
          <div>
            <div className="mb-4 font-medium" style={{ color: primaryColor }}>
              Mollit Anim
            </div>
            <div className="text-sm mb-4 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris.
            </div>
            
            {/* CTA Button - 10% Secondary */}
            <button
              className="px-4 py-2 rounded text-sm font-medium mb-4 transition-opacity hover:opacity-90"
              style={{ 
                backgroundColor: accentColor,
                color: getContrastColor(accentColor)
              }}
            >
              Узнать больше
            </button>

            <div className="mb-2 text-sm" style={{ color: primaryColor }}>
              Lorem
            </div>
            <div className="text-xs leading-relaxed mb-4">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
              dolore eu fugiat nulla pariatur.
            </div>
            <div className="mb-2 text-sm" style={{ color: primaryColor }}>
              Ipsum
            </div>
            <div className="text-xs leading-relaxed mb-4">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </div>

            {/* Card with elevation - Neutral surface */}
            <div 
              className="mt-6 p-4 rounded shadow-sm" 
              style={{ 
                backgroundColor: neutralSurface,
                borderLeft: `4px solid ${primaryColor}`
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke={getContrastColor(primaryColor)}
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeWidth="2" d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs mb-1 font-medium" style={{ color: primaryColor }}>
                    Duis aute irure dolor
                  </div>
                  <div className="text-xs space-y-0.5" style={{ color: neutralText }}>
                    <div>• Lorem ipsum</div>
                    <div>• Dolor sit amet</div>
                    <div>• Consectetur adipiscing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Cards with neutral surfaces */}
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="p-4 rounded shadow-sm"
                style={{ backgroundColor: neutralSurface }}
              >
                <div className="flex gap-3">
                  <div className="text-2xl" style={{ color: primaryColor }}>
                    ■
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 font-medium" style={{ color: primaryColor }}>
                      Lorem ipsum dolor sit amet
                    </div>
                    <div className="text-xs mb-2" style={{ color: accentColor }}>
                      Duis aute • Категория
                    </div>
                    <div className="text-xs leading-relaxed mb-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et aliqua.
                    </div>
                    <button 
                      className="text-xs hover:underline transition-all"
                      style={{ color: accentColor }}
                    >
                      ut labore »
                    </button>
                    {item === 2 && (
                      <div 
                        className="text-xs p-2 rounded mt-3" 
                        style={{ 
                          backgroundColor: accentColor + '20',
                          borderLeft: `3px solid ${accentColor}`
                        }}
                      >
                        <div style={{ color: accentColor }}>
                          ⚡ Adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - 30% Primary accent */}
      <div
        className="h-2"
        style={{ backgroundColor: primaryColor }}
      />
    </div>
  );
}