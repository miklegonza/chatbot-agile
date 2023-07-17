import { PineconeClient } from '@pinecone-database/pinecone';
import 'dotenv/config';
import { injectable } from 'inversify';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { ConversationSummaryMemory } from 'langchain/memory';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { readFile } from 'node:fs/promises';
import { TEMPLATES } from '../../dictionaries/prompts';
import { ConversationModel } from '../ports/conversation-model';

@injectable()
export class LangchainConversationModelImpl implements ConversationModel {
    private readonly PINECONE_INDEX = process.env.PINECONE_INDEX || '';
    private readonly PINECONE_API_KEY = process.env.PINECONE_API_KEY || '';
    private readonly PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT || '';
    private embeddingsModel = new OpenAIEmbeddings();
    private languageModel = new OpenAI({ modelName: 'gpt-3.5-turbo', temperature: 0, verbose: true });
    private readonly templatePath = './src/behaviors/template-reduced.json';
    private readonly systemTemplate = TEMPLATES.systemTemplate;

    /**
     * Creates the <ConversationalRetrievalQAChain/> that converts the retreived text to a
     * meaningful answer.
     *
     * @param payload question to ask to the model
     * @returns Object with the result to be sent to the user
     */
    async buildChain(payload: any): Promise<any> {
        const { message } = payload;
        const vectorStore = await this.queryPinecone(message);

        const chain = ConversationalRetrievalQAChain.fromLLM(this.languageModel, vectorStore.asRetriever(), {
            inputKey: 'question',
            outputKey: 'answer',
            memory: new ConversationSummaryMemory({
                memoryKey: 'chat_history',
                llm: this.languageModel,
            }),
            qaChainOptions: {
                type: 'stuff',
                prompt: this.buildPrompt(),
            },
        });

        const result = await chain.call({
            question: message,
        });

        payload.response = result.text;
        payload.tokens = 10; // TODO

        return payload;
    }

    /**
     * Creates the Pinecone client and gets the index instance to make the similarity search.
     *
     * @param question The question to be converted to embeddings and compared to the DB info
     * @returns Pinecone vector store with the information retreived
     */
    private async queryPinecone(question: string): Promise<PineconeStore> {
        const indexName = this.PINECONE_INDEX || '';
        const client = new PineconeClient();
        await client.init({
            apiKey: this.PINECONE_API_KEY || '',
            environment: this.PINECONE_ENVIRONMENT || '',
        });
        console.log('Ejecutando el query en Pinecone...');

        const pineconeIndex = client.Index(indexName);
        const pineconeStore = await PineconeStore.fromExistingIndex(this.embeddingsModel, {
            pineconeIndex,
            namespace: 'scrum' || 'kanban',
        });
        const matches = await pineconeStore.similaritySearchWithScore(question, 2);

        if (!matches.length) {
            return Promise.reject('No hay similitudes. GPT-3 no se usó'); // TODO
        }

        const concatPageContent = matches
            .map((match: any) => match[0].metadata.pageContent)
            .join(' ')
            .replaceAll('\n', '');

        return await PineconeStore.fromDocuments(
            [new Document({ pageContent: concatPageContent })],
            this.embeddingsModel,
            {
                pineconeIndex,
                namespace: 'ignore',
            },
        );
    }

    /**
     * Creates and formats the chat prompt template.
     *
     * @returns Prompt template
     */
    private buildPrompt(): ChatPromptTemplate {
        const messages = [
            SystemMessagePromptTemplate.fromTemplate(this.systemTemplate),
            HumanMessagePromptTemplate.fromTemplate('{question}'),
        ];

        return ChatPromptTemplate.fromPromptMessages(messages);
    }

    /**
     * Loads the template from the JSON respository and formats it.
     *
     * @param path The route of the template
     * @returns Formatted template from a JSON file
     */
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
                business_definitions: behavior.business_definitions.join(', '),
            };
            const templateVariables = Object.keys(templateData);
            return { template: behavior.template + format, templateVariables, templateData };
        } catch (error: any) {
            console.error('Error:', error);
            return { error };
        }
    }
}
