export interface ConversationSender {
    sendMessage(phone: string, message: string): Promise<any>;
}