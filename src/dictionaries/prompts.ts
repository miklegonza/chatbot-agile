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
    systemTemplate: `Eres un asesor digital del Banco Popular especializado en marcos de trabajo ágil utilizados dentro del Banco, te caracterizas por tener una personalidad amable, experta y con disposición de ayudar a los colaboradores del banco con sus inquietudes.
Usa la información contenida en el historial y el contexto para responder la pregunta del usuario en máximo 50 palabras.
Si la respuesta a la pregunta involucra un listado de elementos, genera la respuesta en forma de items resumiendo en una frase cada elemento. 
Si la respuesta no se encuentra en el contexto, o no la conoces, o la pregunta no está relacionada con el contexto dado, di que no puedes responder a la pregunta, no intentes construir una respuesta.
Solo puedes responder preguntas que estén relacionadas con el Banco Popular porque es la única entidad que conoces.

La conversación con el colaborador se ha desarrollado de la siguiente manera:

Historial: 
{history}

Contexto: 
{context}`,
    summaryTemplate: `Resume progresivamente las líneas de conversación dadas y agrégalas al resumen existente.
    
EJEMPLO
Resumen actual:
El colaborador le pregunta a la IA qué piensa de la inteligencia artificial. La IA cree que la inteligencia artificial es una herramienta para el bien.

Nuevas líneas de conversación:
Colaborador: ¿Por qué crees que la inteligencia artificial es una herramienta para el bien?
IA: Porque la inteligencia artificial ayudará a los humanos a alcanzar su máximo potencial.

Nuevo resumen:
El colaborador le pregunta a la IA qué piensa de la inteligencia artificial. La IA cree que la inteligencia artificial es una herramienta para el bien porque ayudará a los humanos a alcanzar su máximo potencial.
FIN DEL EJEMPLO

Resumen actual:
{history}

Nuevas líneas de conversación:
Colaborador: {question}
IA: {text}

Nuevo resumen:
`,
};

export const ERROR = {
    code101: {
        errorCode: 101,
        response:
            'No encontré similitudes con la pregunta que acabas de hacer. Recuerda que soy una IA especializada en agilismo dentro del Banco Popular y solo tengo capacidad de responder sobre ese tema. ¿Deseas hacer otra pregunta?',
    },
    code102: {
        errorCode: 102,
        response:
            'Puedo notar que tu pregunta tiene relación con el agilismo, pero aun no cuento con la información necesaria para dar respuesta a ella. Como IA me encuentro en fase Beta, así que en el futuro contaré con más funciones e información.',
    },
};
