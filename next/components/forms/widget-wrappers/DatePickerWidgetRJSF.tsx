import { StrictRJSFSchema, WidgetProps } from '@rjsf/utils'
import DatePicker from 'components/forms/widget-components/DateTimePicker/DatePicker'
import WidgetWrapper from 'components/forms/widget-wrappers/WidgetWrapper'
import React from 'react'
import { DatePickerUiOptions } from 'schema-generator/generator/uiOptionsTypes'

interface DatePickerWidgetRJSFProps extends WidgetProps {
  label: string
  options: DatePickerUiOptions & WidgetProps['options']
  value: string | null
  errorMessage?: string
  schema: StrictRJSFSchema
  onChange: (value?: string) => void
}

const DatePickerWidgetRJSF = ({
  label,
  options,
  rawErrors,
  required,
  disabled,
  value,
  onChange,
  readonly,
}: DatePickerWidgetRJSFProps) => {
  const { helptext, helptextHeader, tooltip, size, labelSize } = options

  return (
    <WidgetWrapper options={options}>
      <DatePicker
        label={label}
        errorMessage={rawErrors}
        required={required}
        disabled={disabled || readonly}
        helptext={helptext}
        helptextHeader={helptextHeader}
        tooltip={tooltip}
        value={value ?? null}
        onChange={(value) => onChange(value ?? undefined)}
        size={size}
        labelSize={labelSize}
      />
    </WidgetWrapper>
  )
}
export default DatePickerWidgetRJSF
