import { UTILS } from '../../dictionaries/dictionary';
import { ConversationModel } from '../../entities/ports/conversation-model';
import { ConversationStore } from '../../entities/ports/conversation-store';
import { ConversationService } from './conversation-service';
import { injectable, inject } from 'inversify';

@injectable()
export class ConversationServiceImpl implements ConversationService {
    constructor(
        @inject(UTILS.ConversationModel)
        private conversationModel: ConversationModel,
        @inject(UTILS.ConversationStore)
        private conversationStore: ConversationStore,
    ) {}

    async executeConversationModel(event: any): Promise<any> {
        console.log('SERVICE input:', JSON.stringify(event));

        /*
        data = {
            phone: 
            date: 
            message: 
            AIResponse: 
            tokens: 
            sid: 
        }
        */
        const payload = event.body;
        return await this.conversationModel
            .buildChain(payload)
            .then(async (data) => {
                const interaction = {
                    phone: '3001234567', // TODO
                    message: data.message,
                    AIResponse: data.AIResponse,
                    tokens: data.tokens,
                    sid: 10, // TODO
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
