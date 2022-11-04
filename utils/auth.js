/* eslint-disable no-unused-vars */
import axios from 'axios';
import Router from 'next/router';
import app from './axiosConfig';

export const getUserOther = () => new Promise(
  (resolve, reject) => {
    axios.get(`${process.env.SERVER}/users/auth`, { withCredentials: true })
      .then((res) => {
        const { data } = res;
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  },
);

// eslint-disable-next-line no-return-await
export const getUser = async () => Promise(
  async (resolve, reject) => {
    await app
      .get('/users/auth')
      .then((res) => {
        const { data } = res;
        console.log(data);
        return resolve();
      })
      .catch((error) => reject());
  },
);

export const login = async (username, password, setUser, setLoading, setError) => {
  // console.log(username, password);
  setLoading(true);
  await axios.post(`${process.env.SERVER}/users/login`, { username, password }, { withCredentials: true })
    .then((res) => {
      // console.log(res);
      setLoading(false);
      Router.reload(window.location.pathname);
      // Router.push('/');
      // setUser(res.data);
    }).catch((err) => {
      // console.log(err);
      if (err?.response?.data?.message) setError(err.response.data.message);
      else if (err?.response?.data) {
        if (typeof err.response.data === 'string') setError(err.response.data);
      } else setError('Network error! Try again');
      setLoading(false);
    });
};

export const logout = async (setUser) => {
  await app.get('/users/logout', { withCredentials: true });
  Router.reload(window.location.pathname);
};

export const register = async (name, email, password, setLoading, setError, setSuccess) => {
  setLoading(true);
  try {
    const { data } = await axios.post(`${process.env.SERVER}/users/register`, { username: name, email, password });
    // console.log(data);
    setLoading(false);
    setSuccess(true);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message) setError(err?.response?.data?.message);
    else setError('Network error! Try again after');
    // console.log(error);
  }
};

export const forgot = async (email, setLoading, setError, setSuccess) => {
  setLoading(true);
  try {
    await axios({
      method: 'POST',
      url: `${process.env.SERVER}/users/forgot_send`,
      data: {
        email,
      },
      withCredentials: true,
    });
    setLoading(false);
    setSuccess(true);
  } catch (error) {
    setLoading(false);
    if (error?.response?.data?.message) setError(error.response.data.message);
    else setError('Please try again! We have server error');
  }
};

export const resetPassword = async (email, token, password, setError, setSuccess, setLoading) => {
  setLoading(true);

  try {
    await axios({
      method: 'POST',
      url: `${process.env.SERVER}/users/forgot_confirm`,
      data: {
        email,
        token,
        newPassword: password,
      },
      withCredentials: true,
    });
    setLoading(false);
    setSuccess(true);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message) setError(err.response.data.message);
    else if (err?.response?.data) {
      if (typeof err.response.data === 'string') setError(err.response.data);
    } else setError('Network error! Try again');
  }
};
export const redirectUser = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();

    return { props: {} };
  } Router.push(location);
};
