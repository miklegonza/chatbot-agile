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
import { ConversationModel } from '../ports/conversation-model';

@injectable()
export class LangchainConversationModelImpl implements ConversationModel {
    private templatePath = './src/behaviors/template-reduced.json';
    private systemTemplate = `La conversación con el colaborador se ha desarrollado de la siguiente manera:
    Historial: {chat_history}
    
    Usa la información contenida en el historial y el siguiente contexto para responder la pregunta del usuario en máximo 60 palabras.
    Si la respuesta a la pregunta involucra un listado de elementos, genera la respuesta en forma de items resumiendo en una frase cada elemento. 
    Si no conoces la respuesta o la pregunta no está relacionada con el contexto dado, dí que no puedes responder a la pregunta, no intentes construir una respuesta.
    
    Contexto: {context}`;

    async buildChain(payload: any): Promise<any> {
        const indexName = process.env.PINECONE_INDEX || '';
        const client = new PineconeClient();
        await client.init({
            apiKey: process.env.PINECONE_API_KEY || '',
            environment: process.env.PINECONE_ENVIRONMENT || '',
        });
        console.log('Ejecutando el query en Pinecone...');

        const pineconeIndex = client.Index(indexName);
        const pineconeStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings(), { pineconeIndex, namespace: 'kanban' });
        const matches = await pineconeStore.similaritySearchWithScore(payload, 2);

        if (!matches.length) {
            return Promise.reject('No hay similitudes. GPT-3 no se usó'); // TODO
        }

        const model = new OpenAI({ modelName: 'gpt-3.5-turbo', verbose: true });

        const concatPageContent = matches
            .map((match: any) => match[0].metadata.pageContent)
            .join(' ')
            .replaceAll('\n', '');

        const messages = [
            SystemMessagePromptTemplate.fromTemplate(this.systemTemplate),
            HumanMessagePromptTemplate.fromTemplate('{question}'),
        ];

        const chatPrompt = ChatPromptTemplate.fromPromptMessages(messages);
        const partialPrompt = await chatPrompt.partial({ context: concatPageContent });

        const vectorStore = await PineconeStore.fromDocuments(
            [new Document({ pageContent: concatPageContent })],
            new OpenAIEmbeddings(),
            {
                pineconeIndex,
                namespace: 'ignore'
            },
        );

        const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
            inputKey: 'question',
            outputKey: 'answer',
            memory: new ConversationSummaryMemory({
                memoryKey: 'chat_history',
                llm: new OpenAI({ modelName: 'gpt-3.5-turbo', temperature: 0, verbose: true }),
            }),
            qaChainOptions: {
                type: 'stuff',
                prompt: partialPrompt,
            },
        });

        const result = await chain.call({
            question: payload,
        });

        const data = {
            message: payload,
            AIResponse: result.text,
            tokens: 10, // TODO
        };
        return data;
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
