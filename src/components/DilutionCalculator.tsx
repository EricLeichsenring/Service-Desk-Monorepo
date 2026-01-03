import { useState } from 'react';
import { Syringe, Calculator, X } from 'lucide-react';

interface DilutionCalculatorProps {
  onClose: () => void;
}

export function DilutionCalculator({ onClose }: DilutionCalculatorProps) {
  const [prescrita, setPrescrita] = useState('');   // Dose que o médico pediu
  const [diluente, setDiluente] = useState('');     // Quantidade de líquido usada para diluir
  const [disponivel, setDisponivel] = useState(''); // Dose total que vem no frasco
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const p = parseFloat(prescrita);
    const d = parseFloat(diluente);
    const t = parseFloat(disponivel);

    if (!p || !d || !t) return;

    // Fórmula: (Prescrita * Diluente) / Disponível
    const res = (p * d) / t;

    // Mostra até 2 casas decimais se necessário, trocando ponto por vírgula
    setResult(res.toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden relative">
        
        {/* Cabeçalho */}
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 font-bold">
            <Syringe size={20} /> Calc. Diluição IM
          </div>
          <button onClick={onClose} className="hover:bg-emerald-700 p-1 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-gray-500 text-center mb-2">
            (Dose Prescrita x Diluente) ÷ Dose do Frasco
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dose Prescrita (mg)</label>
              <input 
                type="number" 
                value={prescrita} 
                onChange={(e) => setPrescrita(e.target.value)} 
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Ex: 500" 
              />
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Diluente (ml)</label>
                <input 
                  type="number" 
                  value={diluente} 
                  onChange={(e) => setDiluente(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Ex: 10" 
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Frasco (mg)</label>
                <input 
                  type="number" 
                  value={disponivel} 
                  onChange={(e) => setDisponivel(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Ex: 1000" 
                />
              </div>
            </div>
          </div>

          <button onClick={calculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
            <Calculator size={18} /> Calcular Aspirado
          </button>

          {result !== null && (
            <div className="mt-4 bg-emerald-50 border-2 border-emerald-100 rounded-lg p-4 text-center animate-fade-in">
              <p className="text-gray-600 text-sm mb-1">Deve-se aspirar:</p>
              <p className="text-4xl font-bold text-emerald-700">{result} ml</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}