import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import Router from 'next/router';
import { Title } from '../components';
import { AuthContext } from '../context/authContext';

const Home = () => {
  const { t } = useTranslation('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      Router.push('/login');
    }
  });
  return (
    <>
      <Title title={`${t('page.notFound')} | Trillo`} />
      <div className="min-h-screen w-full h-full flex justify-center items-center">Page not found</div>
    </>
  );
};

export default Home;
