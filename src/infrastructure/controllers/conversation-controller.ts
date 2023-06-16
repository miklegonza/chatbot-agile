import { inject, injectable } from "inversify";
import { SERVICES } from "../../dictionaries/dictionary";
import { ConversationService } from "../../application/services/conversation-service";

@injectable()
export class ConversationController {
    constructor(
        @inject(SERVICES.ConversationService)
        private conversationService: ConversationService
    ) {}

    public async conversation(event: any) {
        return await this.conversationService.executeConversationModel(event)
        .then((result) => {
            return { result };
        }).catch((error) => {
            throw error;
        });
    }
}