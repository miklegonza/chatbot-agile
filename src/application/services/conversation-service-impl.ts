import { inject, injectable } from 'inversify';
import { UTILS } from '../../dictionaries/dictionary';
import { ConversationModel } from '../../entities/ports/conversation-model';
import { ConversationStore } from '../../entities/ports/conversation-store';
import { ConversationSender } from '../../entities/ports/conversation-sender';
import { ConversationReceiver } from '../../entities/ports/conversation-receiver';
import { ConversationService } from './conversation-service';

@injectable()
export class ConversationServiceImpl implements ConversationService {
    constructor(
        @inject(UTILS.ConversationModel)
        private conversationModel: ConversationModel,
        @inject(UTILS.ConversationStore)
        private conversationStore: ConversationStore,
        @inject(UTILS.ConversationSender)
        private conversationSender: ConversationSender,
        @inject(UTILS.ConversationReceiver)
        private conversationReceiver: ConversationReceiver,
    ) {}

    async executeConversationModel(event: any): Promise<any> {
        const payload = event.body;
        return Promise.resolve(await this.conversationReceiver.receiveMessage(payload))
            .then(async (data) => {
                return await this.conversationStore.getSummary(data);
            })
            .then(async (data) => {
                if (!data.default) {
                    return await this.conversationModel.buildChain(data);
                }
                return data;
            })
            .catch((error) => {
                console.error(error.message);
                const errorMsg = 'Hubo un problema procesando el mensaje.';
                payload.response = errorMsg;
                return payload;
            })
            .finally(async () => {
                return Promise.resolve(await this.conversationSender.sendMessage(payload)).then(async (data) => {
                    console.log('SID: ', data.sid);
                    return await this.conversationStore.saveInteraction(data);
                });
            });
    }
}
