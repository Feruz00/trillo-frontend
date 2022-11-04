/* eslint-disable no-plusplus */
import { useContext, useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { AuthForm, Title } from '../components';
import i18n from '../i18n';
import { AuthContext } from '../context/authContext';
import { login } from '../utils/auth';

const Login = () => {
  const initErrorText = {
    name: '',
    email: '',
    password: '',
    confirm: '',
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState(initErrorText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation('');
  const { user, setUser } = useContext(AuthContext);

  // const router = useRouter();
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
    bo = false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorText(initErrorText);
    let nwErr = initErrorText;
    if (name.length < 5) nwErr = ({ ...nwErr, name: t('auth.nameLengthError') });
    if (password.length < 8) nwErr = ({ ...nwErr, password: t('auth.passwordLengthError') });
    if (password.length >= 8 && !confirmPassword(password)) nwErr = ({ ...nwErr, password: t('auth.passwordContainError') });
    if (nwErr.name.length || nwErr.password.length) {
      setErrorText(nwErr);
      return false;
    }
    await login(name, password, setUser, setLoading, setError);
  };
  useEffect(() => {
    if (user) {
      Router.push('/');
    }
  });
  return (
    <>

      <Title title={`${t('auth.login')} | Trillo`} />
      <AuthForm
        isLoginPage
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        handleSubmit={handleSubmit}
        password={password}
        setPassword={setPassword}
        t={t}
        errorText={errorText}
        mainError={error}
        loading={loading}
        githubLink={`${process.env.SERVER}/users/auth/github`}
        googleLink={`${process.env.SERVER}/users/auth/google`}

      />

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

export default Login;
