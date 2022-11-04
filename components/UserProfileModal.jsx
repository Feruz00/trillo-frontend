/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-mixed-operators */
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/socket';

const UserProfileModal = ({ loading, data, user, error, t, setProfile, profile, isBlock }) => {
  const [actionLoading, setActionLoading] = useState([]);

  const checkIsFollowing = (id) => profile && profile.following.filter((i) => i === id).length > 0;

  const [result, setResult] = useState(data);
  useEffect(() => {
    setResult(data);
  }, [data]);
  const socket = useSocket();

  const unfollow = async (id) => {
    try {
      const res = await axios.post(`${process.env.SERVER}/friends/unfollow`, { _id: id }, { withCredentials: true });
      setProfile((prev) => {
        const { following, ...other } = prev;
        return { ...other, following: following.filter((i) => i !== id) };
      });
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const follow = async (id) => {
    try {
      await axios.post(`${process.env.SERVER}/friends/follow`, { _id: id }, { withCredentials: true });
      socket.emit('newnotification', { users: [data._id] });
      setProfile((prev) => {
        const { following, ...other } = prev;
        return { ...other, following: [id, ...following] };
      });
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };
  const removeBlock = async (num) => {
    // console.log(result);
    try {
      await axios({
        method: 'PATCH',
        url: `${process.env.SERVER}/friends/removeblock`,
        data: {
          _id: num,
        },
        withCredentials: true,
      });
      setResult((prev) => prev.filter((i) => i._id !== num));
      // console.log(profile);
      setProfile((prev) => {
        const { blocking, ...other } = prev;
        return { ...other, blocking: blocking.filter((i) => i._id !== num) };
      });
      // console.log(profile);
    } catch (error) {
      // console.log(error);
      error.response ? alert(error.response.data.message) : alert('Network error');
    }
  };

  const handleFollow = async (id) => {
    setActionLoading((prev) => [...prev, id]);
    // console.log('handleFollow', id, isBlock);

    // console.log('geldim handleFollow');
    // eslint-disable-next-line no-unused-expressions

    isBlock ? removeBlock(id) : checkIsFollowing(id) ? await unfollow(id) : await follow(id);

    setActionLoading((prev) => prev.filter((i) => i !== id));
  };

  return (
    <div className="h-full w-full flex flex-col gap-2">
      {
        loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <LoadingOutlined className="text-2xl" />
            Feruz
          </div>
        ) : error ? (
          <div className="h-full w-full flex justify-center items-center">
            <h1 className="font-semibold text-2xl md:text-xl text-red-600 dark:text-red-500">{error}</h1>
          </div>
        )
          : result.map((i, index) => (

            <div key={index} className="w-full p-2 shadow dark:bg-nft-black-2 flex flex-row items-center justify-between">
              <div className="flex flex-row gap-5 flex-1 items-center">
                <div className="h-10 w-10 rounded-full flex justify-center items-center bg-nft-gray-1 dark:bg-nft-black-1 overflow-hidden">
                  {
              i.logo.length > 0
                ? <img src={`${process.env.SERVER}/${i.logo}`} className="w-full h-full object-cover" />
                : <UserOutlined />
            }

                </div>
                <div className="flex flex-col items-start justify-between">
                  <Link href={`/user/${i.username}`}><a>{i.username}</a></Link>
                  {((i.firstName.length > 0) || (i.lastName.length > 0))
              && <h1 className="font-medium text-sm">{`${i.firstName} ${i.lastName}`}</h1>}
                </div>
              </div>
              {

          i._id !== user._id && (
          <div
            className={`p-2 ${isBlock ? 'text-white bg-nft-gray-3 dark:bg-nft-black-1' : !checkIsFollowing(i._id) ? 'bg-blue-600 font-semibold text-white' : 'dark:bg-nft-black-1 bg-[#ccc]'}  px-3 cursor-pointer`}
            onClick={() => handleFollow(i._id)}
          >

            <h1>{ isBlock ? t('profile.unblock') : checkIsFollowing(i._id) ? t('profile.unfollow') : t('profile.follow') }
              {`${actionLoading.filter((t) => t === i._id).length > 0 ? '...' : ''}`}
            </h1>
          </div>
          )
        }
            </div>
          ))
  }
    </div>
  );
};

export default UserProfileModal;
