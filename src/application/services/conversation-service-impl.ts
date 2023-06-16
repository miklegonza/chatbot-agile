import { UTILS } from '../../dictionaries/dictionary';
import { ConversationEngine } from '../../entities/ports/conversation-engine';
import { ConversationService } from './conversation-service';
import { injectable, inject } from 'inversify';

@injectable()
export class ConversationServiceImpl implements ConversationService {
    constructor(
        @inject(UTILS.ConversationEngine)
        private conversationEngine: ConversationEngine,
    ) {}

    async executeConversationModel(event: any): Promise<any> {
        console.log('SERVICE input:', JSON.stringify(event));

        const payload = event.body;
        const template = payload.template;
        const templateData = payload.templateData;
        return await Promise.resolve(this.conversationEngine.buildChain(template, templateData));
    }
}
