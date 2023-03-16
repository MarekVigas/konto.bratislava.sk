import BusinessIcon from '@assets/images/account/business-icon.svg'
import HelpIcon from '@assets/images/account/help-icon.svg'
import HomeIcon from '@assets/images/account/home-icon.svg'
import LogoutIcon from '@assets/images/account/logout.svg'
import PaymentIcon from '@assets/images/account/payment-icon.svg'
import ProfileIcon from '@assets/images/account/profile.svg'
import { ROUTES } from '@utils/constants'
import useAccount from '@utils/useAccount'
import cx from 'classnames'
import AccountNavBar from 'components/forms/segments/AccountNavBar/AccountNavBar'
import SectionContainer from 'components/forms/segments/SectionContainer/SectionContainer'
import { usePageWrapperContext } from 'components/layouts/PageWrapper'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'

type AccountPageLayoutBase = {
  className?: string
  children: ReactNode
  hiddenHeaderNav?: boolean
}

const sectionsList = [
  {
    id: 0,
    title: 'account:account_section_intro.navigation',
    icon: <HomeIcon />,
    link: '/',
  },
  {
    id: 1,
    title: 'account:account_section_services.navigation',
    icon: <BusinessIcon />,
    link: '/municipal-services',
  },
  {
    id: 2,
    title: 'account:account_section_payment.title',
    icon: <PaymentIcon className="w-6 h-6" />,
    link: '/taxes-and-fees',
  },
  {
    id: 3,
    title: 'account:account_section_help.navigation',
    icon: <HelpIcon />,
    link: '/i-have-a-problem',
  },
]

const menuItems = [
  {
    id: 1,
    title: 'account:menu_profile_link',
    icon: <ProfileIcon />,
    link: '/user-profile',
  },
  {
    id: 2,
    title: 'account:menu_help_link',
    icon: <HelpIcon />,
    link: '/i-have-a-problem',
  },
  {
    id: 3,
    title: 'account:menu_logout_link',
    icon: <LogoutIcon />,
    link: '/logout',
  },
]

const AccountPageLayout = ({ className, children, hiddenHeaderNav }: AccountPageLayoutBase) => {
  const { locale, localizations = [] } = usePageWrapperContext()
  const router = useRouter()
  const { isAuth } = useAccount()
  useEffect(() => {
    if (!isAuth) {
      router.push({ pathname: ROUTES.LOGIN, query: { from: router.route } })
    }
  }, [isAuth])

  const [t] = useTranslation('common')

  const handleLanguageChange = async ({ key }: { key: string }) => {
    const path = localizations.find((l) => l.locale === key)?.slug || ''
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    try {
      await router.push(`/${path}`, undefined, { locale: key })
    } catch (error) {
      // TODO send error to Faro
      console.error(error)
    }
  }

  return (
    <div className={cx('flex flex-col min-h-screen', className)}>
      <SectionContainer>
        <AccountNavBar
          currentLanguage={locale}
          onLanguageChange={handleLanguageChange}
          sectionsList={sectionsList}
          menuItems={menuItems}
          navHidden
          hiddenHeaderNav={hiddenHeaderNav}
          languages={[
            { key: 'sk', title: t('language_long.sk') },
            { key: 'en', title: t('language_long.en') },
          ]}
        />
      </SectionContainer>
      <div className="bg-gray-0">{children}</div>
    </div>
  )
}

export default AccountPageLayout
