/* eslint-disable no-unused-expressions */
import { CheckOutlined, CloseOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
// import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { AuthContext } from '../context/authContext';
import { useConversation } from '../context/conversation';
import { useSocket } from '../context/socket';
import Modal from './Modal';

const ConversationModal = ({ setIsOpenNewConversation, filter, t }) => {
  const { user } = useContext(AuthContext);

  const { setCurrentConversation, setConversations, setChat, currentConversation } = useConversation();

  const [username, setUsername] = useState('');

  const [data, setData] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const socket = useSocket();

  async function forcreate() {
    await axios({
      method: 'POST',
      data: {
        recipients: users,
      },
      withCredentials: true,
      url: `${process.env.SERVER}/conversations/findOrCreate`,
    }).then((res) => {
      const { ans, qty } = res.data;
      // console.log(ans, qty);
      if (!qty) {
        console.log('icinde men\n');
        setChat((prev) => [{ _id: ans._id, messages: [] }, ...prev]);
        setConversations((prev) => [ans, ...prev]);
      }

      setCurrentConversation(ans);
      setIsOpenNewConversation(false);
    }).catch((error) => {
      if (error.response) alert(error.response.data.message);
      else alert('Something wrong went! Try again!');
    });
  }

  function foradd() {
    const { recipients, ...other } = currentConversation;
    const nw = [...recipients, user];
    const ns = { recipients: nw.map((i) => i._id), ...other };
    socket.emit('add_user', { add: users, currentConversation: ns }, (k) => {
      if (k.err) {
        alert('Sorry something wrong went');
      } else {
        setConversations((prev) => prev.map((i) => {
          if (i._id !== currentConversation._id) return i;

          return k.data;
        }));
      }
    });
  }
  const onFinish = async () => {
    if (filter.length === 0) forcreate();
    else foradd();
  };
  const handleChange = async (e) => {
    let cancel;
    setUsername(e.target.value);
    setLoading(true);
    setErr(null);
    setData([]);

    try {
      if (e.target.value === '') { setLoading(false); return; }
      cancel && cancel();
      const { CancelToken } = axios;
      const res = await axios({
        method: 'POST',
        url: `${process.env.SERVER}/find`,
        data: {
          tapmaly: e.target.value,
        },
        withCredentials: true,
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });
      // const { data } = res;
      setData(res.data.filter((i) => filter.filter((j) => j === i._id).length === 0));
      setData((prev) => prev.map((i) => ({ username: i.username,
        logo: i.logo,
        firstName: i.firstName,
        lastName: i.lastName,
        _id: i._id })));
    } catch (error) {
      if (error.response) setErr(error.response.data.message);
      else setErr('Network error');
    }
    setLoading(false);
  };
  return (
    <Modal
      setClose={setIsOpenNewConversation}
      footer
      onClick={onFinish}
      header={filter.length === 0 ? t('direct.modalTitle') : t('direct.addUserGroup')}
    >
      <div className="flex flex-col w-full relative mb-20">
        <div className="w-full flex flex-row justify-center dark:bg-nft-black-2 items-center py-1 px-4 shadow">
          <UserOutlined />
          <input
            placeholder={t('direct.searchUsers')}
            value={username}
            onChange={handleChange}
            className="outline-none py-2 pl-1 h-full w-full flex-1 dark:transparent  dark:bg-transparent"
          />
          {
            (username.length > 0 && !loading) && <CloseOutlined onClick={() => { setUsername(''); setData([]); }} />
          }
          {
            loading && <LoadingOutlined />
          }
        </div>
        <div className="w-full flex flex-col gap-2 mt-3">
          {
          err && [...users, ...data.filter(
            (i) => users.filter((f) => f._id === i._id).length === 0,
          )].length === 0 && (
          <div className="flex h-full w-full justify-center items-center">
            <MdErrorOutline className="text-xl" />
          </div>
          )
        }
          {
            [...users, ...data.filter(
              (i) => users.filter((f) => f._id === i._id).length === 0,
            )].length === 0 && username.length > 0 && (
            <div className="flex h-full w-full justify-center items-center">
              <p className="text-xl md:text-base xs:test-sm">{t('direct.notFound')}</p>
            </div>
            )
        }
          {
          [...users, ...data.filter(
            (i) => users.filter((f) => f._id === i._id).length === 0,
          )].length > 0
            && [...users, ...data.filter(
              (i) => users.filter((f) => f._id === i._id).length === 0,
            )].map((i, index) => (
              <div
                key={index}
                className="flex flex-row justify-center items-center cursor-pointer"
                onClick={() => {
                  users.filter((f) => f._id === i._id).length > 0
                    ? setUsers((prev) => prev.filter((f) => f._id !== i._id))
                    : setUsers((prev) => [...prev, i]);
                }}
              >

                <div className="w-full flex-1 p-2 shadow dark:bg-nft-black-2 flex flex-row items-center justify-between">
                  <div className="h-6 w-6 cursor-pointer rounded-full bg-[#ccc] dark:bg-nft-gray-3 flex justify-center items-center mr-2">
                    {users.filter((f) => f._id === i._id).length > 0
                      ? (
                        <CheckOutlined
                          className="text-white dark:text-blue-400 "

                        />
                      )
                      : (
                        <div
                          className="h-4 w-4 rounded-full bg-white dark:bg-nft-black-1"

                        />
                      )}

                  </div>
                  <div className="flex flex-row gap-5 flex-1 items-center">
                    <div className="h-10 w-10 rounded-full flex justify-center items-center bg-nft-gray-1 dark:bg-nft-black-1 overflow-hidden">
                      {
i.logo.length > 0
  ? <img src={`${process.env.SERVER}/${i.logo}`} className="w-full h-full object-cover" />
  : <UserOutlined />
}

                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <p>{i.username}</p>
                      {((i.firstName.length > 0) || (i.lastName.length > 0))
&& <h1 className="font-medium text-sm">{`${i.firstName} ${i.lastName}`}</h1>}
                    </div>
                  </div>

                </div>
              </div>

            ))

      }
        </div>

      </div>
    </Modal>
  );
};

export default ConversationModal;
