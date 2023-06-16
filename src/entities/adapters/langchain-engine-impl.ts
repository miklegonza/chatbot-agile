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
        console.log("Prompt:", prompt);
        const chain = new LLMChain({ llm: model, prompt });
        console.log('TEMPLATE DATA:', templateData);
        
        return await chain.call(templateData);
    }

    buildMemoryMethod(): Promise<any> {
        throw new Error('Method not implemented.');
    }

}
