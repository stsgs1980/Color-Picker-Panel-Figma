import { useState, useMemo } from "react";
import { ColorPicker } from "./components/ColorPicker";
import { ContrastPicker } from "./components/ContrastPicker";
import { ColorVariantsList } from "./components/ColorVariantsList";
import { ColorSchemePreview } from "./components/ColorSchemePreview";
import { ColorPalette } from "./components/ColorPalette";
import { ContrastValidator } from "./components/ContrastValidator";
import { 
  hexToHsl, 
  hslToHex, 
  colorPresets, 
  getComplementaryColor,
  adaptColorForTheme,
  getColorName,
  DARK_BG
} from "./utils/colorUtils";

type ViewMode = "palettes" | "correction";
type PreviewMode = "light" | "dark";

export default function App() {
  // Theme mode
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");

  // Color state (using HSL for easier manipulation)
  const [hue, setHue] = useState(0); // Red
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  // Secondary color state
  const [secondaryHue, setSecondaryHue] = useState(180); // Complementary to red (cyan)
  const [useAutoSecondary, setUseAutoSecondary] = useState(true);

  // Contrast/brightness controls
  const [contrast, setContrast] = useState(50);
  const [brightness, setBrightness] = useState(50);

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>("palettes");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("light");
  const [selectedPreset, setSelectedPreset] = useState<string>(
    "Схема по умолчанию"
  );
  const [isPresetOpen, setIsPresetOpen] = useState(false);

  // Calculate base color
  const baseColor = useMemo(() => {
    return hslToHex(hue, saturation, lightness);
  }, [hue, saturation, lightness]);

  // Calculate adapted colors for current preview mode
  const adaptedPrimaryHSL = useMemo(() => {
    return adaptColorForTheme(hue, saturation, lightness, previewMode === "dark");
  }, [hue, saturation, lightness, previewMode]);

  const adaptedPrimaryColor = useMemo(() => {
    return hslToHex(adaptedPrimaryHSL.h, adaptedPrimaryHSL.s, adaptedPrimaryHSL.l);
  }, [adaptedPrimaryHSL]);

  // Calculate secondary color (complementary or manual)
  const secondaryColor = useMemo(() => {
    const actualHue = useAutoSecondary ? (hue + 180) % 360 : secondaryHue;
    const adaptedSecondary = adaptColorForTheme(actualHue, saturation, lightness, previewMode === "dark");
    return hslToHex(adaptedSecondary.h, adaptedSecondary.s, adaptedSecondary.l);
  }, [hue, saturation, lightness, secondaryHue, useAutoSecondary, previewMode]);

  // Get secondary color HSL for display purposes
  const secondaryColorHSL = useMemo(() => {
    const actualHue = useAutoSecondary ? (hue + 180) % 360 : secondaryHue;
    return adaptColorForTheme(actualHue, saturation, lightness, previewMode === "dark");
  }, [hue, saturation, lightness, secondaryHue, useAutoSecondary, previewMode]);

  // Generate color variants with theme adaptation
  const colorVariants = useMemo(() => {
    const adjustedSaturation = adaptedPrimaryHSL.s * (contrast / 50);
    const adjustedLightness = adaptedPrimaryHSL.l * (brightness / 50);

    const variants: string[] = [];

    // Generate 5 variants
    const lightnessOffsets = [30, 15, 0, -15, -30];

    for (const offset of lightnessOffsets) {
      const variantLightness = Math.max(
        0,
        Math.min(100, adjustedLightness + offset)
      );
      variants.push(hslToHex(adaptedPrimaryHSL.h, Math.min(100, adjustedSaturation), variantLightness));
    }

    return variants;
  }, [adaptedPrimaryHSL, contrast, brightness]);

  // Handle preset selection
  const handlePresetSelect = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = colorPresets.find((p) => p.name === presetName);
    if (preset && preset.colors.length > 0) {
      const hsl = hexToHsl(preset.colors[0]);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
    }
    setIsPresetOpen(false);
  };

  // Handle color change from picker
  const handleColorChange = (s: number, l: number) => {
    setSaturation(s);
    setLightness(l);
  };

  // Handle contrast change
  const handleContrastChange = (c: number, b: number) => {
    setContrast(c);
    setBrightness(b);
  };

  // Handle base color input
  const handleBaseColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      const hsl = hexToHsl(hex);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        themeMode === "dark" ? "bg-[#2a2a2a]" : "bg-gray-100"
      } text-white p-4 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header with theme toggle */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl text-[#1e2939] font-[Geist]">
            Составная панель выбора цветов
          </h1>
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setThemeMode("light")}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                themeMode === "light"
                  ? "bg-gray-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Светлая
            </button>
            <button
              onClick={() => setThemeMode("dark")}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                themeMode === "dark"
                  ? "bg-gray-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Темная
            </button>
          </div>
        </div>

        {/* Info panel about design rules */}
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 mb-2 bg-[#1e2939]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-blue-400 font-medium mb-1">60% — Neutral</div>
              <div className="text-gray-300 text-xs">Фон и второстепенные блоки. В темной теме используется {DARK_BG} вместо чистого черного.</div>
            </div>
            <div>
              <div className="text-blue-400 font-medium mb-1">30% — Primary</div>
              <div className="text-gray-300 text-xs">Брендовые элементы, заголовки. Автоадаптация: яркий для светлой темы, пастельный для темной.</div>
            </div>
            <div>
              <div className="text-blue-400 font-medium mb-1">10% — Secondary</div>
              <div className="text-gray-300 text-xs">CTA, акценты. Комплементарный цвет обеспечивает контраст и гармонию.</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-4">
          {/* Left panel - Controls */}
          <div className="rounded-lg p-4 bg-[#1e2939]">
            {/* Tab switcher */}
            <div className="flex gap-4 mb-4 border-b border-gray-700">
              <button
                onClick={() => setViewMode("palettes")}
                className={`pb-2 px-3 text-sm transition-colors ${
                  viewMode === "palettes"
                    ? "border-b-2 border-blue-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Палитры
              </button>
              
            </div>

            {/* Content based on view mode */}
            <div className="space-y-4">
              {/* Preset selector */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">
                  Пресет:
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsPresetOpen(!isPresetOpen)}
                    className="w-full bg-gray-700 text-white text-sm px-3 py-1.5 rounded flex items-center justify-between hover:bg-gray-600 transition-colors"
                  >
                    <span>{selectedPreset}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isPresetOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isPresetOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded shadow-lg max-h-64 overflow-y-auto">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => handlePresetSelect(preset.name)}
                          className={`w-full text-left text-sm px-3 py-1.5 hover:bg-blue-600 transition-colors ${
                            selectedPreset === preset.name
                              ? "bg-blue-600 text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Base color input */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">
                  Основной цвет (Primary): {getColorName(hue, saturation, lightness)}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => {
                      const hsl = hexToHsl(e.target.value);
                      setHue(hsl.h);
                      setSaturation(hsl.s);
                      setLightness(hsl.l);
                    }}
                    className="w-12 h-12 rounded border border-gray-600 cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={baseColor.toUpperCase()}
                      onChange={handleBaseColorInput}
                      className="w-full bg-gray-700 text-white text-sm px-3 py-1.5 rounded border border-gray-600 focus:border-blue-500 outline-none"
                      placeholder="#FF0000"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {previewMode === "dark" 
                    ? `Автоадаптировано для темной темы: ${getColorName(adaptedPrimaryHSL.h, adaptedPrimaryHSL.s, adaptedPrimaryHSL.l)} (менее насыщенный)` 
                    : `Яркий цвет для светлой темы: ${getColorName(hue, saturation, lightness)}`}
                </div>
              </div>

              {/* Secondary color input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-gray-400">
                    Вторичный цвет (Secondary): {getColorName(secondaryColorHSL.h, secondaryColorHSL.s, secondaryColorHSL.l)}
                  </label>
                  <button
                    onClick={() => setUseAutoSecondary(!useAutoSecondary)}
                    className={`text-xs px-2 py-0.5 rounded transition-colors ${
                      useAutoSecondary 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-700 text-gray-400 hover:text-white"
                    }`}
                  >
                    {useAutoSecondary ? "Авто" : "Вручную"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-12 h-12 rounded border border-gray-600"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={secondaryColor.toUpperCase()}
                      disabled
                      className="w-full bg-gray-700 text-white text-sm px-3 py-1.5 rounded border border-gray-600 opacity-60"
                    />
                  </div>
                </div>
                {useAutoSecondary && (
                  <div className="text-xs text-gray-500 mt-1">
                    {previewMode === "dark" 
                      ? `Автоадаптировано для темной темы: Комплементарный ${getColorName(secondaryColorHSL.h, secondaryColorHSL.s, secondaryColorHSL.l)} (противоположный в цветовом круге)`
                      : `Комплементарный цвет: ${getColorName((hue + 180) % 360, saturation, lightness)} (противоположный в цветовом круге)`}
                  </div>
                )}
                {!useAutoSecondary && (
                  <div className="mt-2">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={secondaryHue}
                      onChange={(e) => setSecondaryHue(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, 
                          hsl(0, 100%, 50%), 
                          hsl(60, 100%, 50%), 
                          hsl(120, 100%, 50%), 
                          hsl(180, 100%, 50%), 
                          hsl(240, 100%, 50%), 
                          hsl(300, 100%, 50%), 
                          hsl(360, 100%, 50%))`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Color Variants List */}
              <div>
                <ColorVariantsList
                  colors={colorVariants}
                  onColorSelect={(color) => {
                    const hsl = hexToHsl(color);
                    setHue(hsl.h);
                    setSaturation(hsl.s);
                    setLightness(hsl.l);
                  }}
                />
              </div>

              {/* Both pickers side by side */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* HSL Color Picker */}
                <div className="flex flex-col items-center">
                  <ColorPicker
                    hue={hue}
                    saturation={saturation}
                    lightness={lightness}
                    onColorChange={handleColorChange}
                    title="Схема: Насыщенность/Яркость"
                  />
                </div>

                {/* Contrast Picker */}
                <div className="flex flex-col items-center">
                  <ContrastPicker
                    contrast={contrast}
                    brightness={brightness}
                    onContrastChange={handleContrastChange}
                    title="Схема: Контрастность"
                  />
                </div>
              </div>

              {/* Hue slider */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">
                  Оттенок: {hue}° ({getColorName(hue, saturation, lightness)})
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) => setHue(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(0, 100%, 50%), 
                      hsl(60, 100%, 50%), 
                      hsl(120, 100%, 50%), 
                      hsl(180, 100%, 50%), 
                      hsl(240, 100%, 50%), 
                      hsl(300, 100%, 50%), 
                      hsl(360, 100%, 50%))`,
                  }}
                />
              </div>

              {/* Saturation slider */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">
                  Насыщенность: {saturation}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Управляет интенсивностью цвета (0% = серый, 100% = максимально яркий)
                </div>
              </div>

              {/* Contrast slider */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">
                  Контрастность: {contrast}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Влияет на разницу между цветовыми вариантами
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Preview */}
          <div className="space-y-4">
            {/* Color Scheme Display */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg mb-3 text-gray-200">
                Просмотр цветовой схемы
              </h2>
              <ColorPalette colors={colorVariants} />
            </div>

            {/* Contrast Validation */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg mb-3 text-gray-200">
                Валидация контрастности
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-400 mb-2">Primary на белом фоне:</div>
                  <ContrastValidator 
                    foreground={adaptedPrimaryColor} 
                    background="#ffffff" 
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2">Primary на темном фоне:</div>
                  <ContrastValidator 
                    foreground={adaptedPrimaryColor} 
                    background={DARK_BG} 
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2">Secondary на белом фоне:</div>
                  <ContrastValidator 
                    foreground={secondaryColor} 
                    background="#ffffff" 
                  />
                </div>
              </div>
            </div>

            {/* Preview section */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg text-gray-200">Превью темы (60-30-10)</h2>
                <div className="flex gap-1 bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewMode("light")}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      previewMode === "light"
                        ? "bg-gray-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Пример светлой страницы
                  </button>
                  <button
                    onClick={() => setPreviewMode("dark")}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      previewMode === "dark"
                        ? "bg-gray-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Пример темной страницы
                  </button>
                </div>
              </div>

              {previewMode === "light" && (
                <ColorSchemePreview 
                  colors={colorVariants} 
                  secondaryColor={secondaryColor}
                  mode="light" 
                />
              )}

              {previewMode === "dark" && (
                <ColorSchemePreview 
                  colors={colorVariants} 
                  secondaryColor={secondaryColor}
                  mode="dark" 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}