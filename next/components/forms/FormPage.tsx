import cx from 'classnames'
import MenuList from 'components/forms/steps/MenuList'
import { useEffect } from 'react'

import { defaultFormStateBehavior, rjfsValidator } from '../../frontend/utils/form'
import FormControls from './FormControls'
import FormUploadXml from './FormUploadXml'
import FormModals from './segments/FormModals/FormModals'
import FormHeader from './simple-components/FormHeader'
import StepperView from './steps/StepperView'
import FormSummary from './steps/Summary/FormSummary'
import ThemedForm from './ThemedForm'
import { useFormState } from './useFormState'

const FormPage = () => {
  const {
    uiSchema,
    currentStepIndex,
    currentStepperStep,
    currentStepSchema,
    formData,
    handleFormOnSubmit,
    handleFormOnChange,
  } = useFormState()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStepIndex])

  return (
    <>
      <FormHeader />
      <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-10 pb-6 pt-0 lg:flex-row lg:gap-20 lg:py-10">
        <div>
          <StepperView />
          <FormModals />
        </div>
        <div className={cx('grow px-4', 'lg:px-0')}>
          {currentStepperStep.isSummary ? (
            <FormSummary />
          ) : (
            <>
              <h1 className="text-h1-medium font-semibold">{currentStepperStep.title}</h1>
              <ThemedForm
                // This is a hack to force the form to re-render when the step changes, it's hard to say whether it
                // is needed or not, but ensures 100% safety.
                key={`form-step-${currentStepperStep.index}`}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                schema={currentStepSchema!}
                uiSchema={uiSchema}
                formData={formData}
                validator={rjfsValidator}
                onSubmit={(e) => {
                  handleFormOnSubmit(e.formData)
                }}
                onChange={(e) => {
                  handleFormOnChange(e.formData)
                }}
                showErrorList={false}
                // This removes the extra conditional data for the current step, for removing the steps themselves see
                // `handleFormOnChange` implementation.
                omitExtraData
                liveOmit
                experimental_defaultFormStateBehavior={defaultFormStateBehavior}
                // HTML validation doesn't work for our use case, therefore it's turned off.
                noHtml5Validate
              >
                <FormControls />
              </ThemedForm>
            </>
          )}
          <MenuList />
        </div>
      </div>
      <FormUploadXml />
    </>
  )
}

export default FormPage
