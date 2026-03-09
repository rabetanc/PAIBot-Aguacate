import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image as ImageIcon, X, Loader2, Bot, User, WifiOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Chat({ initialMessage }: { initialMessage?: string }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; image?: string; isPending?: boolean }[]>([
    { role: 'model', text: '¡Hola! Soy PAIbot-Aguacate 🥑. Ingeniero Agrónomo Senior especializado en el modelo productivo de Colombia. ¿En qué puedo ayudarte hoy en tu cultivo?' }
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingMessages, setPendingMessages] = useState<{ text: string; image?: string }[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Keep track of raw history for Gemini
  const [history, setHistory] = useState<{ role: string; parts: any[] }[]>([]);

  // Handle online/offline events and load pending messages
  useEffect(() => {
    const savedPending = localStorage.getItem('paibot_pending');
    if (savedPending) {
      setPendingMessages(JSON.parse(savedPending));
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-retry when coming back online
  useEffect(() => {
    if (!isOffline && pendingMessages.length > 0) {
      processPendingMessages();
    }
  }, [isOffline]);

  const processPendingMessages = async () => {
    const messagesToProcess = [...pendingMessages];
    setPendingMessages([]);
    localStorage.removeItem('paibot_pending');

    // Remove pending flags from UI
    setMessages(prev => prev.map(m => ({ ...m, isPending: false })));

    for (const msg of messagesToProcess) {
      await handleSend(msg.text, msg.image, true);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialMessage) {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  const handleSend = async (textOverride?: string, imageOverride?: string | null, isRetry = false) => {
    const textToSend = textOverride || input;
    const imageToSend = imageOverride !== undefined ? imageOverride : image;

    if (!textToSend.trim() && !imageToSend) return;

    if (!isRetry) {
      const userMessage = { role: 'user' as const, text: textToSend, image: imageToSend || undefined, isPending: false };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setImage(null);
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history,
          message: textToSend,
          imageBase64: imageToSend || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // If we succeed, we are definitely online
      setIsOffline(false);
      
      setMessages(prev => {
        // Remove pending flag from the last user message if it was a retry
        const newMessages = [...prev];
        const lastUserIdx = newMessages.map(m => m.role).lastIndexOf('user');
        if (lastUserIdx !== -1) {
          newMessages[lastUserIdx].isPending = false;
        }
        return [...newMessages, { role: 'model', text: data.text }];
      });
      setHistory(data.history);
    } catch (error) {
      console.error("Fetch error details:", error);
      
      // If fetch fails, we might be offline or the server might be down
      if (!navigator.onLine) {
        setIsOffline(true);
        const newPending = [...pendingMessages, { text: textToSend, image: imageToSend || undefined }];
        setPendingMessages(newPending);
        localStorage.setItem('paibot_pending', JSON.stringify(newPending));
        
        setMessages(prev => {
          const newMessages = [...prev];
          const lastUserIdx = newMessages.map(m => m.role).lastIndexOf('user');
          if (lastUserIdx !== -1) {
            newMessages[lastUserIdx].isPending = true;
          }
          return newMessages;
        });
      } else {
        setIsOffline(false); // Ensure offline banner is removed if we are actually online
        setMessages(prev => [...prev, { role: 'model', text: 'Error de conexión con el servidor. Por favor, verifique que el backend esté funcionando (en Vercel, asegúrese de haber configurado la variable de entorno PAIBOT_API_KEY).' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('El reconocimiento de voz no está soportado en este navegador.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-CO';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  return (
    <div className="flex flex-col h-full bg-stone-100 relative">
      {isOffline && (
        <div className="bg-amber-100 text-amber-800 px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 shadow-sm z-10">
          <WifiOff size={14} />
          <span>Sin conexión. Los mensajes se guardarán localmente y se enviarán al recuperar la señal.</span>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-emerald-400'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`rounded-2xl px-4 py-3 shadow-sm relative ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white text-stone-800 rounded-tl-none border border-stone-200'
              } ${msg.isPending ? 'opacity-70' : ''}`}>
                
                {msg.image && (
                  <img src={msg.image} alt="Uploaded" className="max-w-full h-auto rounded-lg mb-2 max-h-48 object-cover" />
                )}
                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-stone'} 
                  prose-p:leading-relaxed prose-pre:bg-stone-900 prose-pre:text-stone-100
                  prose-a:text-emerald-600 prose-strong:text-emerald-800`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
                
                {msg.isPending && (
                  <div className="absolute -bottom-5 right-0 text-[10px] text-amber-600 font-medium flex items-center gap-1">
                    <WifiOff size={10} /> Guardado localmente
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && !isOffline && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-stone-800 text-emerald-400 flex items-center justify-center shrink-0">
                <Bot size={18} />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-stone-200 flex items-center gap-2">
                <Loader2 className="animate-spin text-emerald-600" size={16} />
                <span className="text-sm text-stone-500 font-mono">Analizando datos agronómicos...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-stone-200 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        {image && (
          <div className="relative inline-block mb-3">
            <img src={image} alt="Preview" className="h-20 w-20 object-cover rounded-xl border-2 border-emerald-500 shadow-md" />
            <button 
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors shrink-0"
            title="Subir foto de plaga o enfermedad"
          >
            <ImageIcon size={22} />
          </button>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          
          <div className="flex-1 bg-stone-100 rounded-2xl border border-stone-200 overflow-hidden flex items-center focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={isOffline ? "Escriba su consulta (se guardará offline)..." : "Describa el síntoma o consulte sobre nutrición..."}
              className="w-full bg-transparent border-none focus:ring-0 p-3 max-h-32 min-h-[44px] resize-none text-sm"
              rows={1}
            />
            <button 
              onClick={toggleVoice}
              className={`p-3 shrink-0 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-stone-500 hover:text-emerald-600'}`}
              title="Dictado por voz"
            >
              <Mic size={20} />
            </button>
          </div>

          <button 
            onClick={() => handleSend()}
            disabled={(!input.trim() && !image) || (isLoading && !isOffline)}
            className={`p-3 text-white rounded-xl transition-colors shrink-0 shadow-sm ${
              isOffline 
                ? 'bg-amber-500 hover:bg-amber-600' 
                : 'bg-emerald-600 hover:bg-emerald-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
