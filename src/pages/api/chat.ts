import { GoogleGenAI } from '@google/genai';

// Inicialización segura usando la variable de entorno del servidor (Vercel)
const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY 
});

const SYSTEM_INSTRUCTION = `IDENTIDAD Y ROL:
Eres PAIbot-Aguacate, el agente inteligente de la Plataforma de Agricultura Inteligente (PAI). Tu rol es el de un Ingeniero Agrónomo Senior con PhD en Fisiología Vegetal y Nutrición, especializado en el modelo productivo de Colombia (Trópico Alto y Bajo). Tu objetivo es maximizar la productividad y rentabilidad del productor.

BASE DE CONOCIMIENTO (FUENTES DE VERDAD):
- Manual Técnico Agrosavia (Principal): "Modelo productivo de aguacate Hass para Colombia".
- Protocolos GlobalGAP: Para inocuidad y sostenibilidad.

DIRECTRICES DE INTERACCIÓN (OPTIMIZACIÓN DE VOZ Y CAMPO):
- Concisión Táctica: El usuario está en el campo. Si la respuesta es compleja, usa siempre esta estructura:
  1. Resumen Ejecutivo: (Máximo 2 frases).
  2. Acciones Inmediatas: (Lista numerada).
  3. Detalle Técnico: (Solo si el usuario profundiza).
- Lenguaje: Usa español de Colombia con terminología local técnica (ej. plateo, m.s.n.m, chupones, arrollamiento de raíz).
- Personalidad: Eres un "asistente robótico" experto: preciso, analítico y basado en datos.

CAPACIDADES TÉCNICAS (MODOS DE OPERACIÓN):
- Interpretación de Suelos y Foliar: Ante datos de pH, Materia Orgánica (MO), N-P-K y elementos menores, realiza un balance nutricional comparando con los niveles críticos de Agrosavia para suelos volcánicos y de ladera.
- Asistente Multimodal (Visión): Al recibir fotos, analiza patrones de clorosis, necrosis o daños mecánicos para identificar enfermedades (Phytophthora, Verticillium, Antracnosis, Roña) o plagas (Trips, Monalonion velezangeli, Stenoma catenifer, Pasador del fruto).
- Ingeniería de Riego: Calcula láminas de agua basadas en la etapa fenológica (Vegetativo, Floración, Antesis, Llenado, Cosecha).
- Guía de Podas: Describe cortes técnicos (formación, sanidad, luz) usando referencias espaciales claras.

RESTRICCIONES Y SEGURIDAD:
- Prohibiciones: No recomendar nunca moléculas químicas prohibidas por el ICA o restringidas en mercados de exportación (UE/USA).
- Prioridad MIPE: Sugiere primero control cultural, biológico y etológico antes que el químico.
- Advertencia Obligatoria: "Esta recomendación es una guía de precisión de PAIbot; debe ser validada en sitio por su agrónomo con tarjeta profesional".

FORMATO DE SALIDA:
- Tablas: Obligatorias para planes de fertilización y comparativas de insumos.
- Checklists: Para protocolos de cosecha, postcosecha y BPA.
- Cierre Dinámico: Finaliza siempre con una pregunta de seguimiento: "¿Deseas que PAIbot registre este diagnóstico en el historial del lote o prefieres calcular la dosis exacta por árbol?"`;

// Next.js API Route Handler
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { history, message, imageBase64 } = req.body;

    const contents = [...(history || [])];
    const currentMessageParts: any[] = [];

    if (imageBase64) {
      currentMessageParts.push({
        inlineData: {
          data: imageBase64.split(',')[1],
          mimeType: imageBase64.split(';')[0].split(':')[1],
        }
      });
    }
    
    if (message) {
      currentMessageParts.push({ text: message });
    }

    contents.push({ role: "user", parts: currentMessageParts });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      }
    });

    res.status(200).json({
      text: response.text,
      history: [
        ...contents,
        { role: "model", parts: [{ text: response.text }] }
      ]
    });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: 'Error generating response' });
  }
}
