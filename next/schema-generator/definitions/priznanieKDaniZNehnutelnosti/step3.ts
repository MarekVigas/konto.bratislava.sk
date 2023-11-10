import {
  arrayField,
  conditionalFields,
  datePicker,
  fileUpload,
  input,
  markdownText,
  number,
  object,
  radioGroup,
  select,
  skipSchema,
  step,
  textArea,
} from '../../generator/functions'
import { createCondition, createStringOptions } from '../../generator/helpers'
import { pouzitKalkulacku } from './kalkulacky'
import { pravnyVztahSpoluvlastnictvo } from './pravnyVztahSpoluvlastnictvo'
import { StepEnum } from './stepEnum'
import { vyplnitKrokRadio } from './vyplnitKrokRadio'

const podielPriestoruNaSpolocnychCastiachAZariadeniachDomu = input(
  'podielPriestoruNaSpolocnychCastiachAZariadeniachDomu',
  {
    title: 'Podiel priestoru na spoločných častiach a zariadeniach domu',
    required: true,
    format: 'ratio',
  },
  {
    placeholder: 'Napr. 4827/624441',
    helptext:
      'Zadávajte celý zlomok. Nájdete ho vedľa údajov o vchode, poschodí a čísle bytu. Zobraziť ukážku',
  },
)

const spoluvlastnickyPodiel = input(
  'spoluvlastnickyPodiel',
  { title: 'Spoluvlastnícky podiel', required: true, format: 'ratio' },
  {
    placeholder: 'Napr. 1/1 alebo 1/105',
    helptext: 'Zadávajte celý zlomok. Nájdete ho vedľa údajov o mene vlastníkov. Zobraziť ukážku',
  },
)

const vymeraPozemku = number(
  'vymeraPozemku',
  { title: 'Vaša výmera pozemku', required: true },
  {
    helptext:
      'Zadajte výsledok výpočtu vašej časti/podielu na výmere pozemku ako číslo na dve desatinné čísla - bez zaokrúhlenia (napr. 0,65)',
  },
)

