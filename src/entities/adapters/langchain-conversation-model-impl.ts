import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { ConversationModel } from '../ports/conversation-model';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { ConversationChain } from 'langchain/chains';
import { ConversationSummaryMemory } from 'langchain/memory';
import { injectable } from 'inversify';

@injectable()
export class LangchainConversationModelImpl implements ConversationModel {
    private templatePath = './src/behaviors/template-reduced.json';

    async buildChain(payload: any): Promise<any> {
        const templateJSON = await this.loadTemplateFromJSON(this.templatePath);
        //console.log('CALL JSON:', templateJSON);

        const model = new OpenAI({ temperature: 0.3 });
        const memory = new ConversationSummaryMemory({
            memoryKey: 'chat_history',
            llm: new OpenAI({ modelName: 'gpt-3.5-turbo', temperature: 0 }),
        });
        const promptTemplate = PromptTemplate.fromTemplate(templateJSON.template);
        const prompt = await promptTemplate.partial(templateJSON.templateData);
        const chain = new ConversationChain({
            llm: model,
            prompt,
            memory,
            verbose: true,
        });
        const res = await chain.call({ input: payload });
        console.log({res, memory: await memory.loadMemoryVariables({})});
        
        return res;
    }

    private buildPrompt(): string {
        return '';
    }

    private async loadTemplateFromJSON(path: string): Promise<any> {
        try {
            const format = `Conversación actual:
            {chat_history}
            Colaborador: {input}
            Asesor:`;
            const content = await readFile(path, 'utf-8');
            const behavior = JSON.parse(content);
            const templateData = {
                skin: behavior.skin,
                speciality: behavior.speciality,
                skin_rules: behavior.skin_rules.join(', '),
                system_rules: behavior.system_rules.join(', '),
                skin_tasks: behavior.skin_tasks.join(', '),
                business_definitions: behavior.business_definitions.join(', '),
                business_rules: behavior.business_rules.join(', '),
            };
            const templateVariables = Object.keys(templateData);
            return { template: behavior.template + format, templateVariables, templateData };
        } catch (error: any) {
            console.error('Error:', error);
            return { error };
        }
    }
}
