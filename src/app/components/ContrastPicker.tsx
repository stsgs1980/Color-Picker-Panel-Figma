import { useRef, MouseEvent } from "react";

interface ContrastPickerProps {
  contrast: number;
  brightness: number;
  onContrastChange: (contrast: number, brightness: number) => void;
  title?: string;
}

export function ContrastPicker({
  contrast,
  brightness,
  onContrastChange,
  title,
}: ContrastPickerProps) {
  const isDragging = useRef(false);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    updateContrast(e);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      updateContrast(e);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const updateContrast = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    const newContrast = (x / rect.width) * 100;
    const newBrightness = 100 - (y / rect.height) * 100;

    onContrastChange(newContrast, newBrightness);
  };

  // Calculate cursor position
  const cursorX = (contrast / 100) * 180;
  const cursorY = ((100 - brightness) / 100) * 180;

  return (
    <div>
      {title && <div className="text-xs text-gray-400 mb-2">{title}</div>}
      <div className="relative inline-block">
        <div
          className="w-[180px] h-[180px] cursor-crosshair border border-gray-600 relative"
          style={{
            background: `
              linear-gradient(to right, 
                rgb(128, 128, 128) 0%, 
                rgb(255, 255, 255) 50%, 
                rgb(128, 128, 128) 100%),
              linear-gradient(to bottom, 
                rgba(255, 255, 255, 0.5), 
                rgba(0, 0, 0, 0.5))
            `,
            backgroundBlendMode: "multiply",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Diagonal pattern overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.5) 2px,
                rgba(0, 0, 0, 0.5) 4px
              )`,
            }}
          />
        </div>
        {/* Cursor indicator */}
        <div
          className="absolute w-3 h-3 border-2 border-white rounded-full pointer-events-none"
          style={{
            left: `${cursorX}px`,
            top: `${cursorY}px`,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 0 1px black",
          }}
        />
        {/* Axis labels */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">
          Свет
        </div>
        <div className="absolute top-1/2 -left-7 -translate-y-1/2 -rotate-90 text-[10px] text-gray-400 origin-center whitespace-nowrap">
          Тень
        </div>
      </div>
    </div>
  );
}