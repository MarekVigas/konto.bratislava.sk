import { ROUTES } from '@utils/constants'
import { AsyncServerProps } from '@utils/types'
import useAccount, { AccountStatus } from '@utils/useAccount'
import AccountActivator from 'components/forms/segments/AccountActivator/AccountActivator'
import AccountContainer from 'components/forms/segments/AccountContainer/AccountContainer'
import EmailVerificationForm from 'components/forms/segments/EmailVerificationForm/EmailVerificationForm'
import LoginForm from 'components/forms/segments/LoginForm/LoginForm'
import LoginRegisterLayout from 'components/layouts/LoginRegisterLayout'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect } from 'react'

import PageWrapper from '../components/layouts/PageWrapper'
import { isProductionDeployment } from '../utils/utils'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const locale = ctx.locale ?? 'sk'

  return {
    props: {
      page: {
        locale: ctx.locale,
        localizations: ['sk', 'en']
          .filter((l) => l !== ctx.locale)
          .map((l) => ({
            slug: '',
            locale: l,
          })),
      },
      isProductionDeployment: isProductionDeployment(),
      ...(await serverSideTranslations(locale)),
    },
  }
}

const LoginPage = ({ page }: AsyncServerProps<typeof getServerSideProps>) => {
  const { login, error, status, resendVerificationCode, verifyEmail, lastEmail, user } =
    useAccount()
  const router = useRouter()

  const redirect = () => {
    const from =
      router.query.from &&
      typeof router.query.from === 'string' &&
      router.query.from.startsWith('/')
        ? decodeURIComponent(router.query.from)
        : ROUTES.HOME
    router.push(from)
  }

  useEffect(() => {
    if (user !== null && user !== undefined) {
      router.push(ROUTES.HOME)
    }
  }, [user])

  const onLogin = async (email: string, password: string) => {
    if (await login(email, password)) {
      redirect()
    }
  }

  const onVerifyEmail = async (verificationCode: string) => {
    if (await verifyEmail(verificationCode)) {
      redirect()
    }
  }

  return (
    <PageWrapper locale={page.locale} localizations={page.localizations}>
      <LoginRegisterLayout>
        {status === AccountStatus.Idle && <AccountActivator />}
        <AccountContainer className="md:pt-6 pt-0 mb-0 md:mb-8">
          {status === AccountStatus.EmailVerificationRequired ? (
            <EmailVerificationForm
              lastEmail={lastEmail}
              onResend={resendVerificationCode}
              onSubmit={onVerifyEmail}
              error={error}
              cntDisabled
            />
          ) : (
            <LoginForm onSubmit={onLogin} error={error} />
          )}
        </AccountContainer>
      </LoginRegisterLayout>
    </PageWrapper>
  )
}

export default LoginPage