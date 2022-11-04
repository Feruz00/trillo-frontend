/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */
import { CheckOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
// import { forEach } from 'lodash';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useConversation } from '../context/conversation';

const SharePost = ({ t, shareText, setShareText, postId, setShare }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [users, setUsers] = useState([]);
  const { sendMessage } = useConversation();
  const { setConversations, setChat } = useConversation();

  const { user } = useContext(AuthContext);
  async function forcreate(items) {
    await axios({
      method: 'POST',
      data: {
        recipients: items,
      },
      withCredentials: true,
      url: `${process.env.SERVER}/conversations/findOrCreate`,
    }).then(async (res) => {
      const { ans, qty } = res.data;
      // console.log(ans, qty);
      if (!qty) {
        setChat((prev) => [{ _id: ans._id, messages: [] }, ...prev]);
        setConversations((prev) => [ans, ...prev]);
      }
      // setCurrentConversation(ans);

      const { recipients, ...other } = ans;
      await sendMessage(
        items.map((r) => r._id),
        { recipients: [...items, user], ...other },
        { type: 'post', text: postId },
      );

      // setCurrentConversation(null);
    }).catch(async (error) => {
      console.log(error);
      if (error?.response?.data?.message) alert(error.response.data.message);
      else alert('Something wrong went! Try again!');
    });
  }
  const handleSubmit = async () => {
    // console.log(users);
    for (let i = 0; i < users.length; i++) {
      await forcreate([users[i]]);
    }
    setShare(false);
  };
  const handleChange = async (e) => {
    setShareText(e.target.value);

    let cancel;
    setLoading(true);
    setErr(null);
    setData([]);

    try {
      if (e.target.value === '') { setLoading(false); return; }
      cancel && cancel();
      const { CancelToken } = axios;
      const res = await axios({
        method: 'POST',
        url: `${process.env.SERVER}/find`,
        data: {
          tapmaly: e.target.value,
        },
        withCredentials: true,
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });
      setData(res.data);
      setData((prev) => prev.map((i) => ({ username: i.username, logo: i.logo, firstName: i.firstName, lastName: i.lastName, _id: i._id })));
    } catch (error) {
      if (error?.response?.data?.message) setErr(error.response.data.message);
      else setErr('Network error');
    }
    setLoading(false);
  };
  return (
    <div className="w-full flex flex-col h-[60vh] py-1">
      <div className="border-b flex flex-row flex-wrap px-2 pb-2">
        {
          users.map((i, index) => (
            <Link key={index} href={`user/${i.username}`}>
              <a className="text-sm mr-1 flex flex-row items-center gap-2 border rounded-full px-2
              hover:bg-blue-400 dark:hover:bg-blue-500 transition-all duration-500
              hover:text-white
              "
              >@{i.username}

              </a>

            </Link>
          ))
        }
        <input
          onChange={handleChange}
          value={shareText}
          className="border-none outline-none bg-transparent md:text-sm text-base"
          placeholder="Enter username"
        />
      </div>
      <div className="w-full flex flex-col flex-1 overflow-y-auto gap-1">
        {
          data.length > 0
            && data.map((i, index) => (
              <div
                key={index}
                className="flex flex-row justify-center items-center cursor-pointer "
                onClick={() => {
                  users.filter((f) => f._id === i._id).length > 0
                    ? setUsers((prev) => prev.filter((f) => f._id !== i._id))
                    : setUsers((prev) => [...prev, i]);
                  setShareText('');
                }}
              >

                <div className="w-full flex-1 p-2 shadow dark:bg-nft-black-2 flex flex-row items-center justify-between">
                  <div className="h-6 w-6 cursor-pointer rounded-full bg-[#ccc] dark:bg-nft-gray-3 flex justify-center items-center mr-2">
                    {users.filter((f) => f._id === i._id).length > 0
                      ? (
                        <CheckOutlined
                          className="text-white dark:text-blue-400 "

                        />
                      )
                      : (
                        <div
                          className="h-4 w-4 rounded-full bg-white dark:bg-nft-black-1"

                        />
                      )}

                  </div>
                  <div className="flex flex-row gap-5 flex-1 items-center">
                    <div className="h-10 w-10 rounded-full flex justify-center items-center bg-nft-gray-1 dark:bg-nft-black-1 overflow-hidden">
                      {
i.logo.length > 0
  ? <img src={`${process.env.SERVER}/${i.logo}`} className="w-full h-full object-cover" />
  : <UserOutlined />
}

                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <p>{i.username}</p>
                      {((i.firstName.length > 0) || (i.lastName.length > 0))
&& <h1 className="font-medium text-sm">{`${i.firstName} ${i.lastName}`}</h1>}
                    </div>
                  </div>

                </div>
              </div>

            ))

      }
      </div>
      <div className="w-full flex p-4 border-t items-center justify-end">
        <button
          className="px-6 py-2 bg-blue-700 dark:bg-blue-600 transition-all duration-500 text-white font-semibold
        rounded hover:bg-blue-600 dark:hover:bg-blue-500
        disabled:bg-blue-300 disabled:cursor-not-allowed
        dark:disabled:bg-blue-400
        "
          onClick={handleSubmit}
          disabled={users.length === 0 || loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SharePost;
