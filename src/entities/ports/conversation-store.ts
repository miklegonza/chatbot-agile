export interface ConversationStore {
    saveInteraction(data: any): Promise<any>;
    getSummary(data: any): Promise<any>;
    getMessages(history: any): Promise<any>;
}
