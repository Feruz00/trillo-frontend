import React from 'react';
import { useTranslation } from 'next-i18next';

const Footer = () => {
  const { t } = useTranslation('');
  return (
    <div className="flexCenter w-full mt-5 pb-5 border-t dark:border-nft-black-1 border-nft-gray-1 sm:px-4 px-16">
      <div className="flexCenter flex-row w-full minmd:w-4/5 sm:flex-col mt-7">
        <p className=" dark:text-white text-nft-black-1 font-semibold text-base">
          &copy;Trillo. {t('footer.all_rigths')}
        </p>
      </div>
    </div>
  );
};

export default Footer;

