export interface ProviderManager {
    sendMessage(phone: string, message: string): Promise<any>;
}