import { injectable } from 'inversify';
import { ConversationReceiver } from '../ports/conversation-receiver';

@injectable()
export class ConversationReceiverImpl implements ConversationReceiver {
    private helloMessage = `¡Hola! Hablas con el chatbot especializado en agilidad del Banco Popular.
    Recuerda que en cualquier momento puedes finalizar la conversación con la palabra 'Terminar'.
    ¿En qué te puedo ayudar hoy? :)`;
    private byeMessage = `Fue un placer responder a tus preguntas. El equipo del Banco Popular quiere concer tu experiencia con el chatbot. Ayúdanos con una breve encuesta de satisfacción a continuación: <link>`;

    async receiveMessage(payload: any): Promise<any> {
        return this.validateDefault(payload);
    }

    private async validateDefault(payload: any): Promise<any> {
        const message = payload.message.toLowerCase().trim();

        if (
            message.includes('hola') ||
            message.includes('buenos días') ||
            message.includes('buenas tardes') ||
            message.includes('buenas noches') ||
            message.includes('hello') ||
            message.includes('hi')
        ) {
            payload.response = this.helloMessage;
            payload.default = true;
        } else if (
            message.includes('adiós') ||
            message.includes('chao') ||
            message.includes('terminar') ||
            message.includes('finalizar') ||
            message.includes('bye')
        ) {
            payload.response = this.byeMessage;
            payload.default = true;
        } else {
            payload.default = false;
        }
        return payload;
    }

    private validatePhone(phone: string): boolean {
        const pattern = /^\+[1-9]\d{1,14}$/;

        return pattern.test(phone);
    }
}
