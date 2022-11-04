/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from 'react';
import { Router, useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Title } from '../../../components';

import i18n from '../../../i18n';
import ResetPasswordForm from '../../../components/ResetPasswordForm';
import { AuthContext } from '../../../context/authContext';
import { resetPassword } from '../../../utils/auth';

const Activate = () => {
  const router = useRouter();
  const { email, token } = router.query;
  const initErrorText = {
    name: '',
    email: '',
    password: '',
    confirm: '',
  };
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [errorText, setErrorText] = useState(initErrorText);
  const { t } = useTranslation('');
  const { user } = useContext(AuthContext);
  const confirmPassword = (s) => {
    let bo = false;
    for (let i = 0; i < s.length; i++) {
      if (s[i] >= '0' && s[i] <= '9') bo = true;
    }
    if (!bo) return false;
    bo = false;
    for (let i = 0; i < s.length; i++) {
      if ((s[i] >= 'a' && s[i] <= 'z') || (s[i] >= 'A' && s[i] <= 'Z')) bo = true;
    }
    if (!bo) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorText(initErrorText);
    setError('');
    setSuccess(false);
    let nwErr = initErrorText;
    if (password.length < 8) { nwErr = ({ ...nwErr, password: t('auth.passwordLengthError') }); }
    if (password.length >= 8 && !confirmPassword(password)) { nwErr = ({ ...nwErr, password: t('auth.passwordContainError') }); }
    if (confirm.length < 8) { nwErr = ({ ...nwErr, confirm: t('auth.passwordLengthError') }); }
    if (confirm.length >= 8 && !confirmPassword(confirm)) { nwErr = ({ ...nwErr, confirm: t('auth.passwordContainError') }); }
    if (password !== confirm) { nwErr = ({ ...nwErr, confirm: t('auth.passwordCannotMatch') }); }

    if (nwErr.password.length || nwErr.confirm.length) {
      setErrorText(nwErr);
      return false;
    }

    await resetPassword(email, token, password, setError, setSuccess, setLoading);
  };
  useEffect(() => {
    if (user) {
      Router.push('/');
    }
  });
  return (
    <>
      <Title title={`${t('auth.reset')} | Trillo`} />
      <ResetPasswordForm
        password={password}
        confirmPassword={confirm}
        setConfirmPassword={setConfirm}
        setPassword={setPassword}
        loading={loading}
        success={success}
        errorText={errorText}
        mainError={error}
        handleSubmit={handleSubmit}
        t={t}
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

export default Activate;
