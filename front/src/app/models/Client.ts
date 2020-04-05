/* tslint:disable:variable-name */
import {Deserializable} from './deserializable.model';
import {User} from "./User";

export class Client implements Deserializable {

  id: number;
  name: string;
  description?: string;
  csv_file?: File | null;
  no_leads?: number | null;
  user?: User;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }

}
