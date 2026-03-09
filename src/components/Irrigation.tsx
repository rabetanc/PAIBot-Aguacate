import { useState } from 'react';
import { Droplets, Send, MapPin, CloudRain } from 'lucide-react';
import Chat from './Chat';

export default function Irrigation() {
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  
  const [formData, setFormData] = useState({
    region: 'antioquia',
    altitud: '',
    etapa: 'floracion',
    precipitacion: '',
    evapotranspiracion: '',
    tipo_suelo: 'franco'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prompt = `Calcula las necesidades hídricas (lámina de agua) para mi cultivo de aguacate Hass con los siguientes parámetros:
- Región: ${formData.region}
- Altitud: ${formData.altitud} m.s.n.m
- Etapa Fenológica: ${formData.etapa}
- Precipitación reciente: ${formData.precipitacion || 'No especificada'} mm
- Evapotranspiración (ETo): ${formData.evapotranspiracion || 'No especificada'} mm/día
- Tipo de Suelo: ${formData.tipo_suelo}

Por favor, proporciona una recomendación de riego basada en los modelos agronómicos para Colombia, indicando litros por árbol al día o a la semana.`;

    setChatMessage(prompt);
    setShowChat(true);
  };

  if (showChat) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-emerald-800 text-white p-3 flex justify-between items-center shadow-md z-10">
          <h2 className="font-semibold flex items-center gap-2"><Droplets size={18}/> Cálculo de Riego en Progreso</h2>
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
          <Droplets className="text-blue-500" />
          Gestión Inteligente del Riego
        </h2>
        <p className="text-stone-600 text-sm">Estime la lámina de agua requerida según la etapa fenológica y las condiciones edafoclimáticas de su región.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Ubicación y Fenología */}
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-800 border-b border-blue-100 pb-2 flex items-center gap-2">
              <MapPin size={16} /> Ubicación y Cultivo
            </h3>
            
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Región Productora</label>
              <select name="region" value={formData.region} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <option value="antioquia">Antioquia (Oriente/Suroeste)</option>
                <option value="eje_cafetero">Eje Cafetero (Caldas, Quindío, Risaralda)</option>
                <option value="tolima">Norte del Tolima</option>
                <option value="huila">Huila</option>
                <option value="valle">Valle del Cauca</option>
                <option value="otra">Otra región</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Altitud (m.s.n.m)</label>
              <input type="number" name="altitud" required value={formData.altitud} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="Ej. 2100" />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Etapa Fenológica Crítica</label>
              <select name="etapa" value={formData.etapa} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <option value="vegetativo">Desarrollo Vegetativo</option>
                <option value="floracion">Floración / Cuaje</option>
                <option value="llenado">Llenado de Fruto (Alta demanda)</option>
                <option value="cosecha">Pre-cosecha</option>
              </select>
            </div>
          </div>

          {/* Clima y Suelo */}
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-800 border-b border-blue-100 pb-2 flex items-center gap-2">
              <CloudRain size={16} /> Clima y Suelo
            </h3>
            
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Tipo de Suelo</label>
              <select name="tipo_suelo" value={formData.tipo_suelo} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <option value="franco">Franco (Equilibrado)</option>
                <option value="franco_arenoso">Franco Arenoso (Drena rápido)</option>
                <option value="franco_arcilloso">Franco Arcilloso (Retiene agua)</option>
                <option value="arcilloso">Arcilloso (Riesgo de encharcamiento)</option>
                <option value="arenoso">Arenoso (Baja retención)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Precipitación Reciente (mm) - Opcional</label>
              <input type="number" step="0.1" name="precipitacion" value={formData.precipitacion} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="Lluvia en los últimos días" />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">ETo (mm/día) - Opcional</label>
              <input type="number" step="0.1" name="evapotranspiracion" value={formData.evapotranspiracion} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="Evapotranspiración de referencia" />
            </div>
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm mt-8"
        >
          <Send size={18} />
          Calcular Lámina de Riego
        </button>
      </form>
    </div>
  );
}
