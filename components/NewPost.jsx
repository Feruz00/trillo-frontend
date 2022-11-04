import { CloseOutlined, FileImageOutlined, LoadingOutlined, TagOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState, useMemo, useCallback, useEffect, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdAddLocation } from 'react-icons/md';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/authContext';
import { useSocket } from '../context/socket';

const Input = ({ Icon, text, setText, placeholder, invalidText, type, className }) => {
  const [tp, setTp] = useState(type);
  const [hover, setHover] = useState(false);
  return (
    <div className="flex flex-col w-full">
      <div className={`px-2 mt-2 border border-border-blue-600 w-full flex flex-row items-center
                    rounded-lg justify-center text-base transition duration-700 ${hover && 'border-2'} hover:border-blue-700 `}
      >
        <Icon className="mr-2 text-lg" />
        <input
          placeholder={placeholder}
          className={`${className} w-full outline-none py-2 h-full dark:bg-transparent `}
          value={text}
          type={tp}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          onChange={(e) => setText(e.target.value)}
        />

      </div>
      {
          invalidText.length > 0
        && <p className="text-sm ml-5 text-red-600">*{invalidText}</p>
        }
    </div>

  );
};
const AddPost = ({ t }) => {
  const { user } = useContext(AuthContext);
  const socket = useSocket();
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  //   const [err, setErr] = useState()
  const [action, setAction] = useState({
    error: null,
    succcess: null,
    loading: false,
  });

  const [fileUrl, setFileUrl] = useState(null);
  const onDrop = useCallback(async (acceptedFiles) => {
    setFileUrl((prev) => ([...(prev || []),
      ...acceptedFiles.map((prev) => Object.assign(prev, {
        preview: URL.createObjectURL(prev) }))]));
  });

  useEffect(() => {
    setTag((prev) => _.toLower(prev));
    if (tag[tag.length - 1] === ' ') {
      setTags((prev) => (prev.filter((i) => i === tag).length > 0 ? prev : [...prev, tag]));
      setTag('');
    }
  }, [tag]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
    },
    // maxSize: '50mb',
  });
  const fileStyle = useMemo(() => (
    `dark:bg-nft-black-1 bg-white border dark:border-white 
    border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
    ${isDragActive && 'border-file-active'}
    ${isDragAccept && 'border-file-accept'}
    ${isDragReject && 'border-file-reject'}
    
    `
  ), [isDragAccept, isDragActive, isDragReject]);

  async function handleSubmit() {
    setAction({ loading: false, error: null, succcess: null });
    if (fileUrl === null) {
      setAction((prev) => ({ ...prev, error: t('settings.uploadPhotoError') }));
      return false;
    }
    if (location.length === 0) {
      setAction((prev) => ({ ...prev, error: t('newPost.locationErr') }));
      return;
    }
    // setAction((prev) => ({ ...prev, error: t('setting.uploadPhotoError') }));
    const data = new FormData();
    fileUrl.forEach((element) => {
      data.append('files', element);
    });
    data.append('location', location);
    data.append('description', description);
    // data.append("part", part)
    tags.forEach((element) => {
      data.append('tags', element);
    });
    console.log(data);
    setAction((prev) => ({ ...prev, loading: true }));

    await axios({
      method: 'POST',
      url: `${process.env.SERVER}/posts`,
      data,
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },

    }).then((res) => {
      const userId = user._id;
      socket.emit('newpost', { userId });
      setAction((prev) => ({ ...prev, success: true }));
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }).catch((err) => {
      if (err.response) setAction((prev) => ({ ...prev, error: err.response.data.message }));
      else setAction((prev) => ({ ...prev, error: 'Something wrong went. Try again!' }));
    }).finally(() => {
      setAction((prev) => ({ ...prev, loading: false }));
    });
  }
  return (
    <div className="flex w-full justify-center sm:px-4 p-12 ">
      <div className="w-3/5 md:w-full">
        <div className="">
          <p className=" dark:text-white text-nft-black-1 font-semibold text-xl">
            {t('newPost.createPost')}
            {
                action.error
            && (
            <span className="ml-4 font-semibold text-red-500 ">
              {action.error}
            </span>
            )
          }
            {
            action.success
            && (
            <span className="ml-4 font-semibold text-green-700 dark:text-green-500 ">
              {t('newPost.success')}
            </span>
            )
          }
          </p>

          <div className="mt-4 flex flex-col justify-start">
            <h1 className=" transition-all duration-500 font-medium">{t('newPost.addLocation')}</h1>
            <Input
              Icon={MdAddLocation}
              placeholder={t('newPost.enterLocation')}
              text={location}
              setText={setLocation}
              invalidText=""
            />
          </div>

          <div className="mt-4 flex flex-col ">
            <h1 className=" transition-all duration-500 font-medium">
              {t('newPost.browse')}
            </h1>

            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <div className="my-12 w-full flex justify-center">
                  <FileImageOutlined className="text-5xl" />
                </div>
                <p className=" dark:text-white text-nft-black-1 font-semibold text-sm">

                  {t('settings.drag')}
                </p>
                <p className=" dark:text-white text-nft-black-1 font-semibold text-sm
                mt-2
                "
                >
                  {t('settings.browse')}
                </p>

              </div>
            </div>

            {
              fileUrl && (
              <aside className="mt-2 flex flex-row justify-between">
                <div className="flex flex-row transition-all duration-500">
                  <h1 className="font-medium">{t('newPost.selected')}:</h1>
                  {fileUrl.length} {t('newPost.files')}
                </div>
                <div
                  className="bg-nft-gray-2 px-2 py-1 text-white cursor-pointer dark:bg-nft-black-1 transition-all duration-500"
                  onClick={() => setFileUrl(null)}
                >
                  {t('newPost.clearList')}
                </div>
              </aside>
              )
            }
          </div>
        </div>
        <div className="flex w-full flex-col mt-4">
          <h1 className=" transition-all duration-500 font-medium mb-2">
            {t('newPost.addTags')}
          </h1>
          <div className="flex flex-wrap flex-row gap-2">
            {tags.map(((i) => (
              <div key={i} className="flex flex-row items-center bg-blue-500 px-1 text-white dark:bg-blue-600 transition-all duration-500">
                <p className="text-sm">{i}</p>
                <CloseOutlined onClick={() => setTags((prev) => prev.filter((t) => t !== i))} className="text-xs ml-2" />
              </div>
            )))}
          </div>
          <div className="flex flex-col">

            <h1 className="transition-all duration-500 text-sm mt-2"> {t('newPost.space')}</h1>
            <Input
              placeholder={t('newPost.addTag')}
              text={tag}
              setText={setTag}
              Icon={TagOutlined}
              invalidText=""
              className="text-sm"
            />
          </div>

        </div>
        <div className="flex w-full flex-col mt-4">
          <h1 className="font-medium transition-all duration-500">
            {t('newPost.addDescription')}

          </h1>

          <div className=" flex items-center justify-center w-full">

            <textarea
              value={description}
              rows="4"
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('newPost.enterDescription')}
              className="
              outline-none mt-3
              border rounded-t-lg
              p-4 w-full text-sm text-gray-900 bg-white  dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
            />
          </div>

        </div>
        <div
          onClick={handleSubmit}
          className="mt-7 w-full
        transition-all md:w-1/2 flex items-center justify-center duration-500
         bg-blue-600 px-5 py-2 cursor-pointer font-medium text-[#fff] dark:bg-blue-700"
        >
          {t('newPost.submit')}
          {action.loading && <LoadingOutlined className="ml-2" /> }
        </div>
      </div>
    </div>
  );
};

export default AddPost;
