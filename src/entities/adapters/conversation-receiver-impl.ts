import { injectable } from 'inversify';
import { DEFAULT_PROMPTS } from '../../dictionaries/prompts';
import { ConversationReceiver } from '../ports/conversation-receiver';

@injectable()
export class ConversationReceiverImpl implements ConversationReceiver {
    private readonly helloMessage = DEFAULT_PROMPTS.helloMessage;
    private readonly lengthMessage = DEFAULT_PROMPTS.lengthMessage;
    private readonly byeMessage = DEFAULT_PROMPTS.byeMessage;

    async receiveMessage(payload: any): Promise<any> {
        return this.validateDefault(payload);
    }

    private async validateDefault(payload: any): Promise<any> {
        const message = payload.message.toLowerCase().trim();

        const helloSequence = ['hola', 'holi', 'buenos días', 'buenas tardes', 'buenas noches', 'hello'];
        const byeSequence = ['adiós', 'adios', 'chao', 'terminar', 'finalizar', 'bye'];

        payload.default = true;

        if (!this.validateLength(message)) {
            payload.response = this.lengthMessage;
            return payload;
        }

        if (this.validateSequence(message, helloSequence)) {
            payload.response = this.helloMessage;
        } else if (this.validateSequence(message, byeSequence)) {
            payload.response = this.byeMessage;
        } else {
            payload.default = false;
        }
        return payload;
    }

    private validateSequence(message: string, sequence: string[]): boolean {
        return sequence.some((word) => message.includes(word));
    }

    private validateLength(message: string): boolean {
        return message.length < 200;
    }

    private validatePhone(phone: string): boolean {
        const pattern = /^\+[1-9]\d{1,14}$/;
        return pattern.test(phone);
    }
}
