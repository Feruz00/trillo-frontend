/* eslint-disable no-plusplus */
import { useContext, useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { AuthForm, Title } from '../components';
import i18n from '../i18n';
import { AuthContext } from '../context/authContext';
import { register } from '../utils/auth';
// import { Auth } from 'e:/programming/social media/client/src/context';

const Register = () => {
  const initErrorText = {
    name: '',
    email: '',
    password: '',
    confirm: '',
  };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [errorText, setErrorText] = useState(initErrorText);
  const { t } = useTranslation('');
  const { user } = useContext(AuthContext);

  const confirmEmail = (mail) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) return true;
    return false;
  };

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
    if (name.length < 5) nwErr = ({ ...nwErr, name: t('auth.nameLengthError') });
    if (password.length < 8) nwErr = ({ ...nwErr, password: t('auth.passwordLengthError') });
    if (password.length >= 8 && !confirmPassword(password)) nwErr = ({ ...nwErr, password: t('auth.passwordContainError') });
    if (confirm.length < 8) nwErr = ({ ...nwErr, confirm: t('auth.passwordLengthError') });
    if (confirm.length >= 8 && !confirmPassword(confirm)) nwErr = ({ ...nwErr, confirm: t('auth.passwordContainError') });
    if (password !== confirm) nwErr = ({ ...nwErr, confirm: t('auth.passwordCannotMatch') });

    if (!confirmEmail(email)) nwErr = ({ ...nwErr, email: t('auth.emailContainError') });

    if (nwErr.name.length || nwErr.password.length || nwErr.email.length || nwErr.confirm.length) {
      setErrorText(nwErr);
      return false;
    }

    await register(name, email, password, setLoading, setError, setSuccess);
  };
  useEffect(() => {
    if (user) {
      Router.push('/');
    }
  });
  return (
    <>
      <Title title={`${t('auth.register')} | Trillo`} />
      <AuthForm
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        handleSubmit={handleSubmit}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirm}
        setConfirmPassword={setConfirm}
        t={t}
        errorText={errorText}
        mainError={error}
        loading={loading}
        success={success}
        githubLink={`${process.env.SERVER}/users/auth/github`}
        googleLink={`${process.env.SERVER}/users/auth/google`}

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
export default Register;
