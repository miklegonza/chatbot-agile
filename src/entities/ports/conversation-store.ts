export interface ConversationStore {
    saveInteraction(data: any, conversationHistory?: any): Promise<any>;
    getMessages(history: any): Promise<any>;
    getHistory(phone: string): Promise<any>;
}
