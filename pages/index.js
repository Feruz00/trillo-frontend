import React, { useContext, useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import { ReloadOutlined } from '@ant-design/icons';
import { InfinitySpin } from 'react-loader-spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Title } from '../components';
import i18n from '../i18n';
import { AuthContext } from '../context/authContext';
import Alert from '../components/Alert';
import NoPost from '../components/NoPost';
import Post from '../components/Post';

const Home = ({ posts, errorLoading }) => {
  const { t } = useTranslation('');
  const { setUser } = useContext(AuthContext);
  const [alert, setAlert] = useState(false);
  const [data, setData] = useState(posts);

  const [hasMore, setHasMore] = useState(posts.length > 0);
  const [pageNumber, setPageNumber] = useState(2);
  const { user } = useContext(AuthContext);
  // console.log(posts);
  useEffect(() => async () => {
    try {
      await axios({
        method: 'PUT',
        url: `${process.env.SERVER}/posts/unread`,
        withCredentials: true,
      });
      setUser((prev) => ({ ...prev, unreadPosts: false }));
    } catch (error) {
      setAlert(true);
      // alert()
    }
  }, []);

  const fetchDataOnScroll = async () => {
    // console.log('geldim', pageNumber);
    try {
      const res = await axios
        .get(`${process.env.SERVER}/posts/`, { withCredentials: true, params: { p: pageNumber } });
      if (res.data.length === 0) setHasMore(false);
      setData((prev) => [...prev, ...res.data]);
      setPageNumber((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Title title={`${t('page.home')} | Trillo`} />
      <div className="flex mt-4 flex-col gap-2">
        {(data?.length === 0 || errorLoading)
          ? <NoPost t={t} />
          : (
            <InfiniteScroll
              hasMore={hasMore}
              next={fetchDataOnScroll}
              loader={(
                <div className="w-full h-full flex items-center justify-center min-h-screen">
                  <InfinitySpin
                    width="200"
                    color="#4fa94d"
                  />
                </div>
              )}
              endMessage={
                (
                  <div className="w-full h-full flex items-center justify-center">
                    <ReloadOutlined className="text-3xl text-nft-gray-3 dark:text-nft-gray-1 transition-all duration-500" />
                  </div>
              )
              }
              dataLength={data.length}
            >
              {
            data.map((i, index) => (
              <div
                key={index}
                className="min-h-screen w-full flex flex-col items-center p-2 md:px-6"

              >
                <Post
                  index={index}
                  item={i}
                  isModal={false}
                  t={t}
                  user={user}
                  isHome
                  setData={setData}
                />
              </div>

            ))
          }
            </InfiniteScroll>
          )}

      </div>
      {
        alert
      && <Alert t={t} />
      }
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const { locale, req } = ctx;
  try {
    const res = await axios
      .get(`${process.env.SERVER}/posts/`, {
        withCredentials: true,
        params: { p: 1 },
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
    // console.log(error);
    // console.log('error boldy');
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
