export interface ConversationEngine {
    buildChain(template: string): any;
    buildMemoryMethod(): Promise<any>;
}