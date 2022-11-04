/* eslint-disable react/button-has-type */
import { CloseOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';

const ModalPost = ({ children, setClose }) => {
  const modalRef = useRef(null);
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setClose(false);
    }
  };
  return (
    <div className="flexCenter fixed inset-0 z-10 bg-overlay-black animated fadeIn" onClick={handleClickOutside}>
      <div
        className="w-9/12 md:w-11/12 minlg:w-2/4 dark:bg-nft-dark bg-white flex flex-col rounded-lg

      "
        ref={modalRef}
      >
        <div className="flex justify-end mt-3 mr-4 minlg:mt-6 minlg:mr-6">
          <CloseOutlined
            className="cursor-pointer"
            onClick={() => setClose(false)}
          />
        </div>
        <div className="sm:px-1 border-t dark:border-nft-black-3 border-nft-gray-1 ">
          {children}
        </div>

      </div>
    </div>
  );
};

export default ModalPost;
