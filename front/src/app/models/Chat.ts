import {Deserializable} from './deserializable.model';
import {Message} from './Message';
import {Response} from './Response';
import {Client} from './Client';
import {Lead} from './Lead';

export class Chat implements Deserializable {

  constructor(props = {}) {
    ['client_id', 'lead_id', 'message_id', 'response_id', 'text'].forEach(el => {
      if (props[el]) {
        this[el] = props[el];
      }
    });
  }

  id: number;
  client_id?: number;
  lead_id?: number;
  client?: Client;
  lead?: Lead;
  message?: Message;
  response?: Response;
  text?: string;
  created_at: Date;
  updated_at: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }

}
