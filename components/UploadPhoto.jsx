import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState, useMemo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const UploadPhoto = ({ t }) => {
  const [action, setAction] = useState({
    error: null,
    succcess: null,
    loading: false,
  });
  const [fileUrl, setFileUrl] = useState(null);
  const onDrop = useCallback(async (acceptedFiles) => {
    setFileUrl(acceptedFiles.map((prev) => Object.assign(prev, {
      preview: URL.createObjectURL(prev),
    })));
  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple: false,
    maxSize: 5000000,
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
      setAction((prev) => ({ ...prev, error: t('setting.uploadPhotoError') }));
      return false;
    }
    const form = new FormData();
    form.append('file', fileUrl[0]);

    setAction((prev) => ({ ...prev, loading: true }));

    await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      url: `${process.env.SERVER}/users/picture`,
      data: form,
      withCredentials: true,
    }).then(() => {
      setAction((prev) => ({ ...prev, success: true }));
      window.location.reload();
    }).catch((err) => {
      if (err.response) setAction((prev) => ({ ...prev, error: err.response.data.message }));
      else setAction((prev) => ({ ...prev, error: 'Something wrong went. Try again!' }));
    }).finally(() => {
      setAction((prev) => ({ ...prev, loading: false }));
    });
  }
  return (
    <div className="flex justify-center sm:px-4 p-12 ">
      <div className="w-3/5 md:w-full">
        <div className="mt-1">
          <p className=" dark:text-white text-nft-black-1 font-semibold text-xl">
            {t('settings.uploadPassword')}
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
              {t('settings.success')}
            </span>
            )
          }
          </p>
          <div className="mt-4">
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
              <aside className="mt-2">
                <div>
                  <img
                    src={fileUrl[0].preview}
                    alt="asset-file"

                  />
                </div>
              </aside>
              )
            }
          </div>
        </div>
        <div
          onClick={handleSubmit}
          className="mt-7 w-full
        transition-all md:w-1/2 flex items-center justify-center duration-500
         bg-blue-600 px-5 py-2 cursor-pointer font-medium text-[#fff] dark:bg-blue-700"
        >
          {t('settings.upload')}
          {action.loading && <LoadingOutlined className="ml-2" /> }
        </div>
      </div>
    </div>
  );
};

export default UploadPhoto;
