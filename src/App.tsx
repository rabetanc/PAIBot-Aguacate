import { useState, useEffect } from 'react';
import { Leaf, Droplets, Sprout, ClipboardCheck, MessageSquare, Info } from 'lucide-react';
import Chat from './components/Chat';
import Fertilization from './components/Fertilization';
import Irrigation from './components/Irrigation';
import About from './components/About';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    // Usamos un servicio gratuito de contador de visitas (el /up al final hace que sume 1)
    fetch('https://api.counterapi.dev/v1/paibot_sgr_bpin/visits/up')
      .then(res => res.json())
      .then(data => {
        if (data.count) {
          setVisits(data.count);
        } else {
          setVisits(20); // Fallback si la API no devuelve el count
        }
      })
      .catch(() => setVisits(20)); // Fallback en caso de error de red
  }, []);

  const tabs = [
    { id: 'chat', label: 'PAIbot', icon: MessageSquare },
    { id: 'fert', label: 'Nutrición', icon: Leaf },
    { id: 'irrigation', label: 'Riego', icon: Droplets },
    { id: 'pruning', label: 'Podas', icon: Sprout },
    { id: 'about', label: 'Acerca de', icon: Info },
  ];

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-emerald-900 text-white shadow-xl">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <img 
              src="/logo-pai.png" 
              alt="Logo PAI" 
              className="h-16 w-auto object-contain brightness-0 invert" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <Leaf className="text-emerald-400 mx-auto" size={32} id="fallback-logo" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            PAIbot
          </h1>
          <p className="text-emerald-200 text-[10px] mt-1 font-mono uppercase tracking-wider">Aguacate Hass Col.</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-800 text-white font-medium shadow-inner'
                    : 'text-emerald-100 hover:bg-emerald-800/50'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-emerald-800 text-[10px] text-emerald-400/50 text-center font-mono leading-relaxed">
          <div className="opacity-60 mb-1 flex justify-center items-center gap-2">
            <span>v1.0.0</span>
            {visits !== null && (
              <>
                <span>|</span>
                <span>Visitas: {visits}</span>
              </>
            )}
          </div>
          <div>Proyecto PAI del SGR.</div>
          <div>BPIN 202200010012.</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-emerald-900 text-white p-4 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3">
            <img 
              src="/logo-pai.png" 
              alt="Logo PAI" 
              className="h-8 w-auto brightness-0 invert"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <h1 className="text-xl font-bold">PAIbot</h1>
          </div>
          <span className="text-[10px] bg-emerald-800 px-2 py-1 rounded-full font-mono uppercase tracking-wider">Hass Col.</span>
        </header>

        <div className="flex-1 overflow-hidden bg-stone-100">
          {activeTab === 'chat' && <Chat key="chat" />}
          {activeTab === 'fert' && <Fertilization />}
          {activeTab === 'irrigation' && <Irrigation />}
          {activeTab === 'pruning' && <Chat key="pruning" />}
          {activeTab === 'about' && <About />}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden bg-white border-t border-stone-100 px-4 py-1 text-[9px] text-stone-400 text-center font-mono flex flex-col items-center">
          <span>Proyecto PAI del SGR. BPIN 202200010012.</span>
          {visits !== null && <span className="opacity-70">Visitas: {visits}</span>}
        </div>
        <nav className="md:hidden bg-white border-t border-stone-200 flex justify-around p-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center p-2 rounded-xl min-w-[64px] transition-colors ${
                  activeTab === tab.id
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-stone-500 hover:text-emerald-600'
                }`}
              >
                <Icon size={20} className={activeTab === tab.id ? 'mb-1' : 'mb-1 opacity-70'} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
