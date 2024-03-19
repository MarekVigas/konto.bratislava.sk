import AccountErrorAlert from 'components/forms/segments/AccountErrorAlert/AccountErrorAlert'
import AccountLink from 'components/forms/segments/AccountLink/AccountLink'
import Button from 'components/forms/simple-components/Button'
import InputField from 'components/forms/widget-components/InputField/InputField'
import PasswordField from 'components/forms/widget-components/PasswordField/PasswordField'
import { ROUTES } from 'frontend/api/constants'
import useHookForm from 'frontend/hooks/useHookForm'
import { useTranslation } from 'next-i18next'
import { Controller } from 'react-hook-form'

import { useQueryParamRedirect } from '../../../../frontend/hooks/useQueryParamRedirect'

interface Data {
  email: string
  password: string
}

interface Props {
  onSubmit: (email: string, password: string) => Promise<any>
  error?: Error | null
}

// must use `minLength: 1` to implement required field
const schema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      minLength: 1,
      format: 'email',
      errorMessage: { minLength: 'account:email_required', format: 'account:email_format' },
    },
    password: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'account:password_required' },
    },
  },
  required: ['email', 'password'],
}

const LoginForm = ({ onSubmit, error }: Props) => {
  const { getRouteWithRedirect } = useQueryParamRedirect()
  const { t } = useTranslation('account')

  const {
    handleSubmit,
    control,
    errors,
    formState: { isSubmitting },
  } = useHookForm<Data>({
    schema,
    defaultValues: { email: '', password: '' },
  })

  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={handleSubmit((data: Data) => onSubmit(data.email, data.password))}
      data-cy="login-container"
    >
      <h1 className="text-h3">{t('login_title')}</h1>
      <AccountErrorAlert error={error} />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <InputField
            required
            label={t('email_label')}
            placeholder={t('email_placeholder')}
            {...field}
            errorMessage={errors.email}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <PasswordField
            required
            label={t('password_label')}
            placeholder={t('password_placeholder')}
            {...field}
            errorMessage={errors.password}
          />
        )}
      />
      <AccountLink
        label={t('forgotten_password_link')}
        description={t('forgotten_password_description')}
        href={getRouteWithRedirect(ROUTES.FORGOTTEN_PASSWORD)}
      />
      <Button
        className="min-w-full"
        type="submit"
        text={t('login_submit')}
        variant="category"
        disabled={isSubmitting}
        data-cy="login-button"
      />
      <AccountLink
        label={t('register_link')}
        href={getRouteWithRedirect(ROUTES.REGISTER)}
        description={t('register_description')}
        variant="category"
      />
    </form>
  )
}

export default LoginForm
