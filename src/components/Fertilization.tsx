import { useState } from 'react';
import { Leaf, Beaker, FileSpreadsheet, Send } from 'lucide-react';
import Chat from './Chat';

export default function Fertilization() {
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  
  const [formData, setFormData] = useState({
    ph: '',
    mo: '',
    n: '',
    p: '',
    k: '',
    ca: '',
    mg: '',
    altitud: '',
    etapa: 'vegetativo'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prompt = `Por favor, realiza un balance nutricional para mi cultivo de aguacate Hass basado en el siguiente análisis de suelo:
- pH: ${formData.ph}
- Materia Orgánica (MO): ${formData.mo}%
- Nitrógeno (N): ${formData.n} ppm
- Fósforo (P): ${formData.p} ppm
- Potasio (K): ${formData.k} meq/100g
- Calcio (Ca): ${formData.ca} meq/100g
- Magnesio (Mg): ${formData.mg} meq/100g
- Altitud: ${formData.altitud} m.s.n.m
- Etapa Fenológica: ${formData.etapa}

Compara estos datos con los niveles críticos de Agrosavia para suelos de ladera en Colombia y dame un plan de fertilización en formato de tabla.`;

    setChatMessage(prompt);
    setShowChat(true);
  };

  if (showChat) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-emerald-800 text-white p-3 flex justify-between items-center shadow-md z-10">
          <h2 className="font-semibold flex items-center gap-2"><Beaker size={18}/> Análisis en Progreso</h2>
          <button onClick={() => setShowChat(false)} className="text-sm bg-emerald-700 px-3 py-1 rounded-lg hover:bg-emerald-600 transition-colors">Volver al Formulario</button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <Chat initialMessage={chatMessage} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2 mb-2">
          <Leaf className="text-emerald-600" />
          Nutrición de Precisión
        </h2>
        <p className="text-stone-600 text-sm">Ingrese los datos de su análisis de suelo para obtener un balance iónico y recomendaciones basadas en Agrosavia.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Parámetros Generales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-800 border-b border-emerald-100 pb-2 flex items-center gap-2">
              <FileSpreadsheet size={16} /> Datos del Lote
            </h3>
            
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Altitud (m.s.n.m)</label>
              <input type="number" name="altitud" required value={formData.altitud} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Ej. 1800" />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Etapa Fenológica</label>
              <select name="etapa" value={formData.etapa} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                <option value="vegetativo">Desarrollo Vegetativo</option>
                <option value="floracion">Floración / Antesis</option>
                <option value="llenado">Llenado de Fruto</option>
                <option value="cosecha">Cosecha / Postcosecha</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">pH del Suelo</label>
              <input type="number" step="0.1" name="ph" required value={formData.ph} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Ej. 5.5" />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Materia Orgánica (%)</label>
              <input type="number" step="0.1" name="mo" required value={formData.mo} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Ej. 8.0" />
            </div>
          </div>

          {/* Macronutrientes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-800 border-b border-emerald-100 pb-2 flex items-center gap-2">
              <Beaker size={16} /> Macronutrientes
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">N (ppm)</label>
                <input type="number" step="0.1" name="n" required value={formData.n} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Nitrógeno" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">P (ppm)</label>
                <input type="number" step="0.1" name="p" required value={formData.p} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Fósforo" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1" title="meq/100g">K</label>
                <input type="number" step="0.01" name="k" required value={formData.k} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Potasio" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1" title="meq/100g">Ca</label>
                <input type="number" step="0.01" name="ca" required value={formData.ca} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Calcio" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1" title="meq/100g">Mg</label>
                <input type="number" step="0.01" name="mg" required value={formData.mg} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Magnesio" />
              </div>
            </div>
            <p className="text-[10px] text-stone-400 mt-1">* K, Ca, Mg en meq/100g</p>
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleSubmit}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm mt-8"
        >
          <Send size={18} />
          Generar Plan de Fertilización
        </button>
      </form>
    </div>
  );
}
