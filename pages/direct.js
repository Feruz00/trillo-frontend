/* eslint-disable react/button-has-type */
import dynamic from 'next/dynamic';

import React, { useContext, useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Router from 'next/router';
// import { InfoCircleFilled, MessageOutlined, SendOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { FaTelegramPlane } from 'react-icons/fa';
import { Sidebar, Title } from '../components';
import i18n from '../i18n';
import { AuthContext } from '../context/authContext';
import ProtectedPage from '../context/protedtedRoutes';
import { useConversation } from '../context/conversation';
import CurrentConversation from '../components/CurrentConversationMenu';
import ChatInformationCenter from '../components/ChatInformationCenter';
import ChatCenter from '../components/ChatCenter';
import WriteMessage from '../components/WriteMessage';
// import UserFollowOrBlock from '../components/UserFollowOrBlock';

const Direct = () => {
  const { t } = useTranslation('');
  const { user } = useContext(AuthContext);
  const { currentConversation, count } = useConversation();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!user) {
      Router.push('/login');
    }
  });

  return (
    <>
      <Title title={`${count.length > 0 ? `(${count.length}) ` : ''}${t('page.inbox')} | Trillo`} />
      <div className=" h-direct w-full px-10 py-5 md:p-4 md:py-1 sm:p-3 xs:p-2 flex flex-row md:flex-col ">
        <Sidebar t={t} />

        <div className=" transition-all duration-500  flex-1 h-full flex flex-col rounded-lg border ml-2 shadow md:mt-2 ">
          {
            currentConversation ? (
              <>

                <CurrentConversation isOpen={isOpen} setIsOpen={setIsOpen} t={t} />
                <div className="flex-1 overflow-y-auto relative">

                  {isOpen
                    ? <ChatInformationCenter t={t} isOpen={isOpen} />
                    : (
                      <div className="flex h-full w-full flex-col relative">

                        <div className="flex-1 relative">
                          <ChatCenter t={t} />

                        </div>

                      </div>

                    )}
                  {/* {
                        !isOpen && <UserFollowOrBlock t={t} />
                    } */}
                </div>
                {!isOpen && <WriteMessage t={t} />}
              </>
            )
              : (
                <div className="h-full w-full flex flex-1 justify-center items-center">
                  <div className=" flex flex-row items-center justify-center">
                    <p className="text-2xl mr-2 md:text-xl">{t('direct.startMessaging')}</p>
                    <FaTelegramPlane className="text-blue-600 dark:text-blue-400 text-2xl md:text-xl" />
                  </div>

                </div>
              )
          }

        </div>
      </div>
    </>
  );
};

export const getServerSideProps = (context) => ProtectedPage(
  context,
  null,
  async () => {
    const { locale } = context;
    return (
      {
        ...(await serverSideTranslations(
          locale,
          ['common'],
          i18n,
        )),
      }
    );
  },
);

// export const getServerSideProps = async ({ locale }) => (
//   { props: {
//     ...(await serverSideTranslations(
//       locale,
//       ['common'],
//       i18n,
//     )),
//   } }
// );
const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Direct), {
  ssr: false,
});
export default DynamicComponentWithNoSSR;
