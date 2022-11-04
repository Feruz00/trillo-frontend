/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable no-unused-expressions */
import { ArrowLeftOutlined, ArrowRightOutlined, CalendarOutlined, CloseOutlined, CommentOutlined, HeartFilled, HeartOutlined, LoadingOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import React, { useContext, useRef, useState } from 'react';
import { FaEraser, FaTelegramPlane } from 'react-icons/fa';
import calculateTime from '../calculateTime';
import { useSocket } from '../context/socket';
import Modal from './Modal';
import Alert from './Alert';
import Comments from './Comments';
import { AuthContext } from '../context/authContext';
import SharePost from './SharePost';
import PostModal from './PostModal';

const Post = ({ isFull, item, isModal, t, isHome, setData }) => {
  const { user } = useContext(AuthContext);
  const [myLikes, setMyLikes] = useState(item.likes);
  const [isOpen, setIsOpen] = useState(false);
  const socket = useSocket();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const [ansUsers, setAnsUsers] = useState([]);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [myComments, setMyComments] = useState(item.comments);
  const [imageLoading, setImageLoading] = useState(item.files);
  const [share, setShare] = useState(false);
  const [shareText, setShareText] = useState('');
  const [shareLoading, setShareLoading] = useState(false);

  const [commentSelected, setCommentSelected] = useState([]);
  const [isCommentSelected, setIsCommentSelected] = useState(false);
  const [commentDeleteLoading, setCommentDeleteLoading] = useState(false);
  const imageLoaded = (id) => {
    setImageLoading((prev) => prev.filter((t) => t.path !== id));
  };

  const [currentItem, setCurrentItem] = useState(0);
  const commentSubmit = async () => {
    setCommentLoading(true);
    setCommentError(false);
    try {
      const result = await axios({
        method: 'POST',
        url: `${process.env.SERVER}/posts/post/${item._id}`,
        data: {
          text: comment,
          ansUsers,
        },
        withCredentials: true,
      });
      // console.log(result);
      // const ansUser = ansUsers.length === 0 ? [] : ansUsers;
      setMyComments(result.data);
      setCommentLoading(false);
      const users = [...ansUsers.map((i) => i._id), item.user._id];
      // console.log(users, ansUsers, item.user);
      socket.emit('newnotification', { users });
    } catch (error) {
      // console.error(error);
      setCommentLoading(false);
      setCommentError(true);
    }
    setComment('');
    setAnsUsers([]);
  };
  const commentDelete = async () => {
    setCommentDeleteLoading(true);
    await axios({
      method: 'DELETE',
      url: `${process.env.SERVER}/posts/delete/${item._id}`,
      data: {
        comments: commentSelected,
      },
      withCredentials: true,
    })
      .then((res) => {
        setMyComments(res.data);
      }).catch((err) => {
        console.log(err);
        alert('Something wrong went!');
        setIsCommentSelected(false);
        setCommentDeleteLoading(false);
        setCommentSelected([]);
      });
    setIsCommentSelected(false);
    setCommentDeleteLoading(false);
    setCommentSelected([]);
  };
  const deletePost = async () => {
    await axios({
      method: 'DELETE',
      url: `${process.env.SERVER}/posts/post`,
      data: {
        _id: item._id,
      },
      withCredentials: true,
    })
      .then(() => {
        if (isHome) setData((prev) => prev.filter((i) => i._id !== item._id));
        else Router.back();
      })
      .catch((err) => {
        console.log(err);
        alert('error boldy');
      });
  };
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const addOrRemoveLike = async (postId) => {
    const isLike = myLikes.filter((like) => like.user._id === user._id).length > 0;
    try {
      await axios({
        method: 'PUT',
        url: `${process.env.SERVER}/posts/${isLike ? 'unliked' : 'liked'}/${postId}`,
        withCredentials: true,
      });
      if (!isLike) {
        const users = [item.user._id];
        if (item.user._id !== user._id) socket.emit('newnotification', { users });
      }
      isLike ? setMyLikes((prev) => prev.filter((p) => p.user._id !== user._id)) : setMyLikes((prev) => ([{ user }, ...prev]));
    } catch (error) {
      console.error(error);
    }
  };

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = current.offsetWidth ? current.offsetWidth : 100;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
      setCurrentItem((prev) => prev - 1);
    } else {
      current.scrollLeft += scrollAmount;
      setCurrentItem((prev) => prev + 1);
    }
  };
  const initialComments = (comments) => {
    const arr = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < comments.length; i++) {
      arr.push(comments[i]);
      if (i === 1 && !isFull) break;
    }
    return arr;
  };
  return (
    <>
      <div className={`flex-1 w-[60%] gap-3 shadow px-3 py-2 dark:drop-shadow dark:bg-nft-black-3 
    md:w-full ${isModal ? 'flex-row' : 'flex-col'} flex items-center justify-start`}
      >
        {/* Top */}
        <div className=" flex w-full flex-row items-center gap-3 ">
          <div className="border overflow-hidden rounded-full w-14 h-14 sm:w-10 sm:h-10
        flex items-center justify-center bg-nft-gray-2 dark:bg-nft-gray-3"
          >
            {
            item.user.logo.length > 0
              ? <img src={`${process.env.SERVER}/${item.user.logo}`} className="w-full h-full object-cover" />
              : <UserOutlined className="text-2xl sm:text-xl" />
          }
          </div>
          <div className="flex-1 flex flex-row items-center justify-between gap-2">
            <div className="flex-1 flex flex-col justify-start ">
              <Link href={`user/${item.user.username}`}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className="text-blue-600 dark:text-blue-500 font-medium"> {item.user.username} </a>
              </Link>
              <div className="w-10/12">
                <h1 className="text-xs font-thin">
                  {item.location}
                </h1>
                <h1 className="text-xs font-thin flex items-center gap-1">

                  <span className="font-medium">{t('home.posted')}: </span>
                  <CalendarOutlined className="transition-all duration-500" />
                  {calculateTime(item.date, t)}
                </h1>

              </div>

            </div>
            {
            user._id === item.user._id && (
            <div>
              <FaEraser
                className="transition-all duration-500 text-xl cursor-pointer hover:text-nft-black-1 dark:hover:text-nft-gray-1"

                onClick={deletePost}
              />

              {/* <DeleteOutlined className="transition-all duration-500 text-xl cursor-pointer hover:text-nft-black-1 dark:hover:text-nft-gray-1" /> */}
            </div>
            )
          }

          </div>
        </div>

        {/* Bottom */}
        <div className="flex-1 w-full flex flex-col gap-1">
          {/* FIles */}
          <div
            className="h-[25vw] md:h-[40vw] sm:h-[50vw] xs:h-[60vw] w-full border bg-nft-gray-1 dark:bg-nft-black-1
        relative snap-mandatory select-none
        "
            ref={parentRef}
          >
            {
            currentItem !== 0 && (
            <ArrowLeftOutlined
              className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2
          bg-nft-black-1 text-white text-xl flex justify-center items-center p-1 rounded-full cursor-pointer
          hover:text-2xl transition-all duration-500
          dark:bg-nft-gray-3 z-[5]
          "
              onClick={() => handleScroll('left')}
            />
            )
          }
            {
            currentItem < item.files.length - 1 && (
            <ArrowRightOutlined
              className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2
          bg-nft-black-1 text-white text-xl flex justify-center items-center p-1 rounded-full cursor-pointer
          hover:text-2xl transition-all duration-500
          dark:bg-nft-gray-3 z-[5]
          "
              onClick={() => handleScroll('right')}
            />
            )
          }

            <div
              className="h-full max-h-full w-full overflow-x-scroll flex flex-row select-none no-scrollbar"
              ref={scrollRef}
            >
              {item.files.map((i, item) => (

                i.type.startsWith('image')
                  ? (
                    <img
                      key={item}
                      onLoad={() => imageLoaded(i.path)}
                      src={`${process.env.SERVER}/${i.path}`}
                      className={` object-contain min-w-full h-full max-h-full
                                ${imageLoading.filter((t) => t.path === i.path).length > 0 && 'hidden'}
                              `}
                      alt="image"
                    />
                  )

                  : (

                    <video
                      key={item}
                      src={`${process.env.SERVER}/${i.path}`}
                      className="object-contain min-w-full min-h-full max-h-full"
                      controls
                      controlsList="nodownload"
                    >
                      <source src={`${process.env.SERVER}/${i.path}`} type="video/mp4" />
                    </video>
                  )

              ))}

            </div>
          </div>
          {/* Statistics */}
          <div className="flex flex-col gap-2">
            <div className="flex w-full flex-row justify-between items-center">
              <div className=" flex  flex-col gap-3 transition-all duration-500 items-center justify-start relative">
                <div className="flex flex-row items-center gap-5">
                  {
            myLikes.filter((like) => like.user._id === user._id).length > 0
              ? (
                <HeartFilled
                  className={`text-2xl text-red-600 dark:text-red-500 ${user.id === item.user._id && 'cursor-pointer'}`}
                  onClick={() => addOrRemoveLike(item._id)}
                />
              )
              : (
                <HeartOutlined
                  className="text-2xl"
                  onClick={() => addOrRemoveLike(item._id)}
                />
              )
          }
                  {
              isHome && (
              <Link href={`post/${item._id}`}>
                <a>
                  <CommentOutlined
                    className="text-2xl"
                    // onClick={() => setOpenModal(true)}
                  />
                </a>
              </Link>
              )
            }

                  <FaTelegramPlane
                    className="text-2xl cursor-pointer"

                    onClick={() => setShare(true)}
                  />
                </div>
                <div>
                  {
            myLikes.length > 0 && (
            <div
              className={`text-sm font-medium ${user._id === item.user._id && 'cursor-pointer '} sm:text-xs`}
              onClick={() => { setIsOpen(user._id === item.user._id); }}
            >
              {numberWithCommas(myLikes.length).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {t('home.likes')}
            </div>
            )
          }
                </div>

              </div>

            </div>
            <div className="flex flex-row gap-2 flex-wrap  ">
              {item.tags.map((i) => (
                <div
                  key={i}
                  className="flex flex-row items-center
               bg-blue-500 px-1 text-white dark:bg-blue-600 transition-all duration-500"
                >
                  <p className="text-sm sm:text-xs ">#{i}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-row  ">
              <p className={`text-sm ${isHome ? 'truncate whitespace-nowrap  overflow-hidden' : ' '} sm:text-xs`}>{item.description}</p>
            </div>
          </div>

          <div className="mt-2 flex flex-col w-full">
            <h1 className="text-base xs:text-sm transition-all duration-500 font-medium">{t('home.writeComment')}:</h1>
            <div className="flex-1 flex border overflow-hidden rounded-lg flex-row items-center justify-center  outline-none ">
              <textarea
                className="flex-1 px-3 py-2
              dark:bg-transparent rounded-2xl
               resize-none w-full h-full outline-none
               text-sm xs:text-xs"
                rows={1}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('home.writeComment')}
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    commentSubmit();
                  }
                }}
              />
              <button
                className="px-3 bg-blue-700 h-full text-sm py-2
            text-white dark:bg-blue-600 transition-all duration-500
            disabled:bg-blue-400 disabled:cursor-not-allowed
            dark:disabled:bg-blue-500
            "
                onClick={() => commentSubmit()}
                disabled={comment.length === 0 || commentLoading}
              >
                {t('home.addComment')}
              </button>
            </div>

          </div>
          {
          ansUsers.length > 0 && (
            <div className="w-full flex flex-row items-center flex-wrap">
              <h1 className="sm:text-sm font-medium mr-2">{t('home.answered')}:</h1>
              {
                ansUsers.map((i) => (
                  <div
                    key={i._id}
                    className="flex flex-row items-center justify-between
                   bg-green-600 pl-2 pr-1  transition-all duration-400 mr-2 dark:bg-green-700"
                  >
                    <Link href={`user/${i.username}`}>
                      <a className=" text-sm font-medium text-white">
                        {i.username}

                      </a>
                    </Link>
                    <CloseOutlined
                      className="ml-2 text-sm text-white hover:font-medium"

                      onClick={() => setAnsUsers((prev) => prev.filter((t) => t._id !== i._id))}
                    />
                  </div>

                ))
              }
            </div>
          )
        }
          {
          user._id === item.user._id && isFull && (
          <div className="flex-1 w-full py-2
            flex flex-row items-center justify-between px-2"
          >
            <p
              className="px-2 py-1 cursor-pointer sm:text-sm font-semibold bg-blue-700 bg:text-blue-600
            transition-all duration-500
            dark:bg-blue-600 dark:hover:bg-blue-500 text-white
            "
              onClick={() => {
                setIsCommentSelected((prev) => !prev);
              }}
            >Select comments
            </p>
            <button
              className="px-2 py-1 cursor-pointer sm:text-sm font-semibold bg-nft-black-1 hover:bg-nft-gray-3
            transition-all duration-500
            dark:bg-nft-gray-3 dark:hover:bg-nft-gray-2 text-white
            disabled:cursor-not-allowed
            disabled:bg-nft-gray-3
            dark:disabled:bg-nft-gray-2
            flex items-center gap-2
            "
              disabled={!isCommentSelected || commentSelected.length === 0 || commentDeleteLoading}
              onClick={commentDelete}
            >Delete comments
              {
                commentDeleteLoading
              && <LoadingOutlined />
              }
            </button>

          </div>
          )
        }

          {
          myComments.length > 0 && (
            <div className="flex-1 w-full dark:bg-nft-black-2
            dark:rounded flex flex-col items-center justify-evenly gap-1 px-2"
            >
              <Comments
                comments={initialComments(myComments)}
                setAnsUsers={setAnsUsers}
                t={t}
                isCommentSelected={isCommentSelected}
                commentSelected={commentSelected}
                setCommentSelected={setCommentSelected}
              />
            </div>

          )
        }

        </div>

      </div>
      {
        isOpen && (
        <Modal

          setClose={setIsOpen}
          header={t('home.hasLikes')}
        >
          {
            myLikes.map((i, index) => (
              <div
                key={index}
                className={` ${index !== myLikes.length - 1 && 'mb-2'} flex flex-row justify-center items-center cursor-pointer`}
              >
                <div className="w-full flex-1 p-2 shadow dark:bg-nft-black-2 flex flex-row items-center justify-between">

                  <div className="flex flex-row gap-5 flex-1 items-center">
                    <div className="h-10 w-10 rounded-full flex justify-center items-center bg-nft-gray-1 dark:bg-nft-black-1 overflow-hidden">
                      {
                        i.user.logo.length > 0
                          ? (
                            <img
                              src={`${process.env.SERVER}/${i.user.logo}`}
                              className="w-full h-full object-cover"
                            />
                          )
                          : <UserOutlined />
                        }

                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <Link href={`/user/${i.user.username}`}>
                        <a>{i.user.username}</a>
                      </Link>
                      {/* <p>{i.user.username}</p> */}
                      {((i.user.firstName.length > 0) || (i.user.lastName.length > 0))
                        && (
                        <h1
                          className="font-medium text-sm"
                        >{`${i.user.firstName} ${i.user.lastName}`}
                        </h1>
                        )}
                    </div>
                  </div>

                </div>
              </div>
            ))
        }
        </Modal>
        )
      }
      {
        share && (
          <PostModal
            setClose={setShare}
            header={t('share.share')}

          >
            <SharePost
              shareText={shareText}
              setShareText={setShareText}
              setShareLoading={setShareLoading}
              t={t}
              postId={item._id}
              setShare={setShare}
            />
          </PostModal>
        )
      }
      {
        commentError && <Alert t={t} />
      }
    </>
  );
};

export default Post;
