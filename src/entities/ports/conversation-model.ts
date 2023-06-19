export interface ConversationModel {
    buildChain(payload: any): Promise<any>;
}