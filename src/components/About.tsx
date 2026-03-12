import { Info, Mail, BookOpen, Landmark, QrCode } from 'lucide-react';

// Placeholders for images - in a real scenario these would be imported or hosted
const LOGO_URL = "https://ais-pre-xsdrulatgqocdfcxnafcr7-47549712773.us-west1.run.app/logo.png"; // Placeholder
const QR_URL = "https://ais-pre-xsdrulatgqocdfcxnafcr7-47549712773.us-west1.run.app/qr.png"; // Placeholder

export default function About() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-full overflow-y-auto space-y-8 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-stone-800 tracking-tight">Acerca de PAIbot</h2>
        <div className="text-stone-600 max-w-3xl mx-auto text-left space-y-4 bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <p>
            <span className="font-bold text-emerald-800">PAIbot-Aguacate</span> es un sistema experto que actúa como un agrónomo robótico de bolsillo, integrando modelos de IA con el conocimiento técnico oficial de Agrosavia. Sus características principales incluyen:
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <span className="font-bold text-stone-800">Nutrición de Precisión:</span> Genera planes de fertilización personalizados analizando datos de laboratorio y niveles críticos del suelo.
            </li>
            <li>
              <span className="font-bold text-stone-800">Sanidad Vegetal:</span> Utiliza visión artificial para identificar plagas y enfermedades, priorizando el control biológico y cultural.
            </li>
            <li>
              <span className="font-bold text-stone-800">Operación en Campo:</span> Permite una interacción manos libres mediante comandos de voz en español, ideal para el trabajo directo en el cultivo.
            </li>
            <li>
              <span className="font-bold text-stone-800">Optimización de Recursos:</span> Calcula necesidades hídricas basadas en la altitud y la etapa de desarrollo (fenología) del árbol.
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financiación */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center gap-3 text-emerald-700 font-bold">
            <Landmark size={24} />
            <h3>Financiación</h3>
          </div>
          <p className="text-stone-600 text-sm leading-relaxed">
            Este sistema fue desarrollado en el marco del proyecto <span className="font-semibold text-stone-800">"Desarrollo de una plataforma de agricultura inteligente y autónoma energéticamente para el monitoreo continuo de variables relevantes orientada a mejorar la productividad y mitigar el impacto ambiental en cultivos de hortofrutícolas de Antioquia y Quindío"</span> financiado por el <span className="text-emerald-700 font-medium">Sistema General de Regalías (SGR)</span> de Colombia, código <span className="font-mono bg-stone-100 px-1 rounded">BPIN 202200010012</span>.
          </p>
        </div>

        {/* Contacto */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center gap-3 text-emerald-700 font-bold">
            <Mail size={24} />
            <h3>Contacto</h3>
          </div>
          <div className="space-y-2">
            <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold">Correo electrónico</p>
            <a 
              href="mailto:proyectosceldas.siu@udea.edu.co" 
              className="text-emerald-600 hover:text-emerald-700 font-medium break-all transition-colors"
            >
              proyectosceldas.siu@udea.edu.co
            </a>
          </div>
        </div>

        {/* Fuente de Información */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4 md:col-span-2">
          <div className="flex items-center gap-3 text-emerald-700 font-bold">
            <BookOpen size={24} />
            <h3>Fuente Principal de Información</h3>
          </div>
          <div className="space-y-3">
            <p className="text-stone-600 text-sm italic">
              "Actualización tecnológica y buenas prácticas agrícolas (BPA) en el cultivo de aguacate".
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-500">
              <span>Derechos de autor 2020</span>
              <span className="font-bold text-stone-700">Corporación Colombiana de Investigación Agropecuaria - AGROSAVIA</span>
            </div>
            <a 
              href="https://doi.org/10.21930/agrosavia.manual.7403831" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-600 hover:underline font-medium text-sm"
            >
              Ver Manual Técnico (DOI)
            </a>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <QrCode size={28} className="text-emerald-400" />
            <h3 className="text-xl font-bold">Acceso Rápido</h3>
          </div>
          <p className="text-emerald-100 text-sm leading-relaxed opacity-80">
            Escanea este código QR para acceder a la página web del proyecto PAI.
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl shrink-0">
          <img 
            src="/qr-pai.png" 
            alt="Código QR PAI" 
            className="w-40 h-40 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ais-pre-xsdrulatgqocdfcxnafcr7-47549712773.us-west1.run.app";
            }}
          />
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-stone-400 font-mono uppercase tracking-[0.2em]">
          Plataforma de Agricultura Inteligente © 2026
        </p>
      </div>
    </div>
  );
}
