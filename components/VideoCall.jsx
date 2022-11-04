/* eslint-disable jsx-a11y/media-has-caption */
import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

import { MdPhoneDisabled } from 'react-icons/md';
import { useConversation } from '../context/conversation';

const VideoCall = () => {
  const { myVideo, userVideo, leaveCall, startVideoChat } = useConversation();
  const [muted, setMuted] = useState(false);
  return (startVideoChat
    && (
    <div className="flexCenter fixed inset-0 z-10 bg-overlay-black animated fadeIn

    "
    >
      <div className="w-2/3 md:w-full p-2 flex flex-col gap-2 items-center">

        <video
          playsInline
          muted={muted}
          ref={userVideo.current.length > 0 ? userVideo.current[0] : myVideo}
          autoPlay
          className="call_view"
        />
        <div className="flex flex-row w-1/2 justify-around">
          <div
            className="h-12 w-12 flex rounded-full justify-center  cursor-pointer
          items-center bg-red-500 hover:bg-red-700 transition-all duration-500"
            onClick={leaveCall}

          >
            <MdPhoneDisabled
              className="text-white text-lg cursor-pointer"
            />
          </div>
          <div
            className="h-12 w-12 flex rounded-full justify-center  cursor-pointer
          items-center bg-nft-gray-2 hover:bg-nft-gray-3 transition-all duration-500"
            onClick={() => setMuted((prev) => !prev)}

          >
            {
                !muted
                  ? (
                    <AudioOutlined
                      className="text-white text-lg cursor-pointer"
                    />
                  )
                  : (
                    <AudioMutedOutlined
                      className="text-white text-lg cursor-pointer"
                    />
                  )
            }

          </div>

        </div>

      </div>

    </div>
    )
  );
};

export default VideoCall;
