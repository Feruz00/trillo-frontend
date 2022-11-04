import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Title } from '../components';
import i18n from '../i18n';
import AddPost from '../components/NewPost';

const NewPost = () => {
  const { t } = useTranslation('');

  return (
    <>
      <Title title={`${t('page.newPost')} | Trillo`} />
      <div className="min-h-screen max-w-[1200px] md:w-full flex justify-center items-start">
        <AddPost t={t} />
      </div>
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
export default NewPost;
