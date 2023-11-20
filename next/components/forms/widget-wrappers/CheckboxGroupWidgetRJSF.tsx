import { EnumOptionsType, StrictRJSFSchema, WidgetProps } from '@rjsf/utils'
import WidgetWrapper from 'components/forms/widget-wrappers/WidgetWrapper'
import React from 'react'
import { CheckboxGroupUiOptions } from 'schema-generator/generator/uiOptionsTypes'

import Checkbox from '../widget-components/Checkbox/Checkbox'
import CheckboxGroup from '../widget-components/Checkbox/CheckboxGroup'

interface CheckboxGroupRJSFProps extends WidgetProps {
  options: CheckboxGroupUiOptions & WidgetProps['options']
  value: string[] | null
  schema: StrictRJSFSchema
  onChange: (value: string[]) => void
}

const CheckboxGroupWidgetRJSF = ({
  options,
  value,
  onChange,
  label,
  schema: { maxItems },
  rawErrors,
  required,
  readonly,
}: CheckboxGroupRJSFProps) => {
  const {
    enumOptions,
    className,
    checkboxOptions = [],
    variant = 'basic',
    size,
    labelSize,
    helptext,
    helptextHeader,
  } = options
  if (!enumOptions) return <div />
  const getTooltip = (radioValue: string) => {
    return checkboxOptions.find((option) => option.value === radioValue)?.tooltip
  }
  const isDisabled = (valueName: string) => {
    return value?.length === maxItems && !value?.includes(valueName)
  }
  return (
    <WidgetWrapper options={options}>
      <CheckboxGroup
        errorMessage={rawErrors}
        value={value ?? undefined}
        onChange={onChange}
        className={className}
        label={label}
        required={required}
        disabled={readonly}
        size={size}
        labelSize={labelSize}
        helptext={helptext}
        helptextHeader={helptextHeader}
      >
        {enumOptions.map((option: EnumOptionsType) => {
          return (
            <Checkbox
              key={option.value}
              value={option.value}
              variant={variant}
              isDisabled={isDisabled(option.value as string) || readonly}
              tooltip={getTooltip(option.value as string)}
            >
              {option.label}
            </Checkbox>
          )
        })}
      </CheckboxGroup>
    </WidgetWrapper>
  )
}

export default CheckboxGroupWidgetRJSF