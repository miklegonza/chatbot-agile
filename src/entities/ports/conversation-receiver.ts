export interface ConversationReceiver {
    receiveMessage(payload: any): Promise<any>;
}