import React from 'react';
// import Modal from './ModalPost';

const PostView = ({ data }) => {
  console.log(data);
  return (

    <div className=" flex flex-col  w-full
    h-[80vw]
    "
    >
      <div>
        User info
      </div>
      <div className="flex-1 flex flex-row">
        <div className="flex-1 bg-nft-black-1 w-full">
          Alma
        </div>
        <div className="flex-1 bg-nft-gray-2 w-full" />

      </div>

    </div>

  );
};

export default PostView;
