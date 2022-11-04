import React, { useContext } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import { Title } from '../../components';
import i18n from '../../i18n';
import { AuthContext } from '../../context/authContext';
import Alert from '../../components/Alert';
import NoPost from '../../components/NoPost';
import Post from '../../components/Post';

const Home = ({ posts, errorLoading }) => {
  const { t } = useTranslation('');
  // console.log(posts);
  const { user } = useContext(AuthContext);

  return (
    <>
      <Title title={`${t('page.post')} | Trillo`} />
      <div className="flex mt-4 flex-col gap-2">
        {(posts.length === 0 || errorLoading)
          ? <NoPost />
          : (

            <div
              className="min-h-screen w-full flex flex-col items-center p-2 md:px-6"
            >
              <Post
                isFull
                item={posts}
                isModal={false}
                t={t}
                user={user}
              />
            </div>

          )}

      </div>
      {
        errorLoading
      && <Alert t={t} />
      }
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const { locale, req } = ctx;
  const { id } = ctx.query;
  try {
    const res = await axios
      .get(`${process.env.SERVER}/posts/getpost/${id}`, {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie,
        },
      });
    // console.log(res.data);
    return ({
      props: {
        posts: res.data,
        ...(await serverSideTranslations(
          locale,
          ['common'],
          i18n,
        )),
      },
    });
  } catch (error) {
    return ({
      props: {
        errorLoading: true,
        ...(await serverSideTranslations(
          locale,
          ['common'],
          i18n,
        )),
      },
    });
  }
};

export default Home;
