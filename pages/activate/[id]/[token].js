/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Title } from '../../../components';

import i18n from '../../../i18n';

const Activate = () => {
  const router = useRouter();
  const { id, token } = router.query;
  const { t } = useTranslation('');
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        await axios({
          method: 'PATCH',
          url: `${process.env.SERVER}/users/verify`,
          params: {
            id,
            token,
          },
          withCredentials: true,
        });
        setLoading(false);
        // setSuccess(true);
      } catch (error) {
        // setSuccess(false);
        if (error.response) setText(error.response.data.message);
        else setText('We have server error please try again!');
      }
      setLoading(false);
    };
    getData();
  }, [id, token]);

  return (
    <>
      <Title title={`${t('auth.verify')} | Trillo`} />
      <div className="min-h-screen w-full flex justify-center items-center">
        {loading
          ? <LoadingOutlined className="text-4xl" />
          : !text
            ? (
              <div className="flex flex-col items-center">
                <h2 className="text-lg mr-3 ">
                  {t('auth.successVerify')}
                </h2>
                <div className="flex justify-between items-center  w-full mt-4">
                  <Link href="/login">
                    <a className="transition duration-500 text-lg text-blue-600 dark:text-white xs:text-xs font-medium hover:underline">
                      {t('auth.login')}
                    </a>
                  </Link>
                  <Link href="/register" className="ml-5">
                    <a className="transition duration-500 text-lg text-blue-600 dark:text-white xs:text-xs font-medium hover:underline">
                      {t('auth.register')}
                    </a>
                  </Link>

                </div>

              </div>
            )
            : (
              <div className="flex flex-col items-center">
                <h2 className="text-lg mr-3 text-red-600 font-semibold">
                  {text}
                </h2>
                <div className="flex justify-between items-center w-full mt-4">
                  <Link href="/login">
                    <a className="transition duration-500 text-lg text-blue-600 dark:text-white xs:text-xs font-medium hover:underline">
                      {t('auth.login')}
                    </a>
                  </Link>
                  <Link href="/register" className="ml-5">
                    <a className="transition duration-500 text-lg text-blue-600 dark:text-white xs:text-xs font-medium hover:underline">
                      {t('auth.register')}
                    </a>
                  </Link>

                </div>

              </div>
            )}

      </div>
    </>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ['common'],
      i18n,
    )),

    protected: false,
  },
});

export default Activate;
