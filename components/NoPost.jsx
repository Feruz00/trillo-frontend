import { ReloadOutlined } from '@ant-design/icons';
import React from 'react';

const NoPost = ({ t }) => (
  <div className="nav-h flex justify-center items-center text-xl">
    <div className="w-full h-full flex items-center justify-center">
      <ReloadOutlined className="text-3xl text-nft-gray-3 dark:text-nft-gray-1 transition-all duration-500" />
    </div>
  </div>
);

export default NoPost;
