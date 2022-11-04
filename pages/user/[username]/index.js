/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/button-has-type */
import React, { useContext, useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Router, { useRouter } from 'next/router';
import axios from 'axios';
import { LoadingOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { Modal, Title, UserProfileModal } from '../../../components';
import i18n from '../../../i18n';
import { AuthContext } from '../../../context/authContext';
import { useSocket } from '../../../context/socket';
import UserPosts from '../../../components/UserPosts';

const Button = ({ onClick, className, text, disabled }) => (
  <button
    className={`${className} min-w-32 p-2 whitespace-nowrap text-lg md:text-base xs:text-sm`}
    onClick={onClick}
    disabled={disabled}
  >
    {text}

  </button>
);

const getLink = (text, user) => {
  switch (text) {
    case 'Followers':
      return `friends/follower/${user._id}`;
    case 'Following':
      return `friends/following/${user._id}`;

    default:
      return 'friends/getprofile/profile';
  }
};
const getTranslate = (text) => {
  switch (text) {
    case 'Followers':
      return 'profile.followers';
    case 'Following':
      return 'profile.followings';

    default:
      return 'profile.blocking';
  }
};
const Username = () => {
  const { t } = useTranslation('');
  const { user, profile, setProfile } = useContext(AuthContext);
  const router = useRouter();
  const [data, setData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [errorData, setErrorData] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalCommand, setModalCommand] = useState('');
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [modalPage, setModalPage] = useState(1);
  const [modalLastPage, setModalLastPage] = useState(true);
  const [isBlock, setIsBlock] = useState(false);
  const socket = useSocket();

  const { username } = router.query;
  useEffect(() => {
    // console.log('effect icinde');

    if (!user) {
      // console.log('effect user if icinde');
      Router.push('/login');
    }
  });

  // console.log('page icinde');
  useEffect(() => {
    setShowModal(false);

    setDataLoading(true);
    const getData = async () => {
      await axios({
        method: 'GET',
        url: `${process.env.SERVER}/friends/${username}`,
        withCredentials: true,
      }).then((res) => {
        setData(res.data);
      }).catch((err) => {
        if (err.response) setErrorData(err.response.data.message);
        else setErrorData(t('profile.serverError'));
      });
    };
    getData();
    setDataLoading(false);
  }, [username]);

  const unfollow = async () => {
    try {
      const res = await axios.post(`${process.env.SERVER}/friends/unfollow`, { _id: data._id }, { withCredentials: true });
      setProfile((prev) => {
        const { following, ...other } = prev;
        return { ...other, following: following.filter((i) => i !== data._id) };
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const follow = async () => {
    try {
      const res = await axios.post(`${process.env.SERVER}/friends/follow`, { _id: data._id }, { withCredentials: true });

      setData(res.data);
      socket.emit('newnotification', { users: [data._id] });
      setProfile((prev) => {
        const { following, ...other } = prev;
        return { ...other, following: [data._id, ...following] };
      });
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleFollow = async () => {
    setFollowLoading(true);

    // console.log('geldim handleFollow');
    // eslint-disable-next-line no-unused-expressions
    data.isFollow ? await unfollow() : await follow();

    setFollowLoading(false);
  };

  const openModal = async (text) => {
    setShowModal(true);
    setModalCommand(t(getTranslate(text)));
    setModalLoading(true);
    setIsBlock(false);
    // console.log('open modal -----------------------------');
    // console.log(getLink(text, data));
    await axios({
      method: 'GET',
      url: `${process.env.SERVER}/${getLink(text, data)}`,
      // params:{
      //   page: 1
      // },
      withCredentials: true,
    })
      .then(({ data }) => {
        // console.log('icinde:', data);
        if (text === 'Followers' || text === 'Following') setModalData(data);
        else {
          setIsBlock(true);
          setModalData(data.blocking);
        }
      })
      .catch((err) => {
        if (err.response) setErrorData(err.response.data.message);
        else setErrorData('Something wrong went! Try again!');
      });
    setModalLoading(false);
  };

  return (
    <>
      <Title title={`${username} | Trillo`} />
      {
        dataLoading
        && (
          <div className="h-full min-h-screen w-full flex justify-center items-center">
            <LoadingOutlined className="text-4xl md:text-3xl" />
          </div>
        )
      }
      {
        errorData && (
          <div className="h-full min-h-screen w-full flex justify-center items-center">
            <h1 className="font-semibold text-2xl md:text-xl text-red-600 dark:text-red-500">{errorData}</h1>
          </div>
        )
      }
      {
        data && (
          <div className="min-h-screen h-full w-full flex items-start justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="my-2 mt-10 flex flex-row md:flex-col md:gap-10">
                <div className="flex flex-row items-center justify-center sm:mb-10
              "
                >
                  <div className="w-24 h-24 md:w-24 md:h-24 sm:w-16 sm:h-16 rounded-full bg-nft-gray-3 dark:bg-nft-black-3
              flex items-center justify-center
              overflow-hidden

              "
                  >
                    {
                  data.logo.length > 0
                    ? (<img src={`${process.env.SERVER}/${data.logo}`} className="w-full h-full object-cover" />)
                    : (<UserOutlined className="text-6xl md:text-5xl sm:text-3xl text-white dark:text-nft-gray-2" />)
                }
                  </div>
                  <div className="ml-10 xs:ml-5 sm:ml-5 mr-5">
                    <h1 className="text-3xl font-thin sm:text-xl xs:text-lg">{data.username}</h1>
                  </div>

                </div>

                <div className="flex-1 ml-2 flex flex-row flex-wrap justify-center items-center gap-3">
                  <Button
                    text={`${t('profile.followers')} ${user._id === data._id ? profile.followers.length : data.followers}`}
                    className="shadow bg-white dark:bg-nft-gray-3 text-sm"
                    disabled={data.secret && data._id !== user._id && !data.isFollowing}
                    onClick={() => openModal('Followers')}
                  />

                  <Button
                    text={`${t('profile.followings')} ${user._id === data._id ? profile.following.length : data.following}`}
                    className="shadow bg-white dark:bg-nft-gray-3 text-sm"
                    disabled={data.secret && data._id !== user._id && !data.isFollowing}
                    onClick={() => openModal('Following')}
                  />
                  {
                  data._id === user._id && (
                    <Button
                      text={`${t('profile.blocking')} ${profile.blocking.length}`}
                      className="shadow bg-nft-gray-3 text-sm text-white dark:text-nft-gray-1 font-medium dark:bg-nft-black-2 "
                      onClick={() => openModal('Blocking users')}
                    />
                  )
                }
                  {
                  data._id !== user._id && (
                    <Button
                      text={data.isFollow
                        ? `${t('profile.unfollow')}  ${followLoading ? '...' : ''}`
                        : `${t('profile.follow')}  ${followLoading ? '...' : ''}`}
                      className={`transition duration-300 shadow 
                      ${!data.isFollow ? 'bg-blue-700 dark:bg-blue-600' : 'bg-nft-gray-2 dark:bg-nft-black-1'} 
                       text-white font-medium  transition-all duration-500 `}
                      disabled={data.secret && data._id !== user._id && !data.isFollowing}
                      onClick={() => handleFollow()}
                    />
                  )
                }

                  {
                  data._id === user._id && (
                    <div className="flex items-center">
                      <Link href="/user/settings">
                        <a>
                          <SettingOutlined className="text-2xl -translate-y-1" />
                        </a>
                      </Link>
                    </div>
                  )
                }

                </div>
              </div>
              <div className="my-2 flex flex-col w-full items-center justify-center">
                {
                  (data.firstName.length > 0 || data.lastName.length > 0)
                  && (
                    <div className=" flex w-1/2 justify-start sm:w-full p-2">
                      <h1 className="font-medium text-left text-lg sm:text-base"> {data.firstName} {data.lastName}</h1>

                    </div>
                  )
                }
                {
                  (data.bio.length > 0)
                  && (
                  <h1 className="text-sm w-1/2 text-justify sm:w-full "> {data.bio} </h1>

                  )
                }

              </div>

              <UserPosts username={username} />
            </div>

            {
              showModal && (
              <Modal setClose={setShowModal} header={modalCommand}>
                <UserProfileModal
                  data={modalData}
                  error={modalError}
                  loading={modalLoading}
                  t={t}
                  setData={setData}
                  user={user}
                  profile={profile}
                  setProfile={setProfile}
                  isBlock={isBlock}
                />
              </Modal>
              )
            }
          </div>
        )
      }
    </>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ['common'],
      i18n,
    )),
  },
});

export default Username;
