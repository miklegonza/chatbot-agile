/* import 'dotenv/config';
import express from 'express';
// Router

const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());
//app.use(`/`,routes);

app.listen(port, () => console.log(`Servidor en el puerto: ${port}`)); */

import { AppContainer } from './assembler';
import { ConversationController } from './infrastructure/controllers/conversation-controller';

const template = 'What is a good name for a company that makes {product}?';

const main = async () => {
    try {
        const event = {
            body: {
                template,
                templateData: { product: 'sunglasses' },
            },
        };
        const controller = AppContainer.get<ConversationController>(ConversationController);
        const { result } = await controller.conversation(event);
        console.log('SALIDA:', result.text.replace('\n', ''));
        return result;
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
