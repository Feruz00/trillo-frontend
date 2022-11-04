import { useState, useEffect, useContext } from 'react';
// import { Modal } from 'react-bootstrap';
import { LoadingOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';

import axios from 'axios';
import Link from 'next/link';
import { useConversation } from '../context/conversation';
import { AuthContext } from '../context/authContext';
import { useSocket } from '../context/socket';
// import UserProfileModal from './UserProfileModal';
import ConversationModal from './ConversationModal';
import Modal from './Modal';

const Input = ({ text, setText, placeholder, type }) => {
  const [hover, setHover] = useState(false);
  return (
    <div className="flex flex-col w-7/12 sm:w-full">
      <div className={`px-2 border border-border-blue-600 w-full flex flex-row items-center
                    rounded-lg justify-center text-base transition duration-300 
                    ${hover && 'border-2'} hover:border-blue-700 `}
      >
        <input
          placeholder={placeholder}
          className="w-full outline-none py-1 text-sm h-full dark:bg-transparent"
          value={text}
          type={type}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          onChange={(e) => setText(e.target.value)}
        />

      </div>

    </div>

  );
};

const ChatInformationCenter = ({ t, isOpen }) => {
  const { setCurrentConversation, currentConversation, setConversations, setChat } = useConversation();
  const [name, setName] = useState('');
  const [current, setCurrent] = useState('');
  const { user } = useContext(AuthContext);
  const [cloading, setcLoading] = useState(false);
  const [dloading, setdLoading] = useState(false);
  const [ac, setAc] = useState(false);

  const [show, setShow] = useState(false);

  const socket = useSocket();

  useEffect(() => {
    setName(currentConversation.groupName);
    setCurrent('');
    setAc(false);
    setcLoading(false);
  }, [currentConversation]);

  const leaveGroup = () => {
    socket.emit('leave-group', { currentConversation, user }, ({ err }) => {
      if (err) alert('errr boldy');
      else {
        setCurrentConversation(null);
        setConversations((prev) => prev.filter((i) => i._id !== currentConversation._id));
      }
    });
  };

  const handleChange = () => {
    // console.log('geldim handleChange');
    socket.emit('handleChange', { currentConversation, name }, ({ err }) => {
      // console.log('girdim icine ');
      if (err) alert('handleChange name error');
      else {
        setConversations((prev) => prev.map((i) => {
          if (i._id !== currentConversation._id) return i;

          const { groupName, ...other } = i;
          return { groupName: name, ...other };
        }));
      }
    });
  };

  const deleteUser = () => {
    setdLoading(true);
    socket.emit('deleteUser', { currentConversation, current }, ({ err }) => {
      if (err) alert('User cannot deleted');
      else {
        setdLoading(false);
        setAc(false);
        setConversations((prev) => prev.map((i) => {
          if (i._id !== currentConversation._id) return i;

          const { recipients, ...other } = i;
          return { recipients: recipients.filter((t) => t._id !== current), ...other };
        }));
      }
    });
  };

  const changeUser = () => {
    setdLoading(true);
    socket.emit('changeUser', { currentConversation, current }, ({ err, ans }) => {
      if (err) alert('User cannot change status');
      else {
        setdLoading(false);
        setConversations((prev) => prev.map((i) => {
          if (i._id !== currentConversation._id) return i;

          const { admins, ...other } = i;
          let k = [];
          if (ans) k = admins.filter((t) => t !== current);
          else k = [...admins, current];
          return { admins: k, ...other };
        }));
        setAc(false);
      }
    });
  };

  async function deleteChat() {
    await axios({
      method: 'POST',
      url: `${process.env.SERVER}/conversations/deleteChat`,
      withCredentials: true,
      data: {
        currentConversation,
      },
    }).then(() => {
      const id = currentConversation._id;
      setCurrentConversation(null);
      setConversations((prev) => prev.filter((i) => i._id !== id));
      setChat((prev) => prev.filter((i) => i._id !== id));
    }).catch(() => {
      alert('error delete chat');
    });
  }

  return (
    <div className="w-full h-full flex flex-col gap-3 p-3">
      { currentConversation.isGroup
            && (currentConversation.isAdmin
              ? (
                <div className="w-full  border-b flex flex-row items-center p-3">

                  <Input
                    type="text"
                    text={name}
                    placeholder={t('direct.changeGroupName')}
                    setText={setName}
                  />

                  {/* eslint-disable-next-line react/button-has-type */}
                  <button
                    onClick={handleChange}
                    className="rounded-lg bg-blue-600 hover:bg-blue-800 text-white transition-all duration-500
                    cursor-pointer px-4 py-1 ml-4 disabled:cursor-not-allowed
                    "
                    disabled={cloading}
                  >
                    {t('settings.change')} {cloading && '...'}
                  </button>
                </div>
              )
              : <h1> {t('direct.groupName')}: {currentConversation.name} </h1>

            )}
      <div className="w-full flex flex-row items-center justify-between border-b p-2">
        <h1 className="font-medium text-lg">
          {
            currentConversation.isGroup ? t('direct.users') : t('direct.user')
          }
          :

        </h1>
        {currentConversation.isGroup && currentConversation.isAdmin
            && (
            <div
              className="flex flex-row cursor-pointer text-blue-700 dark:text-blue-500 "
              onClick={() => setShow(true)}
            >
              <UserAddOutlined className="text-2xl" />
            </div>

            )}
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        {
                currentConversation.recipients.map((i, index) => (
                  <div className="w-full flex flex-row " key={index}>
                    <div className="flex flex-row gap-3 items-center mt-2 flex-1">
                      <div className="w-10 h-10 rounded-full border  overflow-hidden flex justify-center items-center">
                        {
                                i.logo.length > 0
                                  ? <img src={`${process.env.SERVER}/${i.logo}`} className="w-full h-full object-cover" />
                                  : <UserOutlined className="text-base" />
                            }

                      </div>
                      <Link href={`/user/${i.username}`}>
                        <a> {i.username} </a>
                      </Link>

                    </div>
                    {currentConversation.isGroup && currentConversation.isAdmin
                            && (
                            <div
                              onClick={() => {
                                setCurrent(i._id);
                                setAc(true);
                              }}
                              className="flex flex-row items-center gap-1 cursor-pointer"
                            >
                              <div className="w-1 h-1 bg-nft-gray-2 dark:bg-white rounded-full" />
                              <div className="w-1 h-1 bg-nft-gray-2 dark:bg-white rounded-full" />
                              <div className="w-1 h-1 bg-nft-gray-2 dark:bg-white rounded-full" />

                            </div>

                            )}
                  </div>
                ))
            }
      </div>
      <div className="w-full p-2 border-t flex flex-row items-center justify-between">
        <div
          className="cursor-pointer bg-nft-gray-3 px-4 py-1 rounded-lg text-white"
          onClick={deleteChat}
        >
          {t('direct.deleteChat')}
        </div>
        {currentConversation.isGroup
                && (
                <div
                  className="cursor-pointer bg-blue-600 dark:bg-blue-500 transition-all duration-300 px-4 py-1 rounded-lg text-white"
                  onClick={leaveGroup}
                >

                  {t('direct.leaveGroup')}
                </div>
                )}
      </div>
      {
        show && <ConversationModal filter={currentConversation.recipients.map((i) => i._id)} setIsOpenNewConversation={setShow} t={t} />

      }

      {
                ac && (
                <Modal setClose={setAc}>
                  <div className="w-full h-full flex items-center justify-center gap-4 flex-col">
                    <h1
                      className="shadow w-8/12 sm:w-full  px-3 py-2 dark:bg-nft-black-2 cursor-pointer"
                      onClick={changeUser}
                    >{currentConversation.admins.includes(current) ? t('direct.clearAdminList') : t('direct.addAdminList')}
                    </h1>
                    <h1
                      className="shadow w-8/12 sm:w-full px-3 py-2 dark:bg-nft-black-2 cursor-pointer"
                      onClick={deleteUser}
                    >
                      {t('direct.deleteUser')}
                    </h1>
                    { dloading && <LoadingOutlined className="text-2xl" /> }

                  </div>
                </Modal>
                )
            }
    </div>
  );
};

export default ChatInformationCenter;
