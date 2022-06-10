import { Enumeration } from "./index";

export interface Identification {
  partyId: string,
  partyIdTypeEnumId: string,
  idValue?: string,
  issuedBy?: string,
  issuedByPartyId?: string,
  expireDate?: string,
  type?: Enumeration
}