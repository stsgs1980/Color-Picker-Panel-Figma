import { useRef, useEffect, MouseEvent } from "react";

interface ColorPickerProps {
  hue: number;
  saturation: number;
  lightness: number;
  onColorChange: (s: number, l: number) => void;
  title?: string;
}

export function ColorPicker({
  hue,
  saturation,
  lightness,
  onColorChange,
  title,
}: ColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create saturation gradient (left to right)
    for (let x = 0; x < width; x++) {
      const s = (x / width) * 100;
      const gradient = ctx.createLinearGradient(0, 0, 0, height);

      // Top: white (high lightness)
      // Bottom: black (low lightness)
      for (let y = 0; y < height; y++) {
        const l = 100 - (y / height) * 100;
        const color = hslToRgbString(hue, s, l);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [hue]);

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    updateColor(e);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (isDragging.current) {
      updateColor(e);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const updateColor = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, canvas.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, canvas.height));

    const s = (x / canvas.width) * 100;
    const l = 100 - (y / canvas.height) * 100;

    onColorChange(s, l);
  };

  // Calculate cursor position
  const cursorX = (saturation / 100) * 256;
  const cursorY = ((100 - lightness) / 100) * 256;

  return (
    <div>
      {title && <div className="text-xs text-gray-400 mb-2">{title}</div>}
      <div className="relative inline-block">
        <canvas
          ref={canvasRef}
          width={180}
          height={180}
          className="cursor-crosshair border border-gray-600"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {/* Cursor indicator */}
        <div
          className="absolute w-3 h-3 border-2 border-white rounded-full pointer-events-none"
          style={{
            left: `${cursorX * (180 / 256)}px`,
            top: `${cursorY * (180 / 256)}px`,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 0 1px black",
          }}
        />
        {/* Axis labels */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">
          Насыщенность
        </div>
        <div className="absolute top-1/2 -left-7 -translate-y-1/2 -rotate-90 text-[10px] text-gray-400 origin-center whitespace-nowrap">
          Яркость
        </div>
      </div>
    </div>
  );
}

// Helper function to convert HSL to RGB string
function hslToRgbString(h: number, s: number, l: number): string {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}