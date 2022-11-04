/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Triangle } from 'react-loader-spinner';
import axios from 'axios';
import { ReloadOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Title } from '../components';
import i18n from '../i18n';
import { AuthContext } from '../context/authContext';
import Alert from '../components/Alert';
import calculateTime from '../calculateTime';

const Home = ({ notifications, errorLoading }) => {
  const { t } = useTranslation('');
  const { setUser } = useContext(AuthContext);
  const [hasMore, setHasMore] = useState(notifications.notifications.length >= 10);
  const [data, setData] = useState(notifications.notifications);
  const [pageNumber, setPageNumber] = useState(2);
  const [alert, setAlert] = useState(false);

  useEffect(() => async () => {
    try {
      await axios({
        method: 'PUT',
        url: `${process.env.SERVER}/notifications/`,
        withCredentials: true,
      });
      setUser((prev) => ({ ...prev, unreadNotifications: false }));
    } catch (error) {
      setAlert(true);
    }
  }, []);
  console.log(data);
  // console.log(ans);
  const fetchDataOnScroll = async () => {
    try {
      const res = await axios
        .get(`${process.env.SERVER}/notifications/`, {
          withCredentials: true,
          params: { p: pageNumber },

        });
      // console.log(res.data, pageNumber);
      if (res.data.notifications.length === 0) setHasMore(false);
      setData((prev) => [...prev, ...res.data.notifications]);
      setPageNumber((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Title title={`${t('page.notifications')} | Trillo`} />

      <div className="min-h-screen mt-4 flex justify-center ">

        <div className="w-5/6 sm:w-full flex flex-col ">
          <InfiniteScroll
            hasMore={hasMore}
            next={fetchDataOnScroll}
            loader={(
              <div className="w-full flex justify-center items-center dark:bg-nft-black-1 py-5">
                <Triangle
                  height="80"
                  width="80"
                  color="#DA18A3"
                  ariaLabel="triangle-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible
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
              data.length > 0 && (
                <div className="w-full flex flex-col px-4 pt-4 shadow dark:bg-nft-black-1 rounded gap-4 pb-4">
                  {
                data.map((i, index) => (
                  <div key={index} className="w-full flex flex-row gap-2 items-center border py-2 px-3 rounded">
                    <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center border">
                      {
                            i.user.logo.length > 0
                              ? <img src={`${process.env.SERVER}/${i.user.logo}`} className="w-full h-full object-cover" />
                              : <UserOutlined className="text-2xl -translate-y-1" />
                        }
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex flex-col">
                        <Link href={`/user/${i.user.username}`}>
                          <a className="font-medium text-blue-600  dark:text-blue-400 transition-all duration-500">{i.user.username}</a>
                        </Link>

                      </div>
                      <div className="flex flex-col justify-start ">
                        <p className="font-medium text-sm">
                          {
                            i.type === 'newComment'
                              ? t('notifications.addedNewComment')
                              : i.type === 'jogap' ? t('notifications.answerComment')
                                : i.type === 'newLike' && t('notifications.like')
                          }

                          {
                            (i.type === 'newComment' || i.type === 'jogap' || i.type === 'newLike') && (
                            <Link href={`post/${i.post._id}`}>
                              <a className="ml-1 text-blue-600 dark:text-blue-500 transition-all duration-500">
                                {t('notifications.thisPost')}.
                              </a>
                            </Link>
                            )
                          }
                          <span className="font-thin ml-1">
                            {
                            calculateTime(i.date, t)
                          }
                          </span>

                        </p>

                        <h1 className="text-sm sm:text-xs">

                          {
                            i.type === 'newFollower'
                              ? t('notifications.followed')
                              : i.type !== 'newLike' && (
                                <>
                                  {
                                  i.ansUser.length > 0
                                    ? i.ansUser.map((t, ii) => (
                                      <Link href={`user/${t.username}`} key={ii}>
                                        <a className="text-blue-600 dark:text-blue-500 transition-all duration-500">
                                          @{t.username}
                                        </a>
                                      </Link>
                                    ))
                                    : ''
                                }
                                  {` ${i.text}`}
                                </>
                              )

                          }
                        </h1>

                      </div>
                    </div>

                  </div>
                ))
              }
                </div>
              )
            }

          </InfiniteScroll>
        </div>

      </div>
      {
                alert && <Alert t={t} setToggle={setAlert} />
              }
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const { locale, req } = ctx;
  try {
    const res = await axios
      .get(`${process.env.SERVER}/notifications/`, {
        withCredentials: true,
        params: { p: 1 },
        headers: {
          Cookie: req.headers.cookie,
        },
      });
    // console.log(res.data);
    return ({
      props: {
        notifications: res.data,
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
