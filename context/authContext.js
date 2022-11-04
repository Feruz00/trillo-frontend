/* eslint-disable no-unused-vars */
import { createContext, useEffect, useMemo, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Triangle } from 'react-loader-spinner';
// import { getUserOther } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children, noProtected }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [mounted, setMounted] = useState(true);

  const router = useRouter();
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await axios.get(`${process.env.SERVER}/users/auth`, { withCredentials: true })
        .then((res) => {
          const { data } = res;
          setUser(data);
          if (noProtected) {
            return router.push('/');
          }
        })
        .catch((err) => {
          setUser(null);
          if (!noProtected) {
            return router.push('/login');
          }
        }).finally(() => {
          setLoading(false);
        });
    };
    getData();
    setMounted(false);
  }, []);
  useMemo(async () => {
    if (user === null) return;
    // setLoading(true)
    try {
      const { data } = await axios({
        url: `${process.env.SERVER}/friends/user/${user._id}`,
        method: 'GET',
        withCredentials: true,
      });
      setProfile(data);
    } catch (error) {
      console.log(error);
      alert('Something wrong went! Try again!');
    }
    // setLoading(false)
  }, [user]);
  return (
    <AuthContext.Provider value={{ user, setUser, profile, setProfile }}>
      {
        loading || mounted
          ? (
            <div className="h-full min-h-screen w-full flex justify-center items-center">
              <Triangle
                height="80"
                width="80"
                color="#DA18A3"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible
              />

            </div>
          )
          : children
      }
    </AuthContext.Provider>
  );
};
