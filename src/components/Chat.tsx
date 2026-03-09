import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image as ImageIcon, X, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateChatResponse } from '../services/geminiService';

export default function Chat({ initialMessage }: { initialMessage?: string }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; image?: string }[]>([
    { role: 'model', text: '¡Hola! Soy PAIbot-Aguacate 🥑. Ingeniero Agrónomo Senior especializado en el modelo productivo de Colombia. ¿En qué puedo ayudarte hoy en tu cultivo?' }
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Keep track of raw history for Gemini
  const [history, setHistory] = useState<{ role: string; parts: any[] }[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialMessage) {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() && !image) return;

    const userMessage = { role: 'user' as const, text: textToSend, image: image || undefined };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImage(null);
    setIsLoading(true);

    try {
      const response = await generateChatResponse(history, textToSend, image || undefined);
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      setHistory(response.history);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Error de conexión con la base de datos de Agrosavia. Por favor, intente nuevamente.' }]);
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
    <div className="flex flex-col h-full bg-stone-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-emerald-400'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white text-stone-800 rounded-tl-none border border-stone-200'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="Uploaded" className="max-w-full h-auto rounded-lg mb-2 max-h-48 object-cover" />
                )}
                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-stone'} 
                  prose-p:leading-relaxed prose-pre:bg-stone-900 prose-pre:text-stone-100
                  prose-a:text-emerald-600 prose-strong:text-emerald-800`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
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
              placeholder="Describa el síntoma o consulte sobre nutrición..."
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
            disabled={!input.trim() && !image || isLoading}
            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
