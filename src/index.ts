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

    try {
        const controller = AppContainer.get<ConversationController>(ConversationController);
        const { result } = await controller.conversation(payload);
        console.log(`Mensaje enviado a ${phone}:`, result);
        res.status(200).send('ok');
        return result;
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).send('server error');
        return { error };
    }
};

app.post('/whatsapp', listen);

app.listen(port, () => console.log(`Servidor en el puerto: ${port}`));
