import { injectable } from 'inversify';
import moment from 'moment';
import { readFile, writeFile } from 'node:fs/promises';
import { ConversationStore } from '../ports/conversation-store';

@injectable()
export class JSONConversationStoreImpl implements ConversationStore {
    async saveInteraction(data: any): Promise<any> {
        const { phone, message, response, tokens, sid, summary } = data;
        const filename = phone.substring(10) + '.json';
        const path = `./chats/${filename}`;
        const conversationHistory = await this.getHistory(path);
        const messageDate = moment().format('DD-MM-YYYY hh:mm');
        const interaction = {
            phone,
            date: messageDate,
            message,
            response,
            tokens,
            sid,
        };

        let content;
        try {
            if (conversationHistory.error !== undefined) {
                const history = [];
                history.push(interaction);
                content = JSON.stringify({ summary, history });
                return await writeFile(path, content, 'utf-8');
            } else {
                conversationHistory.summary = summary;
                conversationHistory.history.push(interaction);
                content = JSON.stringify(conversationHistory);
                return await writeFile(path, content, 'utf-8');
            }
        } catch (error: any) {
            return { error };
        }
    }

    async getSummary(data: any): Promise<any> {
        const { phone } = data;
        const filename = phone.substring(10) + '.json';
        const path = `./chats/${filename}`;
        const content = await this.getHistory(path);
        data.summary = content.summary !== undefined ? content.summary : '';
        return data;
    }

    async getMessages(history: any): Promise<any> {
        try {
            const messages = history.history;
            const summary = messages
                .map((obj: any) => 'Colaborador: ' + obj.message + '\nAsesor: ' + obj.response)
                .join('\n');
            return summary;
        } catch (error: any) {
            return error.code === 'ENOENT' ? error.code : { error };
        }
    }

    private async getHistory(path: string): Promise<any> {
        try {
            const currentFile = await readFile(path, 'utf-8');
            return JSON.parse(currentFile);
        } catch (error: any) {
            return { error };
        }
    }
}
