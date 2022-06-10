import { ContactMech } from "./ContactMech"
import { Enumeration } from "./Enumeration"
import { Identification } from "./Identification"

export interface Party {
  partyId: string,
  pseudoId: string, // remove default to partyId
  partyTypeEnumId: string,
  disabled: string,
  customerStatusId: string,
  ownerPartyId: string, // who owns data for this party, like for customer who owns the data
  externalId: string,
  dataSourceId: string,
  gatewayCimId: string,
  comments: string,
  shippingInstructions: string,
  hasDuplicates: string,
  lastDupCheckDate: string,
  mergedToPartyId: string,
  type: Enumeration,
  organization: {
    partyId: string,
    organizationName: string,
  },
  person: {
    partyId: string,
    firstName: string,
    middleName: string,
    lastName: string,
  },
  identifications: Array<Identification>,
  contactMechs: [ // PartyContactMech
    {
      partyId: string,
      contactMechId: string,
      contactMechPurposeId: string,
      fromDate: string,
      thruDate: string,
      extension: string,
      comments: string,
      allowSolicitation: string,
      usedSince: string,
      usedUntil: string,
      verifyCode: string,
      verifyCodeDate: string,
      verifyCodeAttempts: number,
      contactMech: ContactMech,
      purpose: {
        contactMechPurposeId: string,
        contactMechTypeEnumId: string,
        description: string
      }
    }
  ]
}