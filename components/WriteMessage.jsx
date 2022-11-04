/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */

import { SendOutlined, UploadOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { useSocket } from '../context/socket';
import { useConversation } from '../context/conversation';

const WriteMessage = ({ t }) => {
  const [text, setText] = useState('');
  const [ok, setok] = useState(false);
  const { sendMessage, currentConversation } = useConversation();
  const { user } = useContext(AuthContext);
  const socket = useSocket();
  const ref = useRef();
  const [rows, setRows] = useState(1);

  useEffect(() => {
    if (text.length > 0 && !ok) {
      socket.emit('send-typing', { currentConversation, user });
      setok(true);
    }
    if (text.length === 0 && ok) {
      socket.emit('stop-typing', { currentConversation, user });
      setok(false);
    }
  }, [text]);

  function handleSubmit() {
    if (text.length === 0) setText('');
    if (text.length === 0) return;
    const { recipients, ...other } = currentConversation;
    sendMessage(
      currentConversation.recipients.map((r) => r._id),
      { recipients: [...recipients, user], ...other },
      { type: 'text', text },
    );
    setok(false);
    socket.emit('stop-typing', { currentConversation, user });
    setText('');
    setRows(1);
  }
  const uploadPic = async (e) => {
    const file = e.target.files[0];

    const type = file.type.startsWith('image') ? 'image' : 'video';

    const form = new FormData();
    form.append('file', file);
    try {
      const res = await axios({
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        url: `${process.env.SERVER}/conversations/upload`,
        data: form,
        withCredentials: true,
      });
      const { recipients, ...other } = currentConversation;

      sendMessage(
        currentConversation.recipients.map((r) => r._id),
        { recipients: [...recipients, user], ...other },
        { type, text: res.data },
      );
    } catch (error) {
      error.response ? alert(error.response.data.message) : alert('Something wrong went! Try again!');
    }

    // console.log(e.target.files[0])
  };
  return (
    <div className=" flex flex-row shadow  mx-2 border rounded-2xl dark:bg-nft-black-1 mb-2 mt-2">
      <div className="flex-1 flex flex-row items-center justify-center  outline-none ">
        <textarea
          className="flex-1 px-3 py-2 dark:bg-transparent rounded-2xl resize-none w-full h-full outline-none text-base"
          rows={rows}
          placeholder={t('direct.writeMessage')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={(e) => {
            if (e.keyCode === 13) {
              handleSubmit();
            }
          }}
        />
        <UploadOutlined className="text-xl cursor-pointer " onClick={() => { ref.current.click(); }} />
      </div>

      <input type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={uploadPic} ref={ref} multiple={false} />
      <button onClick={handleSubmit}> <SendOutlined className="cursor-pointer text-2xl mx-2 mb-1" /> </button>
    </div>
  );
};

export default WriteMessage;
