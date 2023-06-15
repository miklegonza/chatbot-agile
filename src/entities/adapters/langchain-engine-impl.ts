import 'dotenv/config';
import { ConversationEngine } from '../ports/conversation-engine';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';

export class LangchainEngineImpl implements ConversationEngine {

    buildChain(template: string): any {
        const model = new OpenAI({ temperature: 0.3 });
        const prompt = new PromptTemplate({
            template,
            inputVariables: ['var1', 'var2'],
        });
        return new LLMChain({ llm: model, prompt });
    }

    buildMemoryMethod(): Promise<any> {
        throw new Error('Method not implemented.');
    }

}
