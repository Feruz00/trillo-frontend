/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-multi-spaces */
import { UserOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';
import { useConversation } from '../context/conversation';

const Avatars = ({ logo, isGroup, isOnline }) => (
  <div className="flex flex-row w-14 relative">
    {
        logo.map((i, index) => (
          logo.length > 1
            ? (
              <div
                key={index}
                className={`w-7 h-7
          flex justify-center items-center
          ${index === 0 && 'border border-black'}
                
                ${index === 1 && '-translate-x-[10px]'}
          rounded-full bg-nft-gray-${index + 1} 
          dark:bg-nft-black-${index + 1} overflow-hidden`}
              >

                {
              i.length > 0
                ? <img src={`${process.env.SERVER}/${i}`} className="w-full h-full object-cover" />
                : <UserOutlined />
            }
              </div>
            )
            : (
              <div
                key={index}
                className="w-10 h-10
          flex justify-center items-center
          rounded-full bg-nft-gray-1
          dark:bg-nft-black-1
          border border-nft-gray-3 relative

          "
              >
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">

                  {
              i.length > 0
                ? <img src={`${process.env.SERVER}/${i}`} className="w-full h-full object-cover" />
                : <UserOutlined />
            }
                  {

                 isOnline
                 && (
                 <div className="
                bg-white before:content-[''] before:h-[10px] before:w-[10px] before:rounded-full
                before:bg-[#1ed760] z-10 h-4 w-4 rounded-full absolute -bottom-[2px] right-0 flex items-center justify-center "
                 />
                 )
              }

                </div>
              </div>

            )
        ))
    }
  </div>
);

const ConversationsList = ({ isMobile, setClose, t }) => {
  const { typing, chat, count, conversations, currentConversation, setCurrentConversation, onlineUsers } = useConversation();
  const currentMessage = (id) => {
    const ind = typing.findIndex((i) => i.current._id === id) >= 0;

    if (ind) {
      return (
        <div className="flex flex-row items-center justify-between">
          <p>  {t('direct.typing')}... </p> <div className="dot-pulse bg-blue-600" />
        </div>
      );
    }

    const num = chat.findIndex((i) => i._id === id);
    if (num === -1) return <p />;
    const m = chat[num].messages;
    if (m.length === 0) return <p />;
    if (m[m.length - 1].type !== 'text') return <p>{t(`direct.${m[m.length - 1].type}`)}  {m[m.length - 1].type !== 'post' ? t('direct.sended') : ''}</p>;
    let p = m[m.length - 1].text;
    if (p.length > 15) p = `${p.substr(0, 15)}...`;
    const ok = count.findIndex((i) => i === id) >= 0;
    if (ok) return <b> {p} </b>;
    return <p>{p}</p>;
  };
  const isTyping = (id) => typing.findIndex((i) => i.current._id === id) >= 0;
  const okCount = useCallback((id) => count.findIndex((i) => i === id) >= 0, [count]);
  // console.log(conversations);
  return (
    <div className="w-full h-full flex flex-col
     overflow-y-auto"
    >
      {
        conversations.map((i, index) => (
          <div
            key={i._id}
            onClick={() => {
              setCurrentConversation(i);
              if (isMobile) {
                setClose(false);
              }
            }}
            className={`
            h-16
            flex flex-row w-full 
            items-center justify-center cursor-pointer 
            px-3 py-2
            dark:bg-nft-black-3
            ${index !== 0 && 'border-t'}
            ${index === conversations.length - 1 && 'border-b'}

            ${currentConversation !== null && i._id === currentConversation._id
              ? 'bg-nft-gray-1 dark:bg-black' : 'bg-white'}`}
          >
            <Avatars
              logo={i.logo}
              isGroup={i.isGroup}
              isOnline={!i.isGroup && onlineUsers.filter((t) => t.userId === i.recipients[0]._id).length > 0}
            />
            <div className="flex-1 flex flex-row items-center justify-center">
              <div
                className="w-[90%] flex flex-col"
              >
                <h1 className="text-base">
                  {
                        i.isGroup
                          ? i.groupName.length > 0 ? i.groupName
                            : i.name
                          : i.name
                    }
                </h1>
                <div className="text-sm font-medium dark:text-white">
                  {
                    currentMessage(i._id)
                }
                </div>
              </div>
              {
                  !isTyping(i._id) && okCount(i._id) && <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-white" />

                }
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default ConversationsList;
