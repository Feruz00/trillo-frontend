/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/media-has-caption */
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Triangle } from 'react-loader-spinner';

const MessagePost = ({ id, t, setOpenPost, setOpenPostId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      await axios
        .get(`${process.env.SERVER}/posts/getpost/${id}`, {
          withCredentials: true,
        })

        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          setError(true);
        });
    };
    getData();
    setLoading(false);
  }, [id]);
  const router = useRouter();
  return (
    <div
      className="w-[15vw] h-[15vw] md:w-[25vw] md:h-[25vw]  flex justify-center items-center
    cursor-pointer
    "
      onClick={() => {
        data
        && router.push(`post/${data._id}`);

        // setOpenPostId(data);
        // setOpenPost(true);
      }}
    >

      {
        loading && (
        <Triangle
          height="50"
          width="50"
          color="#DA18A3"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible
        />
        )
      }
      {
        !loading && (!data || error)
          ? <p>{t('share.noPost')}</p>
          : data && (
            data.files[0].type.startsWith('image')
              ? <img src={`${process.env.SERVER}/${data.files[0].path}`} className="w-full h-full object-contain" />
              : <video src={`${process.env.SERVER}/${data.files[0].path}`} className="w-full h-full object-contain" />

          )
      }

    </div>
  );
};

export default MessagePost;
