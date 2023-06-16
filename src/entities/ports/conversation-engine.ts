export interface ConversationEngine {
    buildChain(payload: any): Promise<any>;
}