import {Deserializable} from './deserializable.model';
import {Client} from './Client';

export class Lead implements Deserializable {

  id: number;
  //            "id","duxid","VisitTime","Profile","Picture","Degree","First Name","Middle Name","Last Name",
//              "Summary","Title","From","Company","CompanyProfile","CompanyWebsite","PersonalWebsite",
//              "Email","Phone","IM","Twitter","Location","Industry","My Tags","My Notes",
  duxid?: string;
  visitTime?: string;
  profile?: string;
  picture?: string;
  degree?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  summary?: string;
  title?: string;
  from?: string | number;
  company?: string;
  companyProfile?: string;
  companyWebsite?: string;
  personalWebsite?: string;
  email?: string;
  phone?: string;
  IM?: string;
  twitter?: string;
  location?: string;
  industry?: string;
  myTags?: string;
  myNotes?: string;
  client?: Client[];
  parsedClients?: string;
  attach?: any;
  detach?: any;

  status: 'CONTACTED' | 'ACCEPTED' | 'REJECTED' | 'LEAD';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
