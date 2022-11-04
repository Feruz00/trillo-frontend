/* eslint-disable react/button-has-type */
import { CloseOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';

const PostModal = ({ children, setClose, header }) => {
  const modalRef = useRef(null);
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setClose(false);
    }
  };
  return (
    <div className="flexCenter fixed inset-0 z-10 bg-overlay-black animated fadeIn" onClick={handleClickOutside}>
      <div className="w-2/5 md:w-11/12 minlg:w-2/4 dark:bg-nft-dark bg-white flex flex-col rounded-lg" ref={modalRef}>
        <div className="flex justify-end mt-3 mr-4 minlg:mt-6 minlg:mr-6">
          <CloseOutlined
            className="cursor-pointer"
            onClick={() => setClose(false)}
          />
        </div>
        <div className="flexCenter w-full text-center p-4">
          <h2 className="dark:text-white text-nft-black-1 font-normal text-2xl md:text-xl sm:text-lg">{header}</h2>

        </div>
        {children}
      </div>
    </div>
  );
};

export default PostModal;
