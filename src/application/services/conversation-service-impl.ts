import { inject, injectable } from 'inversify';
import { UTILS } from '../../dictionaries/dictionary';
import { ConversationModel } from '../../entities/ports/conversation-model';
import { ConversationStore } from '../../entities/ports/conversation-store';
import { ProviderManager } from '../../entities/ports/provider-manager';
import { ConversationService } from './conversation-service';

@injectable()
export class ConversationServiceImpl implements ConversationService {
    constructor(
        @inject(UTILS.ConversationModel)
        private conversationModel: ConversationModel,
        @inject(UTILS.ConversationStore)
        private conversationStore: ConversationStore,
        @inject(UTILS.ProviderManager)
        private providerManager: ProviderManager,
    ) {}

    async executeConversationModel(event: any): Promise<any> {
        const payload = event.body;
        return Promise.resolve(await this.conversationModel.buildChain(payload.message))
            .then(async (data) => {
                return this.providerManager.sendMessage(payload.phone, data.AIResponse);
            })
            .then(async (data) => {
                console.log('SID: ', data.sid);
                const interaction = {
                    phone: data.to,
                    message: payload.message,
                    AIResponse: data.body,
                    tokens: data.tokens,
                    sid: data.sid,
                };
                await this.conversationStore.getHistory(interaction.phone).then(async (data) => {
                    await this.conversationStore.saveInteraction(interaction, data);
                });
                return interaction.AIResponse;
            })
            .catch((error) => {
                console.error(error);
                return 'Hubo un problema procesando el mensaje. ' + error.code;
            });
    }
}
