import { EyeInvisibleOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
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
const PersonalInformationChange = ({ user, setUser, t }) => {
  const [username, setUsername] = useState({
    value: user.username,
    loading: false,
    error: null,
    success: null,
    invalidText: '',
  });
  const [bio, setBio] = useState({
    value: user.bio,
    loading: false,
    error: null,
    success: null,
    invalidText: '',
  });

  const [personal, setPersonal] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    loading: false,
    error: null,
    success: null,
    firstNameInvalidText: '',
    lastNameInvalidText: '',
  });

  const handleChangeUsername = async (type) => {
    let nwErr = '';
    setUsername((prev) => ({ ...prev, loading: false, success: null, error: null, invalidText: '' }));
    setPersonal((prev) => ({ ...prev, loading: false, success: null, error: null }));
    setBio((prev) => ({ ...prev, loading: false, success: null, error: null }));

    let data;
    if (type === 1) {
      if (username.value.length < 5) nwErr = t('auth.nameLengthError');
      if (nwErr.length) {
        setUsername((prev) => ({ ...prev, invalidText: nwErr }));

        return false;
      }
      data = { username: username.value };
      setUsername((prev) => ({ ...prev, loading: true }));
    }
    if (type === 2) {
      data = { firstName: personal.firstName, lastName: personal.lastName };
      setPersonal((prev) => ({ ...prev, loading: true }));
    }
    if (type === 3) {
      data = { bio: bio.value };
      setBio((prev) => ({ ...prev, loading: true }));
    }
    // console.log(user);
    await axios({
      method: 'PUT',
      url: `${process.env.SERVER}/friends/upd_info`,
      data,
      withCredentials: true,
    }).then(() => {
      if (type === 1) {
        setUsername((prev) => ({ ...prev, loading: false, success: t('settings.success') }));
        setUser((prev) => ({ ...prev, username: username.value }));
      }
      if (type === 2) {
        setPersonal((prev) => ({ ...prev, loading: false, success: t('settings.success') }));
        setUser((prev) => ({ ...prev, firstName: personal.firstName, lastName: personal.lastName }));
      }
      if (type === 3) {
        setBio((prev) => ({ ...prev, loading: false, success: t('settings.success') }));
        setUser((prev) => ({ ...prev, bio: bio.value }));
      }
    }).catch((err) => {
      let fer;
      if (err.response) fer = err.response.data.message;
      else fer = 'Please try again!';
      if (type === 1) {
        setUsername((prev) => ({ ...prev, loading: false, error: fer }));
      }
      if (type === 2) {
        setPersonal((prev) => ({ ...prev, loading: false, error: fer }));
      }
      if (type === 3) {
        setBio((prev) => ({ ...prev, loading: false, error: fer }));
      }
    });
  };
  return (
    <div className="w-full h-full flex mt-4 justify-center flex-col">
      <div className="flex w-full flex-col">
        <h1 className="text-xl font-medium transition-all duration-500">{t('settings.changeUsername')}:
          {
            username.error
            && (
            <span className="ml-4 font-semibold text-red-500 text-lg sm:text-sm text-center">
              {username.error}
            </span>
            )
          }
          {
            username.success
            && (
            <span className="ml-4 font-semibold text-green-700 dark:text-green-500 text-lg  text-center">
              {t('settings.success')}
            </span>
            )
          }
        </h1>
        <div className="flex flex-row items-start justify-center md:items-center w-full gap-10 md:flex-col md:gap-5 ">

          <div className="flex-1 flex items-center justify-center md:w-full">
            <Input
              text={username.value}
              setText={(k) => setUsername((prev) => ({ ...prev, value: k }))}
              invalidText={username.invalidText}
              placeholder={t('auth.username')}
              type="text"
              Icon={UserOutlined}
            />
          </div>
          <div
            onClick={() => handleChangeUsername(1)}
            className="transition-all md:w-1/2 flex mt-2 items-center justify-center duration-500 bg-blue-500 px-5 py-2 cursor-pointer font-medium text-[#fff] dark:bg-blue-700"
          >
            {t('settings.change')}
            {username.loading && '...'}
          </div>
        </div>

      </div>

      <div className="flex w-full flex-col mt-10">
        <h1 className="text-xl font-medium transition-all duration-500">{t('settings.changeInfo')}:
          {
            personal.error
            && (
            <span className="ml-4 font-semibold text-red-500 text-lg sm:text-sm text-center">
              {personal.error}
            </span>
            )
          }
          {
            personal.success
            && (
            <span className="ml-4 font-semibold text-green-700 dark:text-green-500 text-lg  text-center">
              {t('settings.success')}
            </span>
            )
          }
        </h1>
        <div className="flex flex-row items-end justify-center w-full md:items-center gap-10 md:flex-col md:gap-5 ">

          <div className="flex-1 flex md:w-full flex-col mt-4">
            <h2 className=" transition-all duration-500">
              {t('settings.changeFirstName')}:
            </h2>
            <Input
              text={personal.firstName}
              setText={(k) => setPersonal((prev) => ({ ...prev, firstName: k }))}
              invalidText={personal.firstNameInvalidText}
              placeholder={t('settings.changeFirstName')}
              type="text"
              Icon={UserOutlined}
            />
            <h2 className="mt-3 transition-all duration-500">
              {t('settings.changeLastName')}:
            </h2>

            <Input
              text={personal.lastName}
              setText={(k) => setPersonal((prev) => ({ ...prev, lastName: k }))}
              invalidText={personal.lastNameInvalidText}
              placeholder={t('settings.changeLastName')}
              type="text"
              Icon={UserOutlined}
            />

          </div>
          <div
            onClick={() => handleChangeUsername(2)}
            className="transition-all md:w-1/2 flex items-center justify-center duration-500 bg-blue-500 px-5 py-2 cursor-pointer font-medium text-[#fff] dark:bg-blue-700"
          >
            {t('settings.change')}
            {personal.loading && '...'}
          </div>
        </div>

      </div>

      <div className="flex w-full flex-col mt-10">
        <h1 className="text-xl font-medium transition-all duration-500">{t('settings.changeAboutYou')}:
          {
            bio.error
            && (
            <span className="ml-4 font-semibold text-red-500 text-lg sm:text-sm text-center">
              {bio.error}
            </span>
            )
          }
          {
            bio.success
            && (
            <span className="ml-4 font-semibold text-green-700 dark:text-green-500 text-lg  text-center">
              {t('settings.success')}
            </span>
            )
          }
        </h1>
        <div className="flex flex-col items-start justify-center md:items-center w-full gap-10 md:gap-5 ">

          <div className="flex-1 flex items-center justify-center w-full">

            <textarea
              value={bio.value}
              rows="4"
              onChange={(e) => setBio((prev) => ({ ...prev, value: e.target.value }))}
              placeholder={t('settings.changeAboutYou')}
              className="
              outline-none mt-3
              border rounded-t-lg
              p-4 w-full text-sm text-gray-900 bg-white  dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div
            onClick={() => handleChangeUsername(3)}
            className="transition-all md:w-1/2 flex mt-2 items-center justify-center duration-500 bg-blue-500 px-5 py-2 cursor-pointer font-medium text-[#fff] dark:bg-blue-700"
          >
            {t('settings.change')}
            {bio.loading && '...'}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PersonalInformationChange;
