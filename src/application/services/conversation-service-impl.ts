import { UTILS } from '../../dictionaries/dictionary';
import { ConversationModel } from '../../entities/ports/conversation-model';
import { ConversationService } from './conversation-service';
import { injectable, inject } from 'inversify';

@injectable()
export class ConversationServiceImpl implements ConversationService {
    constructor(
        @inject(UTILS.ConversationModel)
        private conversationModel: ConversationModel,
    ) {}

    async executeConversationModel(event: any): Promise<any> {
        console.log('SERVICE input:', JSON.stringify(event));

        const payload = event.body;
        return await Promise.resolve(this.conversationModel.buildChain(payload));
    }
}
