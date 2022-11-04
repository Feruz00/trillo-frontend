/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { UserOutlined, MailOutlined, KeyOutlined, EyeInvisibleOutlined, EyeOutlined, GoogleOutlined, GithubOutlined,
  ArrowRightOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

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

const ForgotForm = ({ email, setEmail, handleSubmit, t, errorText, mainError, loading, success }) => (
  <div className="w-full min-h-screen flex justify-center items-center ">
    <div className="flex justify-center items-center w-1/2 md:w-full">
      <div className="flex flex-col w-full justify-center items-center ">
        <h1 className="text-3xl mb-4 text-center w-[80%] font-500">{t('auth.forgot')}</h1>
        {
            mainError.length > 0
            && (
            <h2 className="font-semibold text-red-500 text-lg sm:text-sm text-center">
              {mainError}
            </h2>
            )
          }
        {
            success
            && (
            <h2 className="font-semibold text-green-700 dark:text-green-500 text-lg  text-center">
              {t('auth.forgotSuccess')}
            </h2>
            )
          }
        <form className="my-2 flex flex-col justify-center flex-1 w-[70%] xs:w-full xs:px-3" onSubmit={handleSubmit}>

          <Input placeholder={t('auth.email')} text={email} setText={setEmail} Icon={MailOutlined} type="email" invalidText={errorText.email} />

          {/* eslint-disable-next-line react/button-has-type */}
          <div className="w-full flex justify-end mt-3">
            <button
              type="submit"
              className="p-2 transition duration-500 flex items-center justify-center
            hover:tracking-wide bg-blue-500 min-w-32 font-medium text-base text-white hover:bg-blue-700 disabled:bg-blue-400"
              disabled={loading}
            >{t('auth.submit')}
              {
                    loading && <LoadingOutlined className="ml-2" />
                }
            </button>

          </div>
        </form>

        <div className="flex flex-row w-[70%] xs:w-full items-center xs:px-3 justify-between ">
          <Link href="/login">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className="transition duration-500 text-blue-600 dark:text-white text-base xs:text-xs font-medium hover:underline">
              {t('auth.login')}
            </a>
          </Link>
          <Link href="/register">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className="transition duration-500 text-blue-600 dark:text-white text-base xs:text-xs font-medium hover:underline">
              {t('auth.register')}

            </a>
          </Link>
        </div>
      </div>
    </div>

  </div>
);

export default ForgotForm;
