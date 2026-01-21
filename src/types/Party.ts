import { ContactMech, Enumeration } from "./index"

export interface Party {
  partyId: string,
  pseudoId?: string,
  partyTypeEnumId?: string,
  disabled?: string,
  customerStatusId?: string,
  ownerPartyId?: string,
  externalId?: string,
  dataSourceId?: string,
  gatewayCimId?: string,
  comments?: string,
  shippingInstructions?: string,
  hasDuplicates?: string,
  lastDupCheckDate?: string,
  mergedToPartyId?: string,
  type?: Enumeration,
  organization?: {
    partyId: string,
    organizationName?: string,
  },
  person?: {
    partyId: string,
    firstName?: string,
    middleName?: string,
    lastName?: string,
  },
  identifications?: Array<PartyIdentification>,
  contactMechs?: Array<{
    partyId: string,
    contactMechId: string,
    contactMechPurposeId: string,
    fromDate: string,
    thruDate?: string,
    extension?: string,
    comments?: string,
    allowSolicitation?: string,
    usedSince?: string,
    usedUntil?: string,
    verifyCode?: string,
    verifyCodeDate?: string,
    verifyCodeAttempts?: number,
    contactMech?: ContactMech,
    purpose?: {
      contactMechPurposeId: string,
      contactMechTypeEnumId?: string,
      description?: string
    }
  }>
}

export interface PartyIdentification {
  partyId: string,
  partyIdTypeEnumId: string,
  idValue?: string,
  issuedBy?: string,
  issuedByPartyId?: string,
  expireDate?: string,
  type?: Enumeration
}
