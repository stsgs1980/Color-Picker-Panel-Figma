import { getContrastRatio, passesWCAG } from "../utils/colorUtils";

interface ContrastValidatorProps {
  foreground: string;
  background: string;
}

export function ContrastValidator({ foreground, background }: ContrastValidatorProps) {
  const ratio = getContrastRatio(foreground, background);
  const passesAA = passesWCAG(foreground, background, 'AA', false);
  const passesAAA = passesWCAG(foreground, background, 'AAA', false);
  const passesAALarge = passesWCAG(foreground, background, 'AA', true);

  return (
    <div className="bg-gray-700 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Контрастность:</span>
        <span className="text-sm text-white font-medium">{ratio.toFixed(2)}:1</span>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${passesAA ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-300">WCAG AA (обычный текст)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${passesAALarge ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-300">WCAG AA (крупный текст)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${passesAAA ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-300">WCAG AAA</span>
        </div>
      </div>

      {!passesAA && (
        <div className="text-xs text-yellow-400 mt-2 p-2 bg-yellow-900/20 rounded">
          ⚠️ Недостаточная контрастность для доступности
        </div>
      )}
    </div>
  );
}
