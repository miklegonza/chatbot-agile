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
        console.log('SERVICE input:', JSON.stringify(event));

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
                const history = await this.conversationStore.getHistory(interaction.phone).catch(async (error) => {
                    if (error.code === 'ENOENT') {
                        console.log('ERROR.CODE === ENOENT es TRUE', error);
                        await this.conversationStore.saveInteraction(interaction);
                    } else {
                        console.log('ERROR.CODE === ENOENT es FALSE', error);
                        throw { error };
                    }
                });
                await this.conversationStore.saveInteraction(interaction, history);
                return interaction.AIResponse;
            })
            .catch((error) => {
                console.error(error);
                return 'Hubo un problema procesando el mensaje. ' + error.code;
            });
    }
}
