import { useState } from 'react';
import { ClipboardCheck, CheckCircle2, Circle } from 'lucide-react';

export default function Checklists() {
  const [activeTab, setActiveTab] = useState<'ica' | 'globalgap'>('ica');

  const [icaChecklist, setIcaChecklist] = useState([
    { id: 1, text: 'Registro del predio ante el ICA (Forma 3-100)', checked: false },
    { id: 2, text: 'Asistencia técnica por Ingeniero Agrónomo con tarjeta profesional', checked: false },
    { id: 3, text: 'Croquis del predio con ubicación de lotes y áreas de infraestructura', checked: false },
    { id: 4, text: 'Análisis de suelos y foliares vigentes (menos de 1 año)', checked: false },
    { id: 5, text: 'Plan de fertilización basado en análisis y firmado por agrónomo', checked: false },
    { id: 6, text: 'Registro de aplicaciones de plaguicidas (solo productos con registro ICA)', checked: false },
    { id: 7, text: 'Bodega de insumos con separación de fertilizantes y agroquímicos', checked: false },
    { id: 8, text: 'Área de acopio temporal de fruta con estibas y techo', checked: false },
    { id: 9, text: 'Unidades sanitarias y lavamanos para trabajadores', checked: false },
    { id: 10, text: 'Manejo de envases vacíos (Triple lavado y perforación)', checked: false },
    { id: 11, text: 'Monitoreo de plagas cuarentenarias (Stenoma catenifer, Heilipus lauri)', checked: false },
  ]);

  const [globalGapChecklist, setGlobalGapChecklist] = useState([
    { id: 1, text: 'Evaluación de riesgos del sitio (historial del terreno)', checked: false },
    { id: 2, text: 'Trazabilidad: Identificación de lotes y registros de cosecha', checked: false },
    { id: 3, text: 'Gestión del agua: Análisis microbiológico y químico del agua de riego', checked: false },
    { id: 4, text: 'Uso eficiente de fertilizantes (balances de nutrientes)', checked: false },
    { id: 5, text: 'Manejo Integrado de Plagas (MIP) documentado y justificado', checked: false },
    { id: 6, text: 'Límites Máximos de Residuos (LMR): Análisis de multiresiduos en fruta', checked: false },
    { id: 7, text: 'Salud y seguridad laboral: EPP, capacitación en primeros auxilios', checked: false },
    { id: 8, text: 'Gestión de residuos y contaminación (reciclaje, disposición final)', checked: false },
    { id: 9, text: 'Plan de conservación del medio ambiente y biodiversidad', checked: false },
    { id: 10, text: 'Higiene en la cosecha: Procedimientos documentados y capacitación', checked: false },
  ]);

  const toggleCheck = (id: number, type: 'ica' | 'globalgap') => {
    if (type === 'ica') {
      setIcaChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    } else {
      setGlobalGapChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    }
  };

  const currentChecklist = activeTab === 'ica' ? icaChecklist : globalGapChecklist;
  const progress = Math.round((currentChecklist.filter(item => item.checked).length / currentChecklist.length) * 100);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2 mb-2">
          <ClipboardCheck className="text-emerald-600" />
          Módulo de Certificación
        </h2>
        <p className="text-stone-600 text-sm">Verifique el cumplimiento de los requisitos para exportación y buenas prácticas agrícolas.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('ica')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'ica' 
                ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50' 
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
            }`}
          >
            Res. ICA 448 (Predio Exportador)
          </button>
          <button
            onClick={() => setActiveTab('globalgap')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'globalgap' 
                ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50' 
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
            }`}
          >
            GlobalG.A.P. (IFA v5.4/v6)
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6 bg-stone-50 p-4 rounded-xl border border-stone-100">
            <div>
              <h3 className="font-semibold text-stone-800">Progreso de Cumplimiento</h3>
              <p className="text-xs text-stone-500">{currentChecklist.filter(i => i.checked).length} de {currentChecklist.length} requisitos cumplidos</p>
            </div>
            <div className="text-2xl font-bold text-emerald-600">{progress}%</div>
          </div>

          <div className="w-full bg-stone-200 rounded-full h-2.5 mb-8 overflow-hidden">
            <div className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>

          <ul className="space-y-3">
            {currentChecklist.map((item) => (
              <li 
                key={item.id}
                onClick={() => toggleCheck(item.id, activeTab)}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors border ${
                  item.checked 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.checked ? (
                    <CheckCircle2 className="text-emerald-600" size={20} />
                  ) : (
                    <Circle className="text-stone-300" size={20} />
                  )}
                </div>
                <span className={`text-sm ${item.checked ? 'text-emerald-900 font-medium' : 'text-stone-700'}`}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
