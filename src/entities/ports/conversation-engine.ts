export interface ConversationEngine {
    buildChain(template: string, templateData: any): Promise<any>; // arreglo con las variables
    buildMemoryMethod(): Promise<any>;
}