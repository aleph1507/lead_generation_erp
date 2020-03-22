import {Deserializable} from './deserializable.model';

export class Message implements Deserializable {
  id: number;
  text: string;
  // tslint:disable-next-line:variable-name
  approval_request?: 'PENDING' |'APPROVED' | 'REJECTED' | 'ALTERED' | null;
  // tslint:disable-next-line:variable-name
  created_at: Date;
  // tslint:disable-next-line:variable-name
  updated_at: Date;
  // tslint:disable-next-line:variable-name
  deleted_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
