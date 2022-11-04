import { FileSyncOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';

const HomeLoaderSkeleton = () => (
  <div className="nav-h max-w-[1100px] w-full flex flex-col animate-pulse items-center justify-center p-2">
    <div className=" flex flex-row items-center gap-10 w-[60%] sm:w-full">
      <div className="border rounded-full w-14 h-14 sm:w-10 sm:h-10 flex items-center justify-center bg-nft-gray-2 dark:bg-nft-gray-3">
        <UserOutlined className="text-2xl sm:text-xl" />
      </div>
      <div className="flex-1 flex flex-col items-start justify-between gap-2">

        <div className="w-full h-3 rounded-lg bg-nft-gray-2 dark:bg-nft-gray-3" />
        <div className="w-10/12 h-2 rounded-lg bg-nft-gray-2 dark:bg-nft-gray-3" />

      </div>
    </div>
    <div className="flex-1 w-[60%] sm:w-full mt-4 flex flex-col gap-2">
      <div className="flex-1 w-full  flex justify-center items-center border bg-nft-gray-1 dark:bg-nft-black-1">
        <FileSyncOutlined className="text-5xl" />
      </div>
    </div>
  </div>
);

export default HomeLoaderSkeleton;
