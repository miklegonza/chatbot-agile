/* import 'dotenv/config';
import express from 'express';
// Router

const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());
//app.use(`/`,routes);

app.listen(port, () => console.log(`Servidor en el puerto: ${port}`)); */

import { createInterface } from 'node:readline';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import { AppContainer } from './assembler';
import { ConversationController } from './infrastructure/controllers/conversation-controller';

const baseTemplate = 'What is a good name for a company that makes {product}?';
const templatePath = './src/behaviors/template-example.json';

const main = async () => {
    return await listen();
};

const processMessage = async (message: string) => {
    const data = {
        body: {
            template: message,
            templateData: { product: 'SCRUM' },
        },
    };
    try {
        const controller = AppContainer.get<ConversationController>(ConversationController);
        const { result } = await controller.conversation(data);
        return result.text.substring(2);
    } catch (error: any) {
        console.error('Error:', error);
        return { error };
    }
};

const listen = async () => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const question = promisify(rl.question).bind<any>(rl);
    const breakLoop = true;
    while (breakLoop) {
        const answer = await question('Mensaje -> ');
        if (answer === 'Terminar') break;
        await send(answer);
    }
    rl.close();
};

const send = async (answer: string) => {
    const response = await processMessage(answer);
    console.log('SALIDA:', response);
};

const loadTemplateFromJSON = async (path: string) => {
    try {
        const content = await readFile(path, 'utf-8');
        const behavior = JSON.parse(content);
        console.log('BEHAVIOR:', behavior);
        const templateData = {
            skin: behavior.skin,
            speciality: behavior.speciality,
            skin_rules: behavior.skin_rules.join(', '),
            system_rules: behavior.system_rules.join(', '),
            skin_tasks: behavior.skin_tasks.join(', '),
            business_definitions: behavior.business_definitions.join(', '),
            business_rules: behavior.business_rules.join(', '),
        };
        console.log('TEMPLATE_DATA_JSON:', templateData);
        return templateData;
    } catch (error: any) {
        console.error('Error:', error);
        return { error };
    }
};

main();

/*
const templateData = {
    skin: behavior.skin,
    speciality: behavior.speciality,
    skin_rules: behavior.skin_rules.join(', '),
    system_rules: behavior.system_rules.join(', '),
    skin_tasks: behavior.skin_tasks.join(', '),
    business_definitions: behavior.business_definitions.join(', '),
    business_rules: behavior.business_rules.join(', ')
}
*/
