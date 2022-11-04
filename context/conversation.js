/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';

import axios from 'axios';
import Peer from 'simple-peer';

import { useSocket } from './socket';
import { AuthContext } from './authContext';

const ConversationsContext = React.createContext();

export function useConversation() {
  return useContext(ConversationsContext);
}

// eslint-disable-next-line react/function-component-definition
export default function ConversationProvider({ children }) {
  const socket = useSocket();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startVideoChat, setStartVideoChat] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [call, setCall] = useState({});
  const [currentCall, setCurrentCall] = useState(null);
  const myVideo = useRef();
  const userVideo = useRef([]);
  const connectionRef = useRef();
  const [peers, setPeers] = useState({});

  const getOnlineUser = ({ users }) => setOnlineUsers(users);

  useEffect(() => {
    if (user === null) return;
    setLoading(true);

    axios({

      method: 'GET',
      withCredentials: true,
      url: `${process.env.SERVER}/conversations/mylist`,
    }).then((res) => {
      const { conversation, message } = res.data;
      setConversations(conversation);
      console.log(conversation);
      setChat(message);
    }).catch((err) => {
      console.error('conversation.js daki error:', err);
      alert('Cannot upload conversation list!');
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!startVideoChat) return;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });
  }, [startVideoChat]);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.push({ srcObject: currentStream });
    });

    peer.signal(call.signal);
    setStartVideoChat(true);
    connectionRef.current = peer;
  };
  const callUser = (caller) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    setCurrentCall(caller);
    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: caller._id, signalData: data, from: user });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.push({ srcObject: currentStream });
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };
  const leaveCall = (id) => {
    // console.log(call.from);

    if (call?.from?._id) socket.emit('leaveCall', { user: call.from });
    else if (currentCall?._id) socket.emit('leaveCall', { user: currentCall });
    setCallEnded(true);
    connectionRef?.current && connectionRef.current.destroy();
    setCallAccepted(false);
    setStartVideoChat(false);
    setCall({});

    window.location.reload();
  };
  const leaveCallFrom = (id) => {
    // console.log(call.from);

    setCallEnded(true);
    connectionRef?.current && connectionRef.current.destroy();
    setCallAccepted(false);
    setStartVideoChat(false);

    // myVideo.current.stop();
    setCall({});
    window.location.reload();
  };
  // const sortedChat = useMemo( ()=>{
  //   return chat.map( i=> ({date: i.messages[0].createdAt, _id:}) )
  // }, [chat] )
  const formatted = useMemo(
    () =>
    // console.log("formatedde")
      // eslint-disable-next-line implicit-arrow-linebreak
      conversations.map((i) => {
        const { recipients, groupName, ...other } = i;
        const all = recipients.length === 1 ? recipients : recipients.filter((t) => t._id !== user._id);
        // console.log(all);
        const logos = all;
        // if (logos.length === 0) return;
        const l = [];
        let
          name = '';

        l.push(logos[0].logo);
        name = logos[0].username;

        if (i.isGroup) {
          if (logos.length > 1) {
            l.push(logos[1].logo);
            name += `,${logos[1].username}`;
          }

          if (l.length === 1) {
            l.push('');
            name += ',...';
          }
          if (groupName.length > 0) name = groupName;
          else name = name.substr(0, 15) + (name.length > 15 ? '...' : '');
        }
        const isAdmin = i.admins.includes(user._id);

        return { ...other, recipients: all, name, groupName, logo: l, isAdmin };
      }),
    [conversations],
  );
  // console.log('formattedde:', conversations, formatted);

  const count = useMemo(() => {
    const aa = [];
    chat.forEach((p) => {
      const { _id, messages } = p;
      let ok = false;
      for (let i = messages.length - 1; i >= 0; i--) {
        const { readers, sender } = messages[i];
        if (sender._id === user._id) break;
        if (readers.findIndex((l) => l === user._id) === -1) {
          ok = true;
          break;
        }
      }
      if (ok) {
        aa.push(_id);
      }
    });
    return aa;
  }, [chat]);
  // console.log('Ilki:', conversations);
  const addMessageToConversation = ({ current, sender, text, type, readers, createdAt }) => {
    const c = count.findIndex((i) => i === current._id);
    let ok = false;
    // console.log('icinde:', conversations, current, conversations.filter((i) => i._id === current._id));
    setConversations((prev) => {
      if (prev.filter((i) => i._id === current._id).length === 0) return [current, ...prev];
      if (prev.length === 1) return [current];
      return [current, ...prev.filter((i) => i._id !== current._id)];
    });
    // if (conversations.filter((i) => i._id === current._id).length === 0) { setConversations((prev) => [...prev, current]); }
    // console.log(conversations, formatted, conversations.filter((i) => i._id === current._id));
    setChat((prev) => {
      const nw = prev.map((i) => {
        if (i._id !== current._id) return i;

        if (c !== -1) readers.push(user._id);
        const { messages, ...other } = i;
        ok = true;
        return { messages: [...messages, { sender, text, type, readers, createdAt }], ...other };
      });
      if (ok) return nw;

      if (c !== -1) readers.push(user._id);
      // return [{ _id: current._id, messages: [{ sender, text, readers, type, createdAt: createdAt || Date.now() }] }, ...prev];

      return [...prev, { _id: current._id, messages: [{ sender, text, readers, type, createdAt: createdAt || Date.now() }] }];
    });
  };
  useEffect(() => {
    if (socket == null) return;

    // socket.off('calluser').on('calluser', ({from, name: callerName, signal}))

    socket.on('callUser', ({ from, signal }) => {
      setCall({ isReceivingCall: true, from, signal });
    });
    socket.on('leaveCallFrom', leaveCallFrom);

    socket.off('connectedUsers').on('connectedUsers', getOnlineUser);
    socket.off('receive-message').on('receive-message', addMessageToConversation);

    socket.off('post').on('post', () => {
      // console.log("geldim")
      setUser((prev) => ({ ...prev, unreadPosts: true }));
    });
    socket.off('getnewnotification').on('getnewnotification', () => {
      setUser((prev) => ({ ...prev, unreadNotifications: true }));
    });

    socket.off('group-add').on('group-add', ({ geldim }) => {
      setChat((prev) => [...prev, { _id: geldim._id, messages: [] }]);
      setConversations((prev) => [...prev, geldim]);
    });
    socket.off('somebody-added').on('somebody-added', ({ geldim }) => {
      setConversations((prev) => prev.map((i) => {
        if (i._id !== geldim._id) return i;
        return geldim;
      }));
    });

    socket.off('leave-somebody').on('leave-somebody', ({ cr, fer }) => {
      setConversations((prev) => prev.map((i) => {
        if (i._id !== cr._id) return i;

        const { recipients, admins, ...other } = i;
        const nw = recipients.filter((k) => k._id !== fer._id);
        const a = admins.filter((k) => k !== fer._id);
        return { ...other, recipients: nw, admins: a };
      }));
    });

    socket.off('iamdeleted').on('iamdeleted', ({ cr }) => {
      setCurrentConversation((prev) => {
        if (prev === null) return null;
        if (prev._id === cr._id) return null;
        return prev;
      });

      setConversations((prev) => prev.filter((i) => i._id !== cr._id));
    });

    socket.off('somebodydeleted').on('somebodydeleted', ({ cr, current }) => {
      setConversations((prev) => prev.map((i) => {
        if (i._id !== cr._id) return i;

        const { recipients, admins, ...other } = i;
        const nw = recipients.filter((t) => t._id !== current);
        const a = admins.filter((t) => t !== current);
        return { recipients: nw, ...other, admins: a };
      }));
    });

    socket.off('adminout').on('adminout', ({ cr, current }) => {
      setConversations((prev) => prev.map((i) => {
        if (i._id !== cr._id) return i;

        const { admins, ...other } = i;
        return { admins: admins.filter((t) => t !== current), ...other };
      }));
    });
    socket.off('adminin').on('adminin', ({ cr, current }) => {
      setConversations((prev) => prev.map((i) => {
        if (i._id !== cr._id) return i;

        const { admins, ...other } = i;
        return { admins: [...admins, current], ...other };
      }));
    });
    socket.off('groupname').on('groupname', ({ cr, name }) => {
      setConversations((prev) => prev.map((i) => {
        if (i._id !== cr._id) return i;

        const { groupName, ...other } = i;
        return { groupName: name, ...other };
      }));
    });
    socket.off('users').on('users', ({ baza }) => {
      const k = baza.map((i) => {
        const { username, online } = i;

        return { username, online };
      });
    });

    socket.off('get-typing').on('get-typing', ({ current, writer }) => {
      setTyping((prev) => {
        let ok = false;
        const nw = prev.map((i) => {
          if (i.current._id === current._id) {
            ok = true;
            return { current, writers: [...i.writers, writer] };
          } return i;
        });
        if (ok) return nw;
        return [...prev, { current, writers: [writer] }];
      });
    });

    socket.off('dur-typing').on('dur-typing', ({ current, writer }) => {
      setTyping((prev) => {
        const nw = prev.map((i) => {
          if (i.current._id === current._id) {
            const wr = i.writers.filter((t) => t._id !== writer._id);

            return { current, writers: wr };
          } return i;
        }).filter((i) => i.writers.length > 0);
        return nw;
      });
    });
  }, [socket]);

  // eslint-disable-next-line camelcase
  const t_cur = useMemo(() => {
    if (currentConversation === null) return null;
    return formatted[formatted.findIndex((t) => (t._id === currentConversation._id))];
  }, [formatted, currentConversation]);

  function sendMessage(recipients, current, value) {
    socket.emit('send-message', { recipients, sender: user, current, value }, ({ err }) => {
      if (err) alert(' Cannot send message! ');
    });
    //  console.log(value)
    addMessageToConversation({ current, sender: user, type: value.type, text: value.text, readers: [], createdAt: Date.now() });
  }

  useEffect(() => {
    if (t_cur === null) return;

    const c = count.findIndex((i) => i === currentConversation._id);
    if (c === -1) return;

    socket.emit('read-message', { currentConversation: t_cur }, ({ err }) => {
      if (err) alert('Cannot read message');
    });

    const k = chat.findIndex((i) => i._id === currentConversation._id);

    setChat((prev) => prev.map((i, index) => {
      if (index !== k) return i;

      const { messages, ...other } = i;
      const arr = messages.map((i) => {
        const { sender, text, readers, ...fer } = i;

        if (sender._id !== user._id) {
          if (readers.findIndex((i) => i === user._id) === -1) readers.push(user._id);
        }

        return { sender, text, readers, ...fer };
      });
      return { messages: arr, ...other };
    }));
  }, [currentConversation, chat]);

  const selectedChat = useMemo(() => {
    if (t_cur === null) return [];
    return chat[chat.findIndex((t) => (t._id === t_cur._id))];
  }, [t_cur, chat]);

  const ero = useMemo(() => chat, [chat]);

  const value = {
    selectedChat,
    setConversations,
    conversations: formatted,
    setCurrentConversation,
    currentConversation: t_cur,
    sendMessage,
    typing,
    count,
    chat: ero,
    setChat,
    loading,
    setLoading,
    startVideoChat,
    setStartVideoChat,
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    callEnded,
    callUser,
    leaveCall,
    answerCall,
    onlineUsers,
  };

  return (
    <ConversationsContext.Provider value={value}>
      { children }
    </ConversationsContext.Provider>
  );
}
