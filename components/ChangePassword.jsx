/* eslint-disable no-unused-vars */
import { EyeInvisibleOutlined, EyeOutlined, KeyOutlined } from '@ant-design/icons';
import axios from 'axios';
import React, { useState } from 'react';

const Input = ({ Icon, text, setText, placeholder, invalidText, type }) => {
  const [tp, setTp] = useState(type);
  const [hover, setHover] = useState(false);
  return (
    <div className="flex flex-col w-full">
      <div className={`px-2 mt-2 border border-border-blue-600 w-full flex flex-row items-center
                    rounded-lg justify-center text-base transition duration-700 ${hover && 'border-2'} hover:border-blue-700 `}
      >
        <Icon className="mr-2" />
        <input
          placeholder={placeholder}
          className="w-full outline-none py-2 h-full dark:bg-transparent"
          value={text}
          type={tp}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          onChange={(e) => setText(e.target.value)}
        />
        {
            type === 'password' && (
              tp === 'password'
                ? <EyeInvisibleOutlined onClick={() => setTp((p) => (p === 'password' ? 'text' : 'password'))} />
                : <EyeOutlined onClick={() => setTp((p) => (p === 'password' ? 'text' : 'password'))} />
            )
        }

      </div>
      {
          invalidText.length > 0
        && <p className="text-sm ml-5 text-red-600">*{invalidText}</p>
        }
    </div>

  );
};
const ChangePassword = ({ t }) => {
  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    loading: false,
    error: null,
    success: null,
    oldPasswordInvalidText: '',
    newPasswordInvalidText: '',
  });
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

  const handleChangeUsername = async () => {
    let nwErr = { oldPassword: '', newPassword: '' };
    setPassword((prev) => ({ ...prev, loading: false, success: null, error: null, oldPasswordInvalidText: '', newPasswordInvalidText: '' }));

    if (password.oldPassword.length < 8) nwErr = ({ ...nwErr, oldPassword: t('auth.passwordLengthError') });
    if (password.newPassword.length < 8) nwErr = ({ ...nwErr, newPassword: t('auth.passwordLengthError') });

    if (password.oldPassword.length && !confirmPassword(password.oldPassword)) nwErr = ({ ...nwErr, oldPassword: t('auth.passwordContainError') });
    if (password.newPassword.length && !confirmPassword(password.newPassword)) nwErr = ({ ...nwErr, newPassword: t('auth.passwordContainError') });

    if (nwErr.oldPassword.length || nwErr.newPassword.length) {
      setPassword((prev) => ({ ...prev, loading: false, oldPasswordInvalidText: nwErr.oldPassword, newPasswordInvalidText: nwErr.newPassword }));
      return false;
    }
    setPassword((prev) => ({ ...prev, loading: true }));
    await axios({
      method: 'PATCH',
      url: `${process.env.SERVER}/users/change`,
      data: {
        oldPassword: password.oldPassword,
        newPassword: password.newPassword,
      },
      withCredentials: true,
    }).then((res) => {
      setPassword((prev) => ({ ...prev, loading: false, success: t('settings.success') }));
    }).catch((err) => {
      let fer;
      if (err.response) fer = err.response.data.message;
      else fer = 'Please try again!';
      setPassword((prev) => ({ ...prev, loading: false, error: fer }));
    });
    setPassword((prev) => ({ ...prev, oldPassword: '', newPassword: '' }));
  };
  return (
    <div className="w-full h-full flex mt-4 justify-center items-center flex-col">

      <div className="flex flex-col  w-9/12 md:w-full justify-start items-start mt-10">
        <h1 className="text-xl font-medium transition-all duration-500">{t('settings.changePassword')}:
          {
            password.error
            && (
            <span className="ml-4 font-semibold text-red-500 text-lg sm:text-sm text-center">
              {password.error}
            </span>
            )
          }
          {
            password.success
            && (
            <span className="ml-4 font-semibold text-green-700 dark:text-green-500 text-lg  text-center">
              {t('settings.success')}
            </span>
            )
          }
        </h1>
        <div className="flex flex-col items-center justify-center w-full  gap-10  md:gap-5 ">

          <div className="flex-1 w-full justify-center items-center flex-col mt-4">
            <h2 className=" transition-all duration-500">
              {t('settings.oldPassword')}:
            </h2>
            <Input
              text={password.oldPassword}
              setText={(t) => setPassword((prev) => ({ ...prev, oldPassword: t }))}
              invalidText={password.oldPasswordInvalidText}
              placeholder={t('auth.password')}
              type="password"
              Icon={KeyOutlined}
            />
            <h2 className="mt-3 transition-all duration-500">
              {t('settings.newPassword')}:
            </h2>

            <Input
              text={password.newPassword}
              setText={(t) => setPassword((prev) => ({ ...prev, newPassword: t }))}
              invalidText={password.newPasswordInvalidText}
              placeholder={t('auth.password')}
              type="password"
              Icon={KeyOutlined}
            />

          </div>
          <div
            onClick={() => handleChangeUsername()}
            className="transition-all md:w-1/2 flex items-center justify-center duration-500 bg-blue-500 px-5 py-2 cursor-pointer font-medium text-[#fff] dark:bg-blue-700"
          >
            {t('settings.change')}
            {password.loading && '...'}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ChangePassword;
