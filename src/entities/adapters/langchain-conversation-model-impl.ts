import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { ConversationModel } from '../ports/conversation-model';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import { injectable } from 'inversify';

@injectable()
export class LangchainConversationModelImpl implements ConversationModel {

    private templatePath = './src/behaviors/template-example.json';

    async buildChain(payload: any): Promise<any> {

        const templateJSON = await this.loadTemplateFromJSON(this.templatePath);
        console.log('CALL JSON:', templateJSON);

        const model = new OpenAI({ temperature: 0.3 });
        const prompt = new PromptTemplate({
            template: templateJSON.template + '\n\n ¿Qué hace un Scrum Master?',
            inputVariables: templateJSON.templateVariables,
        });
        const chain = new LLMChain({ llm: model, prompt });

        console.log({
            PROMPT: prompt.template,
            PROMPT_VARIABLES: prompt.inputVariables,
            TEMPLATE_DATA: templateJSON.templateData,
        });
        return await chain.call(templateJSON.templateData);
    }

    async buildMemoryMethod(): Promise<any> {
        throw new Error('Method not implemented.');
    }

    async loadTemplateFromJSON(path: string): Promise<any> {
        try {
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
            return { template: behavior.template, templateVariables, templateData };
        } catch (error: any) {
            console.error('Error:', error);
            return { error };
        }
    }
}
