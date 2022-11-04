/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { CheckOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useContext } from 'react';
import calculateTime from '../calculateTime';
import { AuthContext } from '../context/authContext';

const Comments = ({ t, comments, setAnsUsers, isCommentSelected, commentSelected, setCommentSelected }) => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {
            comments.length === 0
              ? (
                <h1>
                  {t('home.This post dont have any comment')}
                </h1>
              )
              : comments.map((i, index) => (
                <div
                  key={index}
                  className={`flex flex-row items-center w-full gap-1  
                ${index !== comments.length - 1 && 'dark:border-b'} pb-1`}
                >
                  {
                    isCommentSelected && (
                    <div
                      className="bg-nft-gray-1 w-6 h-6 rounded-full flex justify-center items-center
                    dark:bg-nft-black-1
                    cursor-pointer
                    "
                      onClick={() => {
                        commentSelected.filter((k) => k === i._id).length > 0
                          ? setCommentSelected(((prev) => prev.filter((k) => k !== i._id)))
                          : setCommentSelected((prev) => [...prev, i._id]);
                      }}
                    >
                      {
                        commentSelected.filter((k) => k === i._id).length > 0
                          ? <CheckOutlined />
                          : <div className="w-4 h-4 rounded-full bg-white dark:bg-nft-gray-3" />

                      }
                    </div>
                    )
                  }
                  {/* Avatar */}
                  <div className="h-10 w-10 border rounded-full overflow-hidden flex justify-center items-center">
                    {
                        i.user.logo.length > 0
                          ? <img src={`${process.env.SERVER}/${i.user.logo}`} className="w-full h-full object-cover" />
                          : <UserOutlined className="text-lg -translate-y-1" />
                    }
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-row gap-4 items-center">
                      <Link href={`../user/${i.user.username}`}>
                        <a className="sm:text-sm md:text-base font-medium">{i.user.username}</a>
                      </Link>
                      <p className="font-thin text-xs">{calculateTime(i.date, t)}</p>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="text-sm flex-1 flex-row flex gap-1 w-full ">
                        <p className="sm:text-xs">
                          {i.ansUser.length > 0 && i.ansUser.map((j) => (
                            <Link key={j._id} href={`user/${j.username}`}>
                              <a className="text-blue-600 dark:text-blue-500 transition-all duration-500">@{j.username}</a>
                            </Link>
                          ))}
                          {' '}
                          {i.text}
                        </p>
                      </div>
                      {
                        i.user._id !== user._id && (
                        <p
                          className="text-sm italic cursor-pointer text-blue-700 dark:text-blue-500 transition-all duration-500 font-medium"
                          onClick={() => setAnsUsers((prev) => (prev.filter((k) => k?._id === i.user._id).length === 0 ? [...prev, i.user] : prev))}
                        >
                          {
                            t('home.reply')
                        }
                        </p>
                        )
                    }

                    </div>
                  </div>
                  {/* Texts */}
                </div>
              ))
        }
    </>
  );
};

export default Comments;
