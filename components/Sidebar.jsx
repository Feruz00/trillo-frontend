import { CheckSquareOutlined, CloseOutlined, LoadingOutlined, MenuOutlined, PlayCircleOutlined, PlusCircleOutlined, PlusSquareOutlined } from '@ant-design/icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useConversation } from '../context/conversation';
import ConversationModal from './ConversationModal';
import ConversationsList from './ConversationsList';
import Modal from './Modal';

const Sidebar = ({ t }) => {
  const [isOpenNewConversation, setIsOpenNewConversation] = useState(false);
  const { setConversations, conversations, setChat, loading, setLoading } = useConversation();

  const [modalSidebar, setModalSidebar] = useState(false);

  useEffect(() => {
    if (conversations.length !== 0) return;
    setLoading(true);
    axios({
      method: 'GET',
      withCredentials: true,
      url: `${process.env.SERVER}/conversations/mylist`,
    }).then((res) => {
      const { conversation, message } = res.data;
      setConversations(conversation);
      setChat(message);
    }).catch((err) => {
      console.log(err);
      alert('Cannot upload conversation list!');
    });
    setLoading(false);
  }, [isOpenNewConversation]);

  return (
    <div className="w-4/12 h-full md:h-12 md:w-full
    flex justify-center items-center flex-col
    shadow border rounded-lg dark:bg-nft-black-2
    md:p-2
    "
    >
      <div className="w-full border-b md:border-none  p-2 md:p-0 md:px-1 flex justify-between flex-row items-center">
        <div
          className="p-1 md:p-0 flex flex-row items-center h-full cursor-pointer "
          onClick={() => setIsOpenNewConversation(true)}
        >
          <p className=" text-lg md:text-base sm:text-sm xs:text-xs flex justify-center items-center font-regular transition-all duration-500">
            <PlusCircleOutlined className=" mr-2" />

            <span>
              {t('direct.selectNewConersation')}
            </span>
          </p>
        </div>
        {
          modalSidebar
            ? <CloseOutlined className="cursor-pointer hidden md:flex" onClick={() => setModalSidebar(false)} />
            : <MenuOutlined className="cursor-pointer hidden md:flex" onClick={() => setModalSidebar(true)} />

        }

      </div>
      <div className="flex-1 md:hidden w-full pb-2 overflow-y-auto">
        {
          loading && (
            <div className="w-full h-full flex justify-center items-center">
              <LoadingOutlined className="text-2xl" />
            </div>
          )
        }
        {
          conversations.length === 0 && (
            <div className="w-full h-full flex justify-center items-center">
              <p>{

                t('direct.noChat')
              }
              </p>
            </div>
          )
        }
        {
          conversations.length > 0 && <ConversationsList t={t} />
        }
      </div>
      {
        modalSidebar && (
          <Modal
            setClose={setModalSidebar}
            header={t('direct.modalTitle')}
          >
            <div className="w-full">
              {
          loading && (
            <div className="w-full h-full flex justify-center items-center">
              <LoadingOutlined className="text-2xl" />
            </div>
          )
        }
              {
          conversations.length === 0 && (
            <div className="w-full h-full flex justify-center items-center">
              <p>{

                t('direct.noChat')
              }
              </p>
            </div>
          )
        }
              {
          conversations.length > 0 && <ConversationsList isMobile setClose={setModalSidebar} t={t} />
        }
            </div>
          </Modal>
        )
      }
      {
        isOpenNewConversation && (
        <ConversationModal
          filter={[]}
          t={t}
          setIsOpenNewConversation={setIsOpenNewConversation}
          isOpenNewConversation={isOpenNewConversation}
        />
        )
      }
    </div>
  );
};

export default Sidebar;
