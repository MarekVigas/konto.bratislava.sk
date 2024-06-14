import { ChevronDownIcon, CrossIcon } from '@assets/ui-icons'
import cx from 'classnames'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Button as AriaButton, Dialog, Modal, ModalOverlay } from 'react-aria-components'

import { FormStepIndex } from '../types/Steps'
import { useFormState } from '../useFormState'
import StepperViewList from './StepperViewList'
import StepperViewRow from './StepperViewRow'
import { useFormSummary } from './Summary/useFormSummary'

type StepperModalProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  handleOnSkipToStep: (stepIndex: FormStepIndex) => void
}

const StepperModal = ({ isOpen, setIsOpen, handleOnSkipToStep }: StepperModalProps) => {
  const { t } = useTranslation('forms')

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      className="fixed left-0 top-0 z-50 h-[var(--visual-viewport-height)] w-screen bg-white outline-0 data-[entering]:animate-stepperSlide data-[exiting]:animate-stepperSlideReverse"
      isDismissable
    >
      <Modal isDismissable isOpen={isOpen} onOpenChange={setIsOpen} className="h-full outline-0">
        <Dialog className="flex h-full flex-col outline-0">
          {({ close }) => (
            <>
              <div className="flex h-14 w-full flex-row items-center gap-1 bg-white p-4 drop-shadow-lg">
                <h6 className="text-h6 grow">{t('all_steps')}</h6>
                <AriaButton
                  className="flex h-full cursor-pointer flex-col justify-center"
                  onPress={close}
                >
                  <CrossIcon className="size-6" />
                </AriaButton>
              </div>
              <nav className="w-full overflow-auto bg-white p-4" data-cy="stepper-mobile">
                <StepperViewList onSkipToStep={handleOnSkipToStep} />
              </nav>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}

const StepperView = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { currentStepperStep, goToStep } = useFormState()
  const { precalculateSummary } = useFormSummary()

  const handleOnClickDropdownIcon = () => {
    if (!isOpen) {
      precalculateSummary()
      setIsOpen(true)
    }
  }

  const handleOnSkipToStep = (stepIndex: FormStepIndex) => {
    goToStep(stepIndex)
    setIsOpen(false)
  }

  return (
    <>
      <nav className="hidden w-[332px] lg:block" data-cy="stepper-desktop">
        <StepperViewList onSkipToStep={handleOnSkipToStep} />
      </nav>
      <div className="lg:hidden">
        <AriaButton
          className={cx(
            'flex h-14 w-full cursor-pointer flex-row items-center gap-5 bg-white p-4 text-left drop-shadow-lg',
          )}
          data-cy="stepper-dropdown"
          onPress={handleOnClickDropdownIcon}
        >
          <StepperViewRow className="grow" step={currentStepperStep} isCurrent />
          <ChevronDownIcon className={cx({ 'rotate-180': !isOpen })} />
        </AriaButton>

        <StepperModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleOnSkipToStep={handleOnSkipToStep}
        />
      </div>
    </>
  )
}

export default StepperView
