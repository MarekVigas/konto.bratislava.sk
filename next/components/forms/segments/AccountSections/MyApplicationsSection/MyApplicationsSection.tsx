import { GetFormsResponseDto } from '@clients/openapi-forms/api'
import { useQuery } from '@tanstack/react-query'
import MyApplicationsList, {
  getDraftApplications,
} from 'components/forms/segments/AccountSections/MyApplicationsSection/MyApplicationsList'
import logger from 'frontend/utils/logger'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext } from 'next/types'
import { useTranslation } from 'next-i18next'
import { ApplicationsListVariant, sections } from 'pages/moje-ziadosti'
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components'

type HeaderNavigationItemBase = {
  title: string
  tag: ApplicationsListVariant
}

const englishToSlovakSectionNames: Record<ApplicationsListVariant, string> = {
  SENT: 'odoslane',
  SENDING: 'odosiela-sa',
  DRAFT: 'koncepty',
}

// this was moved from server side props to client side react-query beacause requests took too long (3-5 second)
// and user had no visual feedback and it looked like page wasn't doing anything after click on 'moje-ziadosti' nav link
// when this task https://github.com/bratislava/konto.bratislava.sk/issues/670 is done it could be moved back to server side props
export const getTotalNumberOfApplications = async (
  variant: ApplicationsListVariant,
  accessTokenSsrReq?: GetServerSidePropsContext['req'],
) => {
  const firstPage = await getDraftApplications(variant, 1, accessTokenSsrReq)
  if (firstPage.countPages === 0) return 0

  const lastPage = await getDraftApplications(variant, firstPage.countPages)
  return (firstPage.countPages - 1) * firstPage.pagination + lastPage.items.length
}

const useTotalCount = (variant: ApplicationsListVariant) => {
  const { data, refetch } = useQuery({
    queryKey: [`ApplicationsCount_${variant}`, variant],
    queryFn: () => getTotalNumberOfApplications(variant),
  })

  return { data, refetch }
}

type MyApplicationsSectionProps = {
  selectedSection: ApplicationsListVariant
  applications?: GetFormsResponseDto
}

const MyApplicationsSection = ({ selectedSection, applications }: MyApplicationsSectionProps) => {
  const { t } = useTranslation('account')
  const title = t('account_section_applications.navigation')
  const router = useRouter()

  const headerNavigationList: HeaderNavigationItemBase[] = [
    { title: t('account_section_applications.navigation_sent'), tag: 'SENT' },
    { title: t('account_section_applications.navigation_sending'), tag: 'SENDING' },
    { title: t('account_section_applications.navigation_draft'), tag: 'DRAFT' },
  ]

  const totalCounts = {
    SENT: useTotalCount('SENT'),
    SENDING: useTotalCount('SENDING'),
    DRAFT: useTotalCount('DRAFT'),
  }

  const refetchApplicationsCount = async () => {
    totalCounts.SENT.refetch().catch((error) => logger.error(error))
    totalCounts.SENDING.refetch().catch((error) => logger.error(error))
    totalCounts.DRAFT.refetch().catch((error) => logger.error(error))
  }

  return (
    <Tabs
      selectedKey={selectedSection}
      onSelectionChange={(key) => {
        router
          .push(
            {
              pathname: router.pathname,
              query: {
                ...router.query,
                sekcia: englishToSlovakSectionNames[key as ApplicationsListVariant],
              },
            },
            undefined,
          )
          .catch((error) => logger.error(error))
      }}
      className="flex flex-col"
    >
      <div className="bg-gray-50 pl-8 lg:pl-0">
        <div className="m-auto h-full w-full max-w-screen-lg flex-col justify-end gap-4 pt-6 lg:gap-6 lg:pt-14">
          <h1 className="text-h1 pt-4">{title}</h1>
          <TabList className="flex max-w-screen-lg gap-4 overflow-auto whitespace-nowrap pt-6 scrollbar-hide lg:gap-6 lg:pt-14">
            {headerNavigationList.map((item) => (
              <Tab
                key={item.tag}
                id={item.tag}
                className="text-20 hover:text-20-semibold data-[selected]:text-20-semibold cursor-pointer py-4 transition-all hover:border-gray-700 data-[selected]:border-b-2 data-[selected]:border-gray-700"
              >
                {item.title}
                {totalCounts[item.tag].data !== undefined ? ` (${totalCounts[item.tag].data})` : ''}
              </Tab>
            ))}
          </TabList>
        </div>
      </div>
      {sections.map((variant) => (
        <TabPanel key={variant} id={variant}>
          <MyApplicationsList
            variant={variant}
            applications={applications}
            refetchApplicationsCount={refetchApplicationsCount}
          />
        </TabPanel>
      ))}
    </Tabs>
  )
}

export default MyApplicationsSection
