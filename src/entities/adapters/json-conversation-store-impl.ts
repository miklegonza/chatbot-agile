import { injectable } from 'inversify';
import { ConversationStore } from '../ports/conversation-store';
import { readFile, writeFile } from 'node:fs/promises';
import moment from 'moment';

@injectable()
export class JSONConversationStoreImpl implements ConversationStore {
    async saveInteraction(data: any, conversationHistory?: any): Promise<any> {
        const path = `./chats/${data.phone}.json`;
        const messageDate = moment().format('DD-MM-YYYY hh:mm');
        const interaction = {
            phone: data.phone,
            date: messageDate,
            message: data.message,
            AIResponse: data.AIResponse,
            tokens: data.tokens,
            sid: data.sid,
        };
        let content;
        try {
            if (conversationHistory.error !== undefined) {
                const history = [];
                history.push(interaction);
                content = JSON.stringify({ history });
                return await writeFile(path, content, 'utf-8');
            } else {
                conversationHistory.history.push(interaction);
                content = JSON.stringify(conversationHistory);
                return await writeFile(path, content, 'utf-8');
            }
        } catch (error: any) {
            return { error };
        }
    }
    async getMessages(history: any): Promise<any> {
        try {
            const messages = history.history;
            const summary = messages
                .map((obj: any) => 'Colaborador: ' + obj.message + '\nAsesor: ' + obj.AIResponse)
                .join('\n');
            return summary;
        } catch (error: any) {
            return error.code === 'ENOENT' ? error.code : { error };
        }
    }
    async getHistory(phone: string): Promise<any> {
        try {
            const path = `./chats/${phone}.json`;
            const currentFile = await readFile(path, 'utf-8');
            return JSON.parse(currentFile);
        } catch (error: any) {
            return { error };
        }
    }
}
