/* tslint:disable:variable-name */
import {Deserializable} from './deserializable.model';

export class Response implements Deserializable {
  id: number;
  message_id?: number;
  text: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
