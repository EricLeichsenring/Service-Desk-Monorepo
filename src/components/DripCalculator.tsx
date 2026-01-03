import { useState } from 'react';
import { Droplets, Calculator, X } from 'lucide-react';

interface DripCalculatorProps {
  onClose: () => void;
}

export function DripCalculator({ onClose }: DripCalculatorProps) {
  const [volume, setVolume] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('macrogotas');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const v = parseFloat(volume);
    const t = parseFloat(time);

    if (!v || !t) return;

    let res = 0;
    if (type === 'macrogotas') {
      res = v / (t * 3);
    } else {
      res = v / t;
    }
    setResult(Math.round(res));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden relative">
        
        {/* Cabeçalho */}
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 font-bold">
            <Droplets size={20} /> Calc. Gotejamento
          </div>
          <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button onClick={() => { setType('macrogotas'); setResult(null); }} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'macrogotas' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Macrogotas</button>
            <button onClick={() => { setType('microgotas'); setResult(null); }} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'microgotas' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Microgotas</button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Volume (ml)</label>
              <input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tempo (Horas)</label>
              <input type="number" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 8" />
            </div>
          </div>

          <button onClick={calculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
            <Calculator size={18} /> Calcular
          </button>

          {result !== null && (
            <div className="mt-4 bg-blue-50 border-2 border-blue-100 rounded-lg p-4 text-center">
              <p className="text-gray-600 text-sm mb-1">Resultado estimado:</p>
              <p className="text-4xl font-bold text-blue-700">{result}</p>
              <p className="text-blue-600 text-xs font-bold uppercase">{type === 'macrogotas' ? 'Gotas / min' : 'Microgotas / min'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}