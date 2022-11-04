/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable jsx-a11y/media-has-caption */
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { InfinitySpin, Triangle } from 'react-loader-spinner';

const UserPosts = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const getData = async () => {
    setLoading(data.length === 0);
    try {
      const res = await axios
        .get(
          `${process.env.SERVER}/posts/getpostbyuser/${username}`,
          { withCredentials: true, params: { p: pageNumber } },
        );
      if (res.data.length === 0) setHasMore(false);
      setData((prev) => [...prev, ...res.data]);
      setPageNumber((p) => p + 1);
    } catch (error) {
      setErrorMsg(true);
      console.error(error);
    }
    setLoading(false);
  };
  const router = useRouter();
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="w-full p-5 ">
      {
            loading ? (
              <div className="h-40 w-full flex items-center justify-center">
                <Triangle
                  height="40"
                  width="40"
                  color="#DA18A3"
                  ariaLabel="triangle-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible
                />

              </div>
            )
              : (
                <InfiniteScroll
                  hasMore={hasMore}
                  next={getData}
                  loader={(
                    <div className="h-40 w-full flex items-center justify-center">
                      <InfinitySpin
                        width="100"
                        color="#DA18A3"
                      />
                    </div>
              )}

                  dataLength={data.length}
                >
                  <div className="w-full flex flex-row flex-wrap gap-2 justify-start">
                    {
                data.map((i, index) => (
                  <div
                    key={index}
                    className="h-[30vw] w-[30vw] relative border rounded cursor-pointer overflow-hidden
                    dark:bg-nft-black-2
                    before:content-['*'] before:w-full before:h-full before:absolute
                    before:inset-0 before:bg-black before:z-[5] before:opacity-50
                    dark:before:bg-nft-gray-3
                    before:hidden hover:before:flex
                    "
                    onClick={
                        () => {
                          router.push(`../post/${i._id}`);
                        }
                    }
                  >
                    {/* <div className="hidden hover:flex w-full h-full bg-black opacity-10 absolute inse/t-0 blur-sm z-[5]" /> */}
                    {
                        i.files[0].type.startsWith('image')
                          ? <img src={`${process.env.SERVER}/${i.files[0].path}`} className="w-full h-full object-contain" />
                          : <video src={`${process.env.SERVER}/${i.files[0].path}`} className="w-full h-full object-contain" />

                    }
                  </div>
                ))
            }
                  </div>
                </InfiniteScroll>

              )
        }

    </div>
  );
};

export default UserPosts;
