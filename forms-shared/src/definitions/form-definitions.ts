import { Schemas } from '../generator/functions'
import stanoviskoKInvesticnemuZameru from './stanovisko-k-investicnemu-zameru'
import predzahradky from './predzahradky'
import priznanieKDaniZNehnutelnosti from './priznanie-k-dani-z-nehnutelnosti'
import { generalTermsAndConditions, taxTermsAndConditions } from './terms-and-conditions'
import zavazneStanoviskoKInvesticnejCinnosti from './zavazne-stanovisko-k-investicnej-cinnosti'
import komunitneZahrady from './komunitne-zahrady'

export enum FormDefinitionType {
  SlovenskoSkGeneric = 'SlovenskoSkGeneric',
  SlovenskoSkTax = 'SlovenskoSkTax',
  Email = 'Email',
}

type FormDefinitionBase = {
  slug: string
  title: string
  schemas: Schemas
  termsAndConditions: string
  messageSubjectDefault: string
  messageSubjectFormat?: string
}

type FormDefinitionSlovenskoSkBase = FormDefinitionBase & {
  slovenskoSkUrl: string
  pospID: string
  pospVersion: string
  gestor: string
  isSigned: boolean
}

export type FormDefinitionSlovenskoSkGeneric = FormDefinitionSlovenskoSkBase & {
  type: FormDefinitionType.SlovenskoSkGeneric
  ginisAssignment: {
    ginisOrganizationName: string
    ginisPersonName: string
  }
}

export type FormDefinitionSlovenskoSkTax = FormDefinitionSlovenskoSkBase & {
  type: FormDefinitionType.SlovenskoSkTax
}

export type FormDefinitionSlovenskoSk =
  | FormDefinitionSlovenskoSkGeneric
  | FormDefinitionSlovenskoSkTax

export type FormDefinitionEmail = FormDefinitionBase & {
  type: FormDefinitionType.Email
  email: string
}

export type FormDefinition =
  | FormDefinitionSlovenskoSkGeneric
  | FormDefinitionSlovenskoSkTax
  | FormDefinitionEmail

export const formDefinitions: FormDefinition[] = [
  {
    type: FormDefinitionType.SlovenskoSkGeneric,
    slovenskoSkUrl:
      'https://formulare.slovensko.sk/_layouts/eFLCM/DetailVzoruEFormulara.aspx?vid=00603481.stanoviskoKInvesticnemuZameru&vh=0&vl=8',
    slug: 'stanovisko-k-investicnemu-zameru',
    title: 'Žiadosť o stanovisko k investičnému zámeru',
    schemas: stanoviskoKInvesticnemuZameru,
    pospID: '00603481.stanoviskoKInvesticnemuZameru',
    pospVersion: '0.8',
    gestor: 'Martin Pinter',
    termsAndConditions: generalTermsAndConditions,
    messageSubjectDefault: 'Podanie',
    messageSubjectFormat:
      'e-ZST ž. {stavba.ulica} {stavba.nazov}, p.č. {stavba.parcelneCislo} kú {stavba.kataster}',
    ginisAssignment: {
      ginisOrganizationName: 'OUIC',
      ginisPersonName: 'Vícenová Marcela',
    },
    isSigned: false,
  },
  {
    type: FormDefinitionType.SlovenskoSkGeneric,
    slovenskoSkUrl:
      'https://formulare.slovensko.sk/_layouts/eFLCM/DetailVzoruEFormulara.aspx?vid=00603481.zavazneStanoviskoKInvesticnejCinnosti&vh=0&vl=7',
    slug: 'zavazne-stanovisko-k-investicnej-cinnosti',
    title: 'Žiadosť o záväzné stanovisko k investičnej činnosti',
    schemas: zavazneStanoviskoKInvesticnejCinnosti,
    pospID: '00603481.zavazneStanoviskoKInvesticnejCinnosti',

    pospVersion: '0.7',
    gestor: 'Martin Pinter',
    termsAndConditions: generalTermsAndConditions,
    messageSubjectDefault: 'Podanie',
    messageSubjectFormat:
      'e-SIZ ž. {stavba.ulica} {stavba.nazov}, p.č. {stavba.parcelneCislo} kú {stavba.kataster}',
    ginisAssignment: {
      ginisOrganizationName: 'OUIC',
      ginisPersonName: 'Vícenová Marcela',
    },
    isSigned: false,
  },
  {
    type: FormDefinitionType.SlovenskoSkGeneric,
    slovenskoSkUrl:
      'https://formulare.slovensko.sk/_layouts/eFLCM/DetailVzoruEFormulara.aspx?vid=00603481.predzahradky&vh=1&vl=0',
    slug: 'predzahradky',
    title: 'Predzáhradky',
    schemas: predzahradky,
    pospID: '00603481.predzahradky',
    pospVersion: '1.0',
    gestor: 'Martin Pinter',
    termsAndConditions: generalTermsAndConditions,
    messageSubjectFormat: 'Registrácia - {predzahradka.typRegistracie} predzáhradka',
    messageSubjectDefault: 'Registrácia predzáhradky',
    isSigned: false,
    ginisAssignment: {
      ginisOrganizationName: 'OUIC',
      ginisPersonName: 'Vícenová Marcela',
    },
  },
  {
    type: FormDefinitionType.SlovenskoSkGeneric,
    slovenskoSkUrl:
      'https://formulare.slovensko.sk/_layouts/eFLCM/DetailVzoruEFormulara.aspx?vid=00603481.komunitneZahrady&vh=1&vl=0',
    slug: 'komunitne-zahrady',
    title: 'Komunitné záhrady',
    schemas: komunitneZahrady,
    pospID: '00603481.komunitneZahrady',
    pospVersion: '1.0',
    gestor: 'Martin Pinter',
    termsAndConditions: generalTermsAndConditions,
    messageSubjectDefault: 'Žiadosť o komunitnú záhradu',
    messageSubjectFormat: 'Žiadosť o komunitnú záhradu - {pozemok.typPozemku} mestský pozemok',
    isSigned: false,
    ginisAssignment: {
      ginisOrganizationName: 'OUIC',
      ginisPersonName: 'Vícenová Marcela',
    },
  },
  {
    type: FormDefinitionType.SlovenskoSkTax,
    slovenskoSkUrl:
      'https://formulare.slovensko.sk/_layouts/eFLCM/DetailVzoruEFormulara.aspx?vid=esmao.eforms.bratislava.obec_024&vh=201501&vl=2',
    title: 'Priznanie k dani z nehnuteľností',
    slug: 'priznanie-k-dani-z-nehnutelnosti',
    schemas: priznanieKDaniZNehnutelnosti,
    pospID: 'esmao.eforms.bratislava.obec_024',
    pospVersion: '201501.2',
    gestor: 'Martin Pinter',
    termsAndConditions: taxTermsAndConditions,
    messageSubjectDefault: 'Priznanie k dani z nehnuteľností',
    isSigned: true,
  },
]
