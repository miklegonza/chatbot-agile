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

    executeConversationModel(event: any): Promise<any> {
        return Promise.resolve(this.conversationEngine.buildChain(event)
        .then((result) => {
            
        }).catch((err) => {
            
        }));
    }
}
