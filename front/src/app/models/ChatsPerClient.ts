import {Deserializable} from './deserializable.model';
import {Client} from './Client';
import {Lead} from './Lead';
import {Chat} from './Chat';

export class ChatsPerClient implements Deserializable {

  client?: Client;
  lead?: Lead;
  clientId?: number;
  leadId?: number;
  chats: Chat[];

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