const innerArray = (kalkulacka: boolean) =>
  arrayField(
    'danZPozemkov',
    { title: 'Priznania k dani z pozemkov', required: true },
    {
      hideTitle: true,
      variant: 'topLevel',
      addTitle: 'Podávate priznanie aj za ďalší pozemok?',
      addDescription:
        'V prípade, že podávate priznanie aj za ďalší pozemok, ktorý je na inom liste vlastníctva, pridajte ďalšie priznanie.',
      addButtonLabel: 'Pridať ďalšie priznanie',
      itemTitle: 'Priznanie k dani z pozemkov č. {index}',
    },
    [
      ...pravnyVztahSpoluvlastnictvo(StepEnum.DanZPozemkov),
      arrayField(
        'pozemky',
        { title: 'Pozemky', required: true },
        {
          variant: 'nested',
          addButtonLabel: 'Pridať ďalší pozemok (na tom istom LV)',
          itemTitle: 'Pozemok č. {index}',
          description: markdownText(
            'Pozemky pod stavbami, v ktorej máte nehnuteľnosť, sa nezdaňujú. Sčítate len tie, ktoré majú iný kód využitia ako”15”. Ak máte len parcely s kódom “15”, zadajte do pola číslo 0.\n\n::form-image-preview[Zobraziť ukážku]{#https://cdn-api.bratislava.sk/strapi-homepage/upload/oprava_cyklocesty_kacin_7b008b44d8.jpg}',
          ),
        },
        [
          input(
            'cisloListuVlastnictva',
            { title: 'Číslo listu vlastníctva' },
            { size: 'small', placeholder: 'Napr. 4567' },
          ),
          select(
            'kataster',
            {
              title: 'Názov katastrálneho územia',
              required: true,
              options: createStringOptions(
                [
                  'Čuňovo',
                  'Devín',
                  'Devínska Nová Ves',
                  'Dúbravka',
                  'Jarovce',
                  'Karlova Ves',
                  'Lamač',
                  'Nivy',
                  'Nové Mesto',
                  'Petržalka',
                  'Podunajské Biskupice',
                  'Rača',
                  'Rusovce',
                  'Ružinov',
                  'Staré mesto',
                  'Trnávka',
                  'Vajnory',
                  'Vinohrady',
                  'Vrakuňa',
                  'Záhorská Bystrica',
                ],
                false,
              ),
            },
            {
              dropdownDivider: true,
            },
          ),
          object(
            'parcelneCisloSposobVyuzitiaPozemku',
            { required: true },
            {
              objectDisplay: 'columns',
              objectColumnRatio: '1/1',
            },
            [
              input(
                'parcelneCislo',
                { title: 'Parcelné číslo', required: true },
                {
                  placeholder: 'Napr. 7986/1',
                  helptext:
                    'Zadávajte číslo s lomítkom. Nachádza sa 1. v poradí v tabuľke na LV. Zobraziť ukážku',
                },
              ),
              input(
                'sposobVyuzitiaPozemku',
                { title: 'Spôsob využitia pozemku', required: true },
                {},
              ),
            ],
          ),
          select(
            'druhPozemku',
            {
              title: 'Druh pozemku',
              required: true,
              options: createStringOptions(['TODO 1', 'TODO 2'], false),
            },
            {
              helptext:
                'V prípade, že máte vydané právoplatné stavebné povolenie na stavbu vyberte možnosť G - Stavebné pozemky. Zobraziť ukážku',
              dropdownDivider: true,
            },
          ),
          radioGroup(
            'hodnotaUrcenaZnaleckymPosudkom',
            {
              type: 'boolean',
              title: 'Je hodnota pozemku určená znaleckým posudkom?',
              required: true,
              options: [
                { value: true, title: 'Áno' },
                { value: false, title: 'Nie', isDefault: true },
              ],
            },
            {
              variant: 'boxed',
              orientations: 'row',
            },
          ),
          conditionalFields(
            createCondition([[['hodnotaUrcenaZnaleckymPosudkom'], { const: true }]]),
            [
              fileUpload(
                'znaleckyPosudok',
                {
                  title: 'Nahrajte znalecký posudok',
                  required: true,
                  multiple: true,
                },
                {
                  type: 'dragAndDrop',
                  helptext: markdownText(
                    'V prvom kroku je potrebné nahratie skenu znaleckého posudku. Po odoslaní elektronického formulára doručte, prosím, znalecký posudok v listinnej podobe na [oddelenie miestnych daní, poplatkov a licencií](https://bratislava.sk/mesto-bratislava/dane-a-poplatky). Z posudku sa následne použije hodnota pri výpočte dane z pozemku/ov.',
                  ),
                },
              ),
            ],
          ),
          kalkulacka
            ? podielPriestoruNaSpolocnychCastiachAZariadeniachDomu
            : skipSchema(podielPriestoruNaSpolocnychCastiachAZariadeniachDomu),
          kalkulacka ? spoluvlastnickyPodiel : skipSchema(spoluvlastnickyPodiel),
          kalkulacka ? skipSchema(vymeraPozemku) : vymeraPozemku,
          object(
            'datumy',
            {},
            {
              objectDisplay: 'columns',
              objectColumnRatio: '1/1',
            },
            [
              datePicker(
                'datumVznikuDanovejPovinnosti',
                { title: 'Dátum vzniku daňovej povinnosti' },
                {
                  helptext:
                    'Vypĺňate len v prípade, ak ste pozemok zdedili alebo vydražili (v tom prípade uvediete prvý deň mesiaca nasledujúceho po tom, v ktorom ste nehnuteľnosť nadobudli)',
                },
              ),
              datePicker(
                'datumZanikuDanovejPovinnosti',
                { title: 'Dátum zániku daňovej povinnosti' },
                {
                  helptext:
                    'Vypĺňate len v prípade, ak ste pozemok predali alebo darovali (uvediete dátum 31.12.rok predaja/darovania)',
                },
              ),
            ],
          ),
        ],
      ),
      textArea(
        'poznamka',
        { title: 'Poznámka' },
        { placeholder: 'Tu môžete napísať doplnkové informácie' },
      ),
    ],
  )

export default step(
  'danZPozemkov',
  { title: 'Priznanie k dani z pozemkov', stepperTitle: 'Daň z pozemkov' },
  vyplnitKrokRadio({
    title: 'Chcete podať daňové priznanie k dani z pozemkom?',
    helptext: markdownText(
      `K úspešnému vyplneniu oddielov k pozemkom potrebujete list vlastníctva (LV) k pozemkom. Ide o tú časť LV, kde máte v časti A: MAJETKOVÁ PODSTATA uvedené parcely registra "C", resp. "E" registrované na katastrálnej mape.\n\nV prípade, že sa vás daň z pozemkov netýka, túto časť preskočte.`,
    ),
    fields: pouzitKalkulacku({
      title: 'Kalkulačka výpočtu {name}',
      checkboxLabel: 'Chcem pomôcť s výpočtom a použiť kalkulačku výpočtu podlahovej plochy',
      helptextHeader: 'Vysvetlene k comu sluzi kalkulacka. Lorem ipsum dolor sit amet consectetur.',
      inner: innerArray,
    }),
  }),
)
