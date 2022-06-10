import { Enumeration } from "./Enumeration";

export interface Identification {
  partyId: string,
  partyIdTypeEnumId: string,
  idValue: string,
  issuedBy: string,
  issuedByPartyId: string,
  expireDate: string,
  type: Enumeration
}