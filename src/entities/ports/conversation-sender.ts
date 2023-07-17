export interface ConversationSender {
    sendMessage(payload: any): Promise<any>;
}