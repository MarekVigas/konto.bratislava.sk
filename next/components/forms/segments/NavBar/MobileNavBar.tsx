import { CrossIcon, HamburgerIcon } from '@assets/ui-icons'
import cx from 'classnames'
import { StatusBar, useStatusBarContext } from 'components/forms/info-components/StatusBar'
import HamburgerMenu from 'components/forms/segments/HambergerMenu/HamburgerMenu'
import { MenuItemBase } from 'components/forms/simple-components/MenuDropdown/MenuDropdown'
import { useConditionalFormRedirects } from 'components/forms/useFormRedirects'
import FocusTrap from 'focus-trap-react'
import { useServerSideAuth } from 'frontend/hooks/useServerSideAuth'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

import { ROUTES } from '../../../../frontend/api/constants'
import useElementSize from '../../../../frontend/hooks/useElementSize'
import Brand from '../../simple-components/Brand'
import { Avatar } from './Avatar'
import { useNavMenuContext } from './navMenuContext'

interface MobileMenuNavBarProps {
  className?: string
  sectionsList?: MenuSectionItemBase[]
  menuItems: MenuItemBase[]
}

export interface MenuSectionItemBase {
  id: number
  title: string
  icon: ReactNode
  url: string
}

export const MobileNavBar = ({ className, sectionsList, menuItems }: MobileMenuNavBarProps) => {
  const { isAuthenticated } = useServerSideAuth()
  const [alertRef, { height }] = useElementSize<HTMLDivElement>()

  const { statusBarConfiguration } = useStatusBarContext()
  const [mobileRef] = useElementSize([statusBarConfiguration.content])
  const { isMobileMenuOpen, setMobileMenuOpen } = useNavMenuContext()

  const router = useRouter()

  // we need to keep the work in progress of the open form if navigating away form it
  const optionalFormRedirectsContext = useConditionalFormRedirects()
  const login = () =>
    optionalFormRedirectsContext ? optionalFormRedirectsContext.login() : router.push(ROUTES.LOGIN)

  return (
    <div className={className}>
      <div
        id="mobile-navbar"
        className={cx(className, 'fixed left-0 top-0 z-40 flex w-full gap-x-6 bg-white lg:hidden')}
        ref={mobileRef}
      >
        <div className="w-full">
          {!isMobileMenuOpen && <StatusBar ref={alertRef} />}
          <FocusTrap active={isMobileMenuOpen}>
            <div className="flex h-16 w-full items-center border-b-2 px-8 py-5">
              <div className="flex w-full justify-between">
                <Brand url={ROUTES.HOME} className="grow" />
                {/* event onPress is propagating to menu itself casuing glitches when opening mobile menu,
                becasue of that we are using onClick event and thats why simple button is used */}
                <button
                  type="button"
                  onClick={() => (isAuthenticated ? setMobileMenuOpen((prev) => !prev) : login())}
                  className="-mr-4 px-4 py-5"
                  data-cy="mobile-account-button"
                >
                  <div className="flex w-6 items-center justify-center">
                    {isMobileMenuOpen ? (
                      <CrossIcon className="h-6 w-6" />
                    ) : isAuthenticated && sectionsList ? (
                      <HamburgerIcon />
                    ) : (
                      <Avatar />
                    )}
                  </div>
                </button>
              </div>

              {isMobileMenuOpen && (
                <HamburgerMenu
                  sectionsList={sectionsList}
                  menuItems={menuItems}
                  closeMenu={() => setMobileMenuOpen(false)}
                />
              )}
            </div>
          </FocusTrap>
        </div>
      </div>
      <div className={cx('h-16', className)} />
      <div style={{ height }} aria-hidden className="lg:hidden" />
    </div>
  )
}

export default MobileNavBar
