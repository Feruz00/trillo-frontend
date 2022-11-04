import { PhoneOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { MdPhoneDisabled } from 'react-icons/md';
import { useConversation } from '../context/conversation';

const UserToCall = () => {
  const { answerCall, call, callAccepted, leaveCall } = useConversation();

  return (

    call.isReceivingCall && !callAccepted
        && (
        <div className="w-1/6 md:w-1/2 bg-nft-gray-2 dark:bg-nft-black-3 fixed z-50 top-52 right-1/2 translate-x-1/2 rounded
     animate-pulse hover:animate-none
        flex flex-col-reverse gap-2
        p-4
        "
        >
          <div className="flex flex-row justify-between">
            <div
              onClick={answerCall}
              className="bg-green-500 w-8 h-8 rounded-full overflow-hidden flex justify-center items-center"
            >
              <PhoneOutlined
                className="text-white text-lg cursor-pointer -translate-y-[1px]"

              />
            </div>
            <div
              onClick={leaveCall}
              className="bg-red-500 w-8 h-8 rounded-full overflow-hidden flex justify-center items-center"
            >
              <MdPhoneDisabled
                className="text-white text-lg cursor-pointer -translate-y-[1px]"
              />
            </div>

          </div>

          <div className="flex flex-row gap-2 items-center">
            <div className="w-10 h-10 rounded-full flex justify-center items-center overflow-hidden">
              {
                    call.from.logo.length === 0
                      ? <UserOutlined className="text-2xl" />

                      : <img src={`${process.env.SERVER}/${call.from.logo}`} className="w-full h-full object-cover" />
                }
            </div>
            <p className="">{call.from.username}</p>
          </div>

        </div>
        )

  );
};

export default UserToCall;
