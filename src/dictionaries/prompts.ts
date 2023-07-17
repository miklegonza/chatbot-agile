export const DEFAULT_PROMPTS = {
    helloMessage: `¡Hola! Hablas con el chatbot especializado en agilidad del Banco Popular.
Recuerda que en cualquier momento puedes finalizar la conversación con la palabra 'Terminar'.
¿En qué te puedo ayudar hoy? :)`,
    byeMessage: `Fue un placer responder a tus preguntas. El equipo del Banco Popular quiere concer tu experiencia con el chatbot.
Ayúdanos con una breve encuesta de satisfacción a continuación:
<link>`,
    lengthMessage: `Tu mensaje excede el límite de caracteres permitidos por la herramienta. Te recomiendo hacer preguntas breves y concretas.
Por ejemplo:
    \`\`\`¿Qué es scrum?\`\`\``,
};

export const TEMPLATES = {
    systemTemplate: `La conversación con el colaborador se ha desarrollado de la siguiente manera:
Historial: {chat_history}

Usa la información contenida en el historial y el siguiente contexto para responder la pregunta del usuario en máximo 60 palabras.
Si la respuesta a la pregunta involucra un listado de elementos, genera la respuesta en forma de items resumiendo en una frase cada elemento. 
Si no conoces la respuesta o la pregunta no está relacionada con el contexto dado, di que no puedes responder a la pregunta, no intentes construir una respuesta.

Contexto: {context}`,
};
