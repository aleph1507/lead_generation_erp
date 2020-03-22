/* tslint:disable:variable-name */
import {Deserializable} from './deserializable.model';

export class Client implements Deserializable {

  id: number;
  name: string;
  description?: string;
  csv_file?: File | null;
  no_leads?: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }

}
