import { createInterface } from 'node:readline';
import { promisify } from 'node:util';
import { AppContainer } from './assembler';
import { ConversationController } from './infrastructure/controllers/conversation-controller';

const main = async () => {
    return await listen();
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

const processMessage = async (message: string) => {
    const data = {
        body: message,
    };
    try {
        const controller = AppContainer.get<ConversationController>(ConversationController);
        const { result } = await controller.conversation(data);
        return result;
    } catch (error: any) {
        console.error('Error:', error);
        return { error };
    }
};

main();
