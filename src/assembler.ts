import { Container } from 'inversify';
import 'reflect-metadata';
import { ConversationService } from './application/services/conversation-service';
import { ConversationServiceImpl } from './application/services/conversation-service-impl';
import { SERVICES, UTILS } from './dictionaries/dictionary';
import { JSONConversationStoreImpl } from './entities/adapters/json-conversation-store-impl';
import { LangchainConversationModelImpl } from './entities/adapters/langchain-conversation-model-impl';
import { TwilioConversationSenderImpl } from './entities/adapters/twilio-conversation-sender-impl';
import { ConversationModel } from './entities/ports/conversation-model';
import { ConversationStore } from './entities/ports/conversation-store';
import { ConversationSender } from './entities/ports/conversation-sender';
import { ConversationReceiver } from './entities/ports/conversation-receiver';
import { ConversationController } from './infrastructure/controllers/conversation-controller';
import { ConversationReceiverImpl } from './entities/adapters/conversation-receiver-impl';

export const AppContainer = new Container();

AppContainer.bind<ConversationController>(ConversationController).to(ConversationController);
AppContainer.bind<ConversationService>(SERVICES.ConversationService).to(ConversationServiceImpl);
AppContainer.bind<ConversationModel>(UTILS.ConversationModel).to(LangchainConversationModelImpl);
AppContainer.bind<ConversationStore>(UTILS.ConversationStore).to(JSONConversationStoreImpl);
AppContainer.bind<ConversationSender>(UTILS.ConversationSender).to(TwilioConversationSenderImpl);
AppContainer.bind<ConversationReceiver>(UTILS.ConversationReceiver).to(ConversationReceiverImpl);
