import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import Title from './Title';

const LoadingPage = ({ t }) => (
  <>
    <Title title={`${t('page.loadingPage')} | Trillo`} />
    <div className="min-h-screen h-full w-full flex justify-center items-center">
      <LoadingOutlined className="text-2xl" />
    </div>

  </>
);

export default LoadingPage;
