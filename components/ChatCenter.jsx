/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/button-has-type */
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';

// import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { useConversation } from '../context/conversation';
import calculateTime from '../calculateTime';
import Modal from './Modal';
import MessagePost from './MessagePost';
import PostView from '../containers/ModalPost/PostView';
import ModalPost from '../containers/ModalPost/ModalPost';
// import UserFollowOrBlock from './UserFollowOrBlock';

const Chatcenter = ({ t }) => {
  const { typing,
    currentConversation,
    selectedChat } = useConversation();
  const { user } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState({ url: '', type: '' });
  const [openPost, setOpenPost] = useState(false);
  const [openPostId, setOpenPostId] = useState('');

  useEffect(() => {
    if (!isOpen) setUrl('');
  }, [isOpen]);

  const tp = useMemo(() => {
    const k = typing.findIndex((i) => i.current._id === selectedChat._id);
    if (k >= 0) return typing[k];
    return null;
  }, [typing, selectedChat]);

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({
        // behavior: 'smooth',
        block: 'nearest',
        // inline: 'start',
      });
    }
  }, []);
  return (
    <div className="w-full p-2 relative flex flex-col">
      {
            selectedChat.messages.map((message, index) => {
              const lastMessage = selectedChat.messages.length - 1 === index;
              return (
                <div
                  ref={(tp === null && lastMessage) ? setRef : null}
                  key={index}
                  className={`
                  w-full mb-2 
                  flex flex-col
                   ${message.sender._id === user._id ? 'items-end' : 'items-start'} `}
                >
                  <div className={`flex w-full items-center gap-1 ${message.sender._id === user._id ? 'justify-end flex-row-reverse' : 'justify-start flex-row'} `}>

                    <div className="border w-10 h-10 flex items-center justify-center rounded-full overflow-hidden">
                      {
                            message.sender.logo.length === 0
                              ? <UserOutlined className="text-lg -translate-y-1" />
                              : <img src={`${process.env.SERVER}/${message.sender.logo}`} className="w-full h-full object-cover" />
                        }
                    </div>

                    <div className={` flex flex-col ${message.sender._id === user._id ? 'items-end' : 'items-start'} w-full `}>
                      <div className={`border max-w-[50%] rounded md:max-w-full break-words px-2 py-1
                       ${message.sender._id === user._id ? 'bg-nft-gray-1 dark:bg-nft-black-3' : 'dark:bg-nft-gray-3'}`}
                      >
                        {
                          message.type === 'text' && <p> {message.text}</p>
                        }
                        {
                          message.type === 'image'
                          && (
                          <img
                            src={`${process.env.SERVER}/${message.text}`}
                            onClick={() => {
                              setIsOpen(true);
                              setUrl({ url: message.text, type: 'image' });
                            }}
                            style={{
                              height: '10rem',

                              width: '10rem',
                              objectFit: 'contain',
                              objectPosition: 'center',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                              // className="cursor-pointer h-40 w-0 object-cover flex items-center justify-center"
                          />
                          )
                        }
                        {
                          message.type === 'video'
                          && (
                          <video
                            src={`${process.env.SERVER}/${message.text}`}
                            onClick={() => {
                              setIsOpen(true);

                              setUrl({ url: message.text, type: 'video' });
                            }}
                            style={{
                              height: '10rem',

                              width: '10rem',
                              objectFit: 'contain',
                              objectPosition: 'center',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                              // className="cursor-pointer h-40 w-0 object-cover flex items-center justify-center"
                          />
                          )
                        }

                        {
                          message.type === 'post' && (
                            <MessagePost
                              id={message.text}
                              t={t}
                              setOpenPost={setOpenPost}
                              setOpenPostId={setOpenPostId}
                            />
                          )
                        }
                      </div>
                      <p style={{ fontSize: '10px' }}>{calculateTime(message.createdAt, t)}</p>
                    </div>

                  </div>
                  {
                    message.sender._id !== user._id && currentConversation.isGroup
                    && <div className="text-sm"> {message.sender.username} </div>
                  }
                </div>
              );
            })
            }
      { tp !== null
              && tp.writers.map((i, index) => {
                const ls = tp.writers.length - 1 === index;
                return (
                  <div
                    key={index}
                    ref={ls ? setRef : null}
                    className="my-1 d-flex flex-column align-items-start"
                    style={{ color: '#aaa5a5', paddingLeft: '1rem', fontSize: '0.9rem' }}
                  >
                    {currentConversation.isGroup ? `${i.username} ${t('direct.smallTyping')}...` : `${t('direct.typing')}...`}
                  </div>
                );
              })}
      {
                isOpen && (
                  <Modal
                    setClose={setIsOpen}
                  >
                    <div className="h-full w-full flex items-center justify-center">
                      {
                        url.type === 'image'
                          ? (
                            <img
                              src={`${process.env.SERVER}/${url.url}`}
                              className="w-full h-full object-contain"
                            />
                          )
                          : (
                            <video
                              src={`${process.env.SERVER}/${url.url}`}
                              className="w-full h-full object-contain"

                              controls="noDownloads"
                            />
                          )
                      }

                    </div>
                  </Modal>
                )
              }
      {
      openPost && (
        <ModalPost

          setClose={setOpenPost}
        >
          <PostView
            data={openPostId}
          />
        </ModalPost>

      )
    }
    </div>

  );
};

export default Chatcenter;
