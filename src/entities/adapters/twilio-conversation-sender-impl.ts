import 'dotenv/config';
import { injectable } from 'inversify';
import { Twilio } from 'twilio';
import { ConversationSender } from '../ports/conversation-sender';

@injectable()
export class TwilioConversationSenderImpl implements ConversationSender {
    private readonly accountSID = process.env.TWILIO_SID;
    private readonly authToken = process.env.TWILIO_AUTH_TOKEN;
    private readonly fromNumber = process.env.TWILIO_FROM as string;

    async sendMessage(payload: any): Promise<any> {
        const { phone, response } = payload;
        try {
            if (response.length > 1) {
                const client = new Twilio(this.accountSID, this.authToken);
                const mapMessage = {
                    body: response,
                    to: phone,
                    from: this.fromNumber,
                };
                const result = await client.messages.create(mapMessage);
                payload.sid = result.sid;
            } else {
                payload.sid = '---';
            }
            return payload;
        } catch (error: any) {
            console.error('Error:', error);
            return { error };
        }
    }
}
