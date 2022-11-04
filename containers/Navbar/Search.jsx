/* eslint-disable no-unused-expressions */

import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SearchOutlined, CloseOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { MdErrorOutline } from 'react-icons/md';

const SearchUsers = ({ t }) => {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    let cancel;
    if (text.length === 0) {
      setData([]);
      return;
    }
    // console.log(data);
    const handleChange = async () => {
      const ENDPOINT = `${process.env.SERVER}/find/`;
      setLoading(true);
      setError('');

      try {
        // eslint-disable-next-line no-unused-expressions
        cancel && cancel();
        const { CancelToken } = axios;
        const res = await axios({
          method: 'POST',
          url: ENDPOINT,
          data: {
            tapmaly: text,
          },
          withCredentials: true,
          cancelToken: new CancelToken((canceler) => {
            cancel = canceler;
          }),
        });
        setData(res.data);
      } catch (err) {
        if (err.response) setError(err.response.data.message);
        else setError('Please try again! We have server error');
      }
      setLoading(false);
    };
    handleChange();
  }, [text]);
  useEffect(() => {
    setIsOpen(false);
  }, [router]);
  return (
    <div className=" flex-1 relative flex w-full border  rounded bg-nft-gray-1 dark:bg-black justify-center items-center">
      <div className="flex flex-row w-full
        px-2 py-1  items-center bg-transparent

        "
      >
        <SearchOutlined className={`${text.length > 0 ? 'hidden' : 'mr-2'}`} />
        <input
          type="text"
          className="outline-none h-full text-base md:text-sm sm:text-xs flex-1 bg-nft-gray-1 dark:bg-black"
          placeholder={t('direct.searchUsers')}
          autoComplete="off"
          onChange={(e) => setText(e.target.value)}
          value={text}
          onFocus={() => setIsOpen(true)}
          onBlur={() => { data.length === 0 && setIsOpen(false); }}

        />
        <CloseOutlined className={`${(loading || !isOpen) && 'hidden'} cursor-pointer`} onClick={() => { setIsOpen(false); setText(''); }} />
        <LoadingOutlined className={`${!loading && 'hidden'}`} />

      </div>
      {
        isOpen && (
        <div className=" shadow px-5 bg-white dark:bg-nft-black-1
      dark:shadow-xl p-2
      absolute top-plus h-[50vh] overflow-y-auto z-20 w-full flex flex-col gap-2  justify-start items-start"
        >
          {
          loading && (
          <div className="flex h-full w-full justify-center items-center">
            <LoadingOutlined className="text-xl" />
          </div>
          )
        }
          {
          error && (
          <div className="flex h-full w-full justify-center items-center">
            <MdErrorOutline className="text-xl" />
          </div>
          )
        }
          {
          data.length === 0 && (
          <div className="flex h-full w-full justify-center items-center">
            <p className="text-xl md:text-base xs:test-sm">{t('direct.notFound')}</p>
          </div>
          )
        }
          {
          data.length > 0
            && data.map((i, index) => (
              <div key={index} className="w-full p-2 shadow dark:bg-nft-black-2 flex flex-row items-center justify-between">
                <div className="flex flex-row gap-5 flex-1 items-center">
                  <div className="h-10 w-10 rounded-full flex justify-center items-center bg-nft-gray-1 dark:bg-nft-black-1 overflow-hidden">
                    {
              i.logo.length > 0
                ? <img src={`${process.env.SERVER}/${i.logo}`} className="w-full h-full object-cover" />
                : <UserOutlined />
            }

                  </div>
                  <div className="flex flex-col items-start justify-between">
                    <Link href={`/user/${i.username}`}><a>{i.username}</a></Link>
                    {((i.firstName.length > 0) || (i.lastName.length > 0))
              && <h1 className="font-medium text-sm">{`${i.firstName} ${i.lastName}`}</h1>}
                  </div>
                </div>

              </div>
            ))

      }
        </div>
        )
      }
    </div>

  );
};

export default SearchUsers;
