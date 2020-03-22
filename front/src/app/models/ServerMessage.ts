import {Deserializable} from './deserializable.model';

export class ServerMessage implements Deserializable {

  message: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
