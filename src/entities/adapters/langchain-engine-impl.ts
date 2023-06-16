import 'dotenv/config';
import { ConversationEngine } from '../ports/conversation-engine';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import { injectable } from 'inversify';

@injectable()
export class LangchainEngineImpl implements ConversationEngine {
    async buildChain(template: string, templateData: any): Promise<any> {
        const model = new OpenAI({ temperature: 0.3 });
        const prompt = new PromptTemplate({
            template,
            inputVariables: ['product'],
        });
        const chain = new LLMChain({ llm: model, prompt });

        console.log({
            PROMPT: prompt.template,
            PROMPT_VARIABLES: prompt.inputVariables,
            TEMPLATE_DATA: templateData,
        });
        return await chain.call(templateData);
    }

    buildMemoryMethod(): Promise<any> {
        throw new Error('Method not implemented.');
    }
}
