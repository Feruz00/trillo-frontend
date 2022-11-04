/* eslint-disable react/button-has-type */
import { CloseOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';

const Modal = ({ children, setClose, header, footer, onClick, disabled }) => {
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
        <div className="p-8 sm:px-4 border-t dark:border-nft-black-3 border-nft-gray-1 h-[50vh] overflow-y-auto">
          {children}
        </div>
        {
          footer && (
          <div className="p-5 sm:px-4 border-t
            flex flex-row items-start justify-end
           dark:border-nft-black-3 border-nft-gray-1 overflow-y-auto"
          >
            <button
              className="bg-blue-600 cursor-pointer
              dark:bg-blue-500 transition-all duration-500 px-4 py-2 font-semibold text-white
              disabled:bg-blue-300 disabled:cursor-not-allowed
              dark:disabled:bg-blue-400
              "
              onClick={onClick}
              disabled={disabled}
            >
              Submit
            </button>

          </div>
          )
        }
      </div>
    </div>
  );
};

export default Modal;
