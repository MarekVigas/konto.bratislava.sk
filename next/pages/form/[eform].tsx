import { FormDefinition } from '@backend/forms/types'
import { getFormDefinition } from '@backend/utils/forms'
import GeneratedFormRJSF from 'components/forms/GeneratedFormRJSF'
import AccountPageLayout from 'components/layouts/AccountPageLayout'
import PageWrapper from 'components/layouts/PageWrapper'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { FormStateProvider } from '../../components/forms/FormStateProvider'
import { useFormDataLoader } from '../../components/forms/useFormDataLoader'
import { forceString, isProductionDeployment } from '../../frontend/utils/general'
import logger from '../../frontend/utils/logger'
import { AsyncServerProps } from '../../frontend/utils/types'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (isProductionDeployment()) return { notFound: true }

  let formDefinition: FormDefinition
  try {
    formDefinition = getFormDefinition(ctx.query.eform)
  } catch (error) {
    logger.error(error)
    return { notFound: true }
  }

  // necessary for page wrappers common for entire web
  const locale = ctx.locale ?? 'sk'

  return {
    props: {
      formDefinition,
      page: {
        locale: ctx.locale,
        localizations: ['sk', 'en']
          .filter((l) => l !== ctx.locale)
          .map((l) => ({
            slug: '',
            locale: l,
          })),
      },
      isProductionDeploy: isProductionDeployment(),
      ...(await serverSideTranslations(locale)),
    },
  }
}

// it looks like we will not need this, but we can keep it for now
// const initDefaultSchemaFields = (schema: StrictRJSFSchema) => {
//   if (!schema || typeof schema !== 'object') return
//   if (schema.type && schema.type !== 'object' && !schema.default) {
//     Object.assign(schema, { default: null })
//   }
//   Object.values(schema).forEach((value) => {
//     if (Array.isArray(value)) {
//       value.forEach((item) => initDefaultSchemaFields(item))
//     } else {
//       initDefaultSchemaFields(value)
//     }
//   })
// }

const FormTestPage = ({
  page,
  formDefinition,
  isProductionDeploy,
}: AsyncServerProps<typeof getServerSideProps>) => {
  const router = useRouter()

  const formSlug = forceString(router.query.eform)
  // Using string.match because CodeQL tools ignore regex.test as SSRF prevention.
  // eslint-disable-next-line unicorn/prefer-regexp-test
  const escapedSlug = formSlug.match(/^[\dA-Za-z-]+$/) ? formSlug : ''
  const pageSlug = `form/${escapedSlug}`
  const initialFormData = useFormDataLoader(formDefinition)

  return (
    <PageWrapper
      locale={page.locale}
      localizations={[
        { locale: 'sk', slug: pageSlug },
        { locale: 'en', slug: pageSlug },
      ]}
    >
      <AccountPageLayout isPublicPage hiddenHeaderNav isProductionDeploy={isProductionDeploy}>
        {initialFormData && (
          <FormStateProvider
            eformSlug={escapedSlug}
            formDefinition={formDefinition}
            initialFormData={initialFormData}
          >
            <GeneratedFormRJSF
              formDefinition={formDefinition}
              escapedSlug={escapedSlug}
              formSlug={formSlug}
              initialFormData={initialFormData}
            />
          </FormStateProvider>
        )}
      </AccountPageLayout>
    </PageWrapper>
  )
}

export default FormTestPage
