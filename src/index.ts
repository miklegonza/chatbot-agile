import 'dotenv/config';
import express, { Request, Response, urlencoded } from 'express';
import { AppContainer } from './assembler';
import { ConversationController } from './infrastructure/controllers/conversation-controller';

const port = process.env.PORT;
const app = express();

app.use(urlencoded({ extended: false }));
app.use(express.json());

const listen = async (req: Request, res: Response) => {
    const phone = req.body.From;
    const message = req.body.Body;
    const payload = {
        body: { phone, message },
    };
    console.log(`Mensaje recibido de ${phone}: ${message}`);

    const result = await call(payload);

    res.status(result.status).send(result.response);

    return result.result || result.error;
};

const call = async (payload: any) => {
    try {
        const controller = AppContainer.get<ConversationController>(ConversationController);
        const { result } = await controller.conversation(payload);
        console.log(`Mensaje enviado a ${payload.body.phone}:`, result.response);
        return { result, status: 200, response: 'ok' };
    } catch (error: any) {
        console.error('Error:', error);
        return { error, status: 500, response: 'server error' };
    }
};

app.post('/whatsapp', listen);

app.listen(port, () => console.log(`Servidor en el puerto: ${port}`));
