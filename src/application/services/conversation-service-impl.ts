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
                if (!data.default) {
                    const result = await this.conversationModel.buildChain(data.message);
                    result.phone = data.phone;
                    return result;
                }
                return data;
            })
            .then(async (data) => {
                return this.conversationSender.sendMessage(data.phone, data.response);
            })
            .then(async (data) => {
                console.log('SID: ', data.sid);
                const interaction = {
                    phone: data.to,
                    message: data.message,
                    response: data.body,
                    tokens: data.tokens,
                    sid: data.sid,
                };
                await this.conversationStore.getHistory(interaction.phone).then(async (data) => {
                    await this.conversationStore.saveInteraction(interaction, data);
                });
                return interaction.response;
            })
            .catch((error) => {
                console.error(error);
                return 'Hubo un problema procesando el mensaje. ' + error.code;
            });
    }
}
