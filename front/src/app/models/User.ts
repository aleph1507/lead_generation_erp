import {Deserializable} from './deserializable.model';

export class User implements Deserializable {
  id: number;
  name: string;
  email: string;
  admin: boolean;
  token: string;
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
