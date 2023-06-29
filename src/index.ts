import 'dotenv/config';
import express, { Request, Response, urlencoded } from 'express';
import { AppContainer } from './assembler';
import { ConversationController } from './infrastructure/controllers/conversation-controller';

const port = process.env.PORT;
const app = express();

app.use(urlencoded({ extended: false }));
app.use(express.json());

const listen = async (req: Request, res: Response) => {
    const message = req.body.Body;
    const userPhone = req.body.From;
    console.log(`Received message from ${userPhone}: ${message}`);

    const sent = await processMessage(userPhone, message);
    console.log('Mensaje enviado a', userPhone, ':', sent);
};

const processMessage = async (to: string, message: string) => {
    const payload = {
        body: {
            phone: to,
            message,
        },
    };
    try {
        const controller = AppContainer.get<ConversationController>(ConversationController);
        const { result } = await controller.conversation(payload);
        return result;
    } catch (error: any) {
        console.error('Error:', error);
        return { error };
    }
};

app.get('/', async (req: Request, res: Response) => res.send('Hola mundo :)'));
app.post('/whatsapp', listen);

app.listen(port, () => console.log(`Servidor en el puerto: ${port}`));
