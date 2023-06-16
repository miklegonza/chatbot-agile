import { Container } from 'inversify';
import 'reflect-metadata';
import { ConversationService } from './application/services/conversation-service';
import { SERVICES, UTILS } from './dictionaries/dictionary';
import { ConversationServiceImpl } from './application/services/conversation-service-impl';
import { ConversationEngine } from './entities/ports/conversation-engine';
import { LangchainEngineImpl } from './entities/adapters/langchain-engine-impl';
import { ConversationController } from './infrastructure/controllers/conversation-controller';

export const AppContainer = new Container();

AppContainer.bind<ConversationController>(ConversationController).to(ConversationController);
AppContainer.bind<ConversationService>(SERVICES.ConversationService).to(ConversationServiceImpl);
AppContainer.bind<ConversationEngine>(UTILS.ConversationEngine).to(LangchainEngineImpl);
