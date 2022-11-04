/* eslint-disable react/button-has-type */
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useConversation } from '../context/conversation';
import { useSocket } from '../context/socket';

const UserFollowOrBlock = ({ t }) => {
  const [loading, setLoading] = useState(false);

  const [bloading, setBLoading] = useState(false);
  const { profile, setProfile } = useContext(AuthContext);
  const socket = useSocket();
  const { conversations,
    currentConversation,
    setCurrentConversation, setConversations } = useConversation();

  const follow = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.SERVER}/friends/follow`, { _id: currentConversation.recipients[0]._id }, { withCredentials: true });
      socket.emit('newnotification', { users: [currentConversation.recipients[0]._id] });
      setProfile((prev) => {
        const { following, ...other } = prev;
        return { ...other, following: [res.data._id, ...following] };
      });
    } catch (error) {
      console.error(error);
      alert(error);
    }
    setLoading(false);
  };

  const addBlocking = async () => {
    try {
      setBLoading(true);
      await axios.patch(`${process.env.SERVER}/friends/addblock`, { _id: currentConversation.recipients[0]._id }, { withCredentials: true });

      setProfile((prev) => {
        const { blocking, ...other } = prev;
        return { ...other, blocking: [currentConversation.recipients[0]._id, ...blocking] };
      });
      // console.log(currentConversation, conversations )

      // console.log()
      const id = currentConversation._id;
      setCurrentConversation(null);

      setConversations(conversations.filter((i) => i._id !== id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
    setBLoading(false);
  };
  if (!currentConversation.isGroup && profile.following.filter((i) => i === currentConversation.recipients[0]._id).length === 0) {
    return (
      <div className=" flex flex-row items-center justify-center gap-3
    "
      >

        <button
          className="transition-all duration-500 px-2 py-1 text-sm mr-2 xs:text-xs
           bg-blue-600 dark:bg-blue-500  text-white rounded-lg"
          onClick={follow}
          disabled={loading}
        >{t('profile.follow')}
        </button>
        <button
          className="transition-all duration-500 px-2 py-1 text-sm  rounded-lg xs:text-xs
           text-white bg-nft-gray-3 dark:bg-nft-black-1"
          // loading={bloading}
          disabled={bloading}
          onClick={addBlocking}
        >{t('profile.block')}
        </button>

      </div>
    );
  }
  return null;
};

export default UserFollowOrBlock;
