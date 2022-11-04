/* eslint-disable react/jsx-props-no-multi-spaces */
import { InfoCircleFilled, VideoCameraOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useConversation } from '../context/conversation';
import UserFollowOrBlock from './UserFollowOrBlock';

const CurrentConversation = ({ setIsOpen, isOpen, t }) => {
  const { currentConversation, setStartVideoChat, callUser } = useConversation();

  // const [show, setShow] = useState(true);
  useEffect(() => {
    setIsOpen(false);
  }, [currentConversation]);
  // console.log(call)
  return (
    <div className="w-full flex flex-row justify-between px-4 py-3 border-b">
      <div className={`text-lg font-medium flex flex-row gap-3  ${isOpen ? ' opened_top ' : ''}`}>
        <h1>{ isOpen ? 'Information' : currentConversation.name}</h1>
        <UserFollowOrBlock t={t} />
      </div>
      <div className="flex flex-row justify-between gap-3 items-center">
        { !currentConversation.isGroup
                    && (
                    <VideoCameraOutlined
                      onClick={() => {
                        setStartVideoChat((prev) => !prev);
                        callUser(currentConversation.recipients[0]);
                      }}
                      className="text-2xl"
                    />
                    )}
        <InfoCircleFilled
          onClick={() => setIsOpen(!isOpen)}

          className={`${isOpen ? 'text-nft-black-2 dark:text-white' : 'text-nft-gray-2 dark:text-gray-2'} text-2xl transition-all duration-300`}
        />
      </div>

    </div>
  );
};

export default CurrentConversation;
