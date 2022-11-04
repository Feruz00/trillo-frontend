/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';

const Alert = ({ setToggle, t }) => {
  const [hide, setHide] = useState(false);
  setTimeout(() => {
    setHide(true);
    setToggle && setToggle(false);
  }, 5000);
  return (
    <div className={`transition-all duration-500 px-4 text-white fixed bottom-0 left-0 right-0 h-10 flex flex-row justify-between items-center bg-nft-black-1 ${hide && 'h-0'} `}>
      <h1>{t('home.anything')}</h1>
      <h1
        className={`text-blue-500 font-medium cursor-pointer ${hide && 'hidden'} `}
        onClick={() => setToggle && setToggle((prev) => !prev)}
      >
        {t('home.tryAgain')}
      </h1>
    </div>
  );
};

export default Alert;
