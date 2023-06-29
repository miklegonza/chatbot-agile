import 'dotenv/config';
import { injectable } from 'inversify';
import { Twilio } from 'twilio';
import { ProviderManager } from '../ports/provider-manager';

@injectable()
export class TwilioProviderManagerImpl implements ProviderManager {
    private readonly accountSID = process.env.TWILIO_SID;
    private readonly authToken = process.env.TWILIO_AUTH_TOKEN;
    private readonly fromNumber = process.env.TWILIO_FROM as string;

    async sendMessage(phone: string, message: string): Promise<any> {
        try {
            const client = new Twilio(this.accountSID, this.authToken);
            const mapMessage = {
                body: message,
                to: phone,
                from: this.fromNumber,
            };
            return await client.messages.create(mapMessage);
        } catch (error: any) {
            console.error('Error:', error);
            return { error };
        }
    }
}
