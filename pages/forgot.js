/* eslint-disable no-plusplus */
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Router from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Title } from '../components';
import ForgotForm from '../components/ForgotForm';
import { AuthContext } from '../context/authContext';
import i18n from '../i18n';
import { forgot } from '../utils/auth';

const Forgot = () => {
  const initErrorText = {
    name: '',
    email: '',
    password: '',
    confirm: '',
  };
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState(initErrorText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation('');
  const { user } = useContext(AuthContext);
  const [success, setSuccess] = useState(false);

  // const router = useRouter();
  const confirmEmail = (mail) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) return true;
    return false;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorText(initErrorText);
    setError('');
    setSuccess(false);
    let nwErr = initErrorText;

    if (!confirmEmail(email)) nwErr = ({ ...nwErr, email: t('auth.emailContainError') });

    if (nwErr.email.length) {
      setErrorText(nwErr);
      return false;
    }

    await forgot(email, setLoading, setError, setSuccess);
  };
  useEffect(() => {
    // console.log(user);
    if (user) {
      Router.push('/');
    }
  });
  return (
    <>
      <Title title={`${t('auth.forgot')} | Trillo`} />
      <ForgotForm
        email={email}
        setEmail={setEmail}
        handleSubmit={handleSubmit}
        t={t}
        errorText={errorText}
        mainError={error}
        loading={loading}
        success={success}
      />

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

export default Forgot;
