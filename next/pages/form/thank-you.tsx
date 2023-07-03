import AccountPageLayout from 'components/layouts/AccountPageLayout'
import PageWrapper from 'components/layouts/PageWrapper'
import { GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ThankYouFormSection from '../../components/forms/segments/AccountSections/ThankYouSection/ThankYouFormSection'
import { environment } from '../../environment'
import { AsyncServerProps } from '../../frontend/utils/types'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (!environment.featureToggles.forms) return { notFound: true }

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
      ...(await serverSideTranslations(locale)),
    },
  }
}

const AccountThankYouFormPage = ({ page }: AsyncServerProps<typeof getServerSideProps>) => {
  return (
    <PageWrapper locale={page.locale} localizations={page.localizations}>
      <AccountPageLayout hiddenHeaderNav className="bg-gray-50">
        <ThankYouFormSection />
      </AccountPageLayout>
    </PageWrapper>
  )
}

export default AccountThankYouFormPage
