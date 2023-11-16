/* eslint-disable import/no-extraneous-dependencies,import/no-relative-packages */
import type { UIOptionsType } from '@rjsf/utils'

import { AccordionBase } from '../../components/forms/simple-components/Accordion'
import { FieldSize } from '../../components/forms/widget-components/FieldBase'

// TODO: Reconsider stability of dependency on AccordionBase type
export type CustomComponentAccordionProps = AccordionBase

export type CustomComponentAdditionalLinksProps = {
  links: {
    title: string
    href: string
  }[]
}

export type CustomComponentPropertyCalculator = {
  label: string
  formula: string
  missingFieldsMessage: string
  unit: string
  /**
   * The dataContextLevelsUp is an optional parameter that specifies the number of levels to go up in the JSON data
   * context for formula in hierarchy from the current position. This is useful when you want to retrieve or access data
   * from an upper level in the JSON object.
   */
  dataContextLevelsUp?: number
}

export type CustomComponentPropertyCalculatorProps = {
  label?: string
  variant: 'white' | 'black'
  calculators: CustomComponentPropertyCalculator[]
}

export type CustomComponentType =
  | {
      type: 'accordion'
      props: CustomComponentAccordionProps
    }
  | {
      type: 'additionalLinks'
      props: CustomComponentAdditionalLinksProps
    }
  | {
      type: 'propertyTaxCalculator'
      props: CustomComponentPropertyCalculatorProps
    }

export type LabelSize = 'default' | 'h4' | 'h3'
export type LabelSpacing = 'default' | 'h4' | 'h3'

export type FormSpacingType = 'large' | 'default' | 'small' | 'medium' | 'none'

export type WidgetSpacing = {
  spaceTop?: FormSpacingType
  spaceBottom?: FormSpacingType
}

export type WidgetUiOptions = WidgetSpacing & {
  tooltip?: string
  helptext?: string
  helptextHeader?: string
  className?: string
  belowComponents?: CustomComponentType[]
  rightComponents?: CustomComponentType[]
  size?: FieldSize
  labelSize?: LabelSize
  labelSpacing?: LabelSpacing
}

type CheckboxOption = {
  value: string
  tooltip?: string
}

export type CheckboxGroupUiOptions = {
  variant?: 'basic' | 'boxed'
  checkboxOptions?: CheckboxOption[]
} & WidgetUiOptions

export type CheckboxUiOptions = {
  variant?: 'basic' | 'boxed'
  checkboxLabel?: string
} & WidgetUiOptions

export type DatePickerUiOptions = WidgetUiOptions

export type InputUiOptions = {
  type?: 'text' | 'password' | 'email' | 'tel' | 'number'
  resetIcon?: boolean
  leftIcon?: 'person' | 'mail' | 'call' | 'lock'
} & WidgetUiOptions &
  Pick<UIOptionsType, 'placeholder'>

type RadioOption = {
  value: string
  tooltip?: string
  description?: string
}

export type RadioGroupUiOptions = {
  className?: string
  radioOptions?: RadioOption[]
  variant?: 'basic' | 'boxed' | 'card'
  orientations?: 'column' | 'row'
} & WidgetUiOptions

export type SelectUiOptions = {
  dropdownDivider?: boolean
  selectAllOption?: boolean
  hideScrollbar?: boolean
  // selectType?: 'one' | 'multiple' | 'arrow' | 'radio'
} & WidgetUiOptions

export type TextAreaUiOptions = WidgetUiOptions & Pick<UIOptionsType, 'placeholder'>

export type TimePickerUiOptions = WidgetUiOptions

export type FileUploadUiOptions = {
  sizeLimit?: number
  accept?: string
  type?: 'button' | 'dragAndDrop'
} & WidgetUiOptions

export type CustomComponentFieldUiOptions = Pick<WidgetUiOptions, 'spaceTop' | 'spaceBottom'> & {
  customComponents?: CustomComponentType[]
}

export type ArrayFieldUiOptions = Pick<WidgetUiOptions, 'spaceTop' | 'spaceBottom'> & {
  hideTitle?: boolean
  description?: string
  addButtonLabel: string
  itemTitle?: string
} & (
    | {
        variant: 'topLevel'
        addTitle?: string
        addDescription?: string
      }
    | {
        variant: 'nested'
      }
  )

export type ObjectFieldUiOptions = Pick<WidgetUiOptions, 'spaceTop' | 'spaceBottom'> &
  (
    | {
        objectDisplay?: 'columns'
        /**
         * Slash separated numeric values, e.g. '1/2' or '1/2/3'
         */
        objectColumnRatio?: string
      }
    | {
        objectDisplay?: 'boxed'
        title?: string
        description?: string
      }
  )

export type SchemaUiOptions = {
  moreInformationUrl?: string
  titlePath?: string
  titleFallback?: string
}

/**
 * Unique prefix for Markdown text.
 */
export const markdownTextPrefix = `markdown_gKgflRNwdS:`
