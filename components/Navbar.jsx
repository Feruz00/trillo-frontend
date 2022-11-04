/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line no-unused-vars
import { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { FaSun, FaMoon, FaTelegramPlane } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';

import { MdNotifications, MdOutlineLanguage } from 'react-icons/md';
import { CloseOutlined, HomeOutlined, LogoutOutlined, MenuOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';

import images from '../public/logo.png';
import { AuthContext } from '../context/authContext';
import SearchUsers from '../containers/Navbar/Search';
import { logout } from '../utils/auth';
import { useConversation } from '../context/conversation';
// import Image from 'next/image';
// eslint-disable-next-line import/no-cycle

const langs = {
  en: 'English',
  tm: 'Türkmen dili',
  ru: 'Русский',
};

const menus = [
  { name: 'Home', title: 'home' },
  { name: 'Direct', title: 'inbox' },
  { name: 'New Post', title: 'newPost' },
  { name: 'Profile', title: 'account' },
  { name: 'Notifications', title: 'notifications' },

];

const Icon = ({ title, className }) => {
  switch (title) {
    case 'home':
      return <HomeOutlined className={className} />;
    case 'inbox':
      return <FaTelegramPlane className={className} />;
    case 'newPost':
      return <PlusCircleOutlined className={className} />;
    case 'account':
      return <UserOutlined className={className} />;
    case 'notifications':
      return <MdNotifications className={className} />;
    default:
      return <HomeOutlined className={className} />;
  }
};

const MenuItems = ({ isMobile, active, setActive, user, t, count }) => {
  const generateLink = (i) => {
    switch (i) {
      case 'home':
        return '/';
      case 'inbox':
        return '/direct';
      case 'newPost':
        return '/new-post';
      case 'account':
        return `/user/${user.username}`;
      case 'notifications':
        return '/notifications';
      default:
        return '/';
    }
  };
  return (
    <ul className={`flex items-center flex-1 list-none flex-row ${isMobile ? 'flex-col w-full justify-start' : 'justify-end'} h-full`}>
      {menus.map((item, i) => (
        <li
          key={i}
          onClick={() => setActive(item.title)}
          className={`flex flex-row items-center relative font-semibold text-base
          dark:hover:text-white hover:text-nft-dark mx-3 
            ${active === item.title
            ? 'dark:text-white text-nft-black-1'
            : 'dark:text-nft-gray-3 text-nft-gray-2'

            }
            ${isMobile && 'w-full flex-row'} 
          `}
        >
          <Link href={generateLink(item.title)}>
            <a className={`${isMobile && 'w-full text-xl flex items-center justify-center relative'}`}>
              {
                isMobile
                  ? <> {`${(item.title === 'direct' && count > 0) ? count : ''}`} {t(`page.${item.title}`)} </>
                  : (
                    <>
                      <Icon title={item.title} className="text-xl cursor-pointer" />
                      {
                        item.title === 'inbox'
                          ? count > 0
                          && (
                          <div
                            className="absolute text-xs -top-2 -right-2
                            z-10 bg-[#c00] px-[5px] h-4 text-white rounded-full"
                          >
                            {count}
                          </div>
                          )
                          : item.title === 'notifications'
                            ? user.unreadNotifications && (
                            <div className="absolute text-xs top-0 -right-[2px]
                            z-10 bg-[#c00]  h-[6px] w-[6px] text-white rounded-full"
                            />
                            )
                            : item.title === 'home' && user.unreadPosts && (
                              <div
                                className="absolute text-xs top-1 -right-[2px]
                            z-10 bg-[#c00]  h-[6px] w-[6px] text-white rounded-full"
                              />
                            )
                    }
                    </>
                  )
}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { count } = useConversation();

  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('home');
  const { locales, locale: activeLocale } = router;
  const otherLocales = locales?.filter(
    (locale) => locale !== activeLocale,
  );
  const [lang, setLang] = useState(false);
  const { t } = useTranslation('');
  // console.log(user);.

  useEffect(() => {
    setIsOpen(false);
    // if(router.pathname === '/') setActive('home')
    // if(router.pathname === '/direct') setActive('inbox')
    // if(router.pathname === '/new-post') setActive('newPost')

    // console.log(router.pathname);
  }, [router]);

  return (
    <nav className="flexBetween w-full fixed z-10 p-4 flex-row border-b dark:bg-nft-dark bg-white
    dark:border-nft-black-1 border-nft-gray-1"
    >

      <div className="flex flex-1 md:flex-initial md:mr-4  flex-row justify-start">
        <Link href="/">
          <div
            className="flexCenter md:hidden cursor-pointer"
            onClick={() => {}}
          >
            <Image src={images} objectFit="contain" width={32} height={32} alt="Logo" className="" />
            <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1">Trillo</p>
          </div>
        </Link>
        <Link href="/">
          <div
            className="hidden md:flex w-8 h-8 md:w-6 md:h-6"
            onClick={() => {}}
          >
            <Image
              src={images}
              objectFit="contain"
              // width={32}
              // height={32}
              alt="Logo"
              className=""
            />
          </div>
        </Link>
      </div>
      {
        user

        && <SearchUsers t={t} />
      }

      {
          user && (
            <div className="flex justify-end items-center flex-1 md:hidden">

              <MenuItems isMobile={false} user={user} active={active} setActive={setActive} t={t} count={count.length} />

            </div>
          )
        }
      {
        user && (
        <div className="flex items-center  justify-center h-full flex-initial flex-col mx-2 sm:hidden">

          <LogoutOutlined className="text-xl cursor-pointer md:text-base" onClick={() => logout(setUser)} />
        </div>
        )
      }
      <div className={`relative flex ${user ? '' : 'flex-1 justify-end'} sm:ml-2`}>
        <div
          className="cursor-pointer flex flex-row px-2 y-1 rounded items-center hover:text-blue-700
          dark:hover:text-blue-500
           transition-all duration-500 "
          onClick={() => setLang(!lang)}
        >
          <MdOutlineLanguage className="text-xl md:text-sm mr-[2px]" />
          <p className="uppercase md:text-xs">{activeLocale}</p>
        </div>
        <div
          className={`absolute top-plus text-sm right-0 bg-white shadow dark:bg-nft-black-3  rounded overflow-hidden z-30
        ${!lang ? 'hidden' : 'block'}
        `}
        >
          {
            otherLocales?.map((locale) => {
              const { asPath } = router;
              return (
                <div key={locale} className="hover:bg-nft-gray-1 dark:hover:bg-nft-black-2 px-1 text-center">
                  <Link
                  // href={{ pathname, query }} asPath={asPath} locale={locale}
                    href={asPath}
                    locale={locale}
                  >
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a
                      className="uppercase flex flex-row px-2 py-1"
                      onClick={() => setLang(false)}

                    >
                      <p className="mr-3 font-medium sm:text-xs">{locale}</p>
                      <p className="whitespace-nowrap sm:text-xs">{locale === 'en' ? langs.en : locale === 'ru' ? langs.ru : langs.tm}</p>
                    </a>
                  </Link>
                </div>
              );
            })
          }

        </div>
      </div>

      <div className="flex flex-initial flex-row justify-end ml-4 ">
        <div className="flex items-center mr-2">
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
          <label
            htmlFor="checkbox"
            className="flexBetween w-8 h-4 md:w-6 md:h-3 bg-black rounded-2xl
          p-1 relative label cursor-pointer"
          >
            <FaMoon className="fa-moon text-[9px] md:text-[6px]" />
            <FaSun className="fa-sun text-[9px] md:text-[6px]" />
            <div className="w-3 h-3 md:w-2 md:h-2 absolute top-[2px] left-[2px]  bg-white rounded-full ball" />
          </label>
        </div>

      </div>

      {
            user && (
              <div className="hidden md:flex ml-2">
                {isOpen ? (
                  <CloseOutlined
                    onClick={() => setIsOpen(false)}
                    className="text-xl md:text-base"
                  />

                ) : (
                  <MenuOutlined
                    onClick={() => setIsOpen(true)}
                    className="text-xl md:text-base"
                  />

                )}
                {isOpen && (
                <div className="fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col">
                  <div className="p-4">
                    <MenuItems isMobile user={user} active={active} setActive={setActive} t={t} />
                  </div>
                  <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1 flex-1 flex flex-col
            items-center justify-start"
                  >

                    {
        user && (
        <div className="flex items-center  justify-center ">

          <LogoutOutlined className="text-xl cursor-pointer" onClick={() => logout(setUser)} />
        </div>
        )
      }
                  </div>
                </div>
                )}
              </div>
            )
          }

    </nav>
  );
};

export default Navbar;
