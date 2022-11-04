import React, { useContext, useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Router from 'next/router';
import { LoadingOutlined } from '@ant-design/icons';
import { PersonalInformationChange, Title, UploadPhoto } from '../../../components';
import i18n from '../../../i18n';
import { AuthContext } from '../../../context/authContext';
import ChangePassword from '../../../components/ChangePassword';

const Home = () => {
  const { t } = useTranslation('');
  const { user, setUser } = useContext(AuthContext);
  const [mounted, setMounted] = useState(true);
  useEffect(() => {
    if (!user) Router.push('/login');
  });
  useEffect(() => {
    setMounted(false);
  }, []);
  const [active, setActive] = useState(0);
  if (!user) return null;
  return (
    <>
      <Title title={`${t('page.settings')} | Trillo`} />
      {
        mounted ? (
          <div className="h-full min-h-screen w-full flex justify-center items-center">
            <LoadingOutlined className="text-xl" />
          </div>
        )
          : (
            <div className="min-h-screen h-full w-full items-center justify-center flex-col mt-10">
              <div className="w-full flex flex-row items-center justify-center sm:flex-col sm:gap-5">
                {[t('settings.personal'), t('settings.changePassword'), t('settings.uploadPassword'), t('settings.deleteAccount')]
                  .map((i, item) => (
                    <div
                      className={`
                ${active === item ? 'bg-nft-gray-2 text-white dark:bg-nft-gray-2 dark:text-white' : 'dark:bg-nft-black-1 dark:shadow-xl '} 
                mx-3 md:mx-1 cursor-pointer shadow p-3  sm:w-11/12`}
                      key={item}
                      onClick={() => setActive(item)}
                    >
                      <h1 className="transition-all duration-500 md:text-sm sm:text-center">{i}</h1>
                    </div>
                  ))}
              </div>

              <div className="flex-1 w-full h-full flex justify-center items-start mt-5">
                <div className="w-[60%] sm:w-11/12 border-t">
                  {
                    active === 0 && <PersonalInformationChange user={user} t={t} setUser={setUser} />
                  }
                  {
                    active === 1 && <ChangePassword t={t} />
                  }
                  {
                    active === 2 && <UploadPhoto t={t} />
                  }
                  {
                    active === 3 && (
                    <div className="flex flex-row justify-end">
                      <div
                        className=" mt-5 transition-all md:w-1/2 flex items-center justify-center duration-500 bg-blue-500 px-5 py-2 cursor-pointer font-medium text-[#fff] dark:bg-blue-700"
                      >
                        {t('settings.deleteAccount')}
                      </div>
                    </div>
                    )
                  }
                </div>
              </div>

            </div>
          )
}

    </>
  );
};

export const getServerSideProps = async ({ locale }) => (
  { props: {
    ...(await serverSideTranslations(
      locale,
      ['common'],
      i18n,
    )),
  } }
);
export default Home;
