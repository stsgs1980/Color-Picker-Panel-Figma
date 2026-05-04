interface ColorVariantsListProps {
  colors: string[];
  onColorSelect?: (color: string, index: number) => void;
}

export function ColorVariantsList({ colors, onColorSelect }: ColorVariantsListProps) {
  const labels = ["Базовый цвет", "Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"];

  return (
    <div className="space-y-1.5">
      <div className="text-xs mb-2">Основной Цвет:</div>
      {colors.map((color, index) => (
        <div
          key={index}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-1 rounded transition-colors"
          onClick={() => onColorSelect?.(color, index)}
        >
          <div
            className="w-8 h-8 rounded border border-gray-600 flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <div className="text-xs text-gray-400">{labels[index]}</div>
        </div>
      ))}
    </div>
  );
}