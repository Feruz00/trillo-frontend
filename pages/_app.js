import React, { useState, useEffect } from 'react';
import '../styles/dotLoader.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/globals.css';

// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from 'next-themes';
import nprogress from 'nprogress';
import { useRouter } from 'next/router';
import App from 'next/app';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { Footer, Navbar } from '../components';
import '../styles/nprogress.css';
import { AuthProvider } from '../context/authContext';
import SocketProvider from '../context/socket';
import ConversationProvider from '../context/conversation';
import { redirectUser } from '../utils/auth';
import UserToCall from '../components/UserToCall';
import VideoCall from '../components/VideoCall';

const MyApp = ({ Component, pageProps, noProtected }) => {
  const [mounted, setMounted] = useState(false);

  const routerM = useRouter();

  useEffect(() => {
    routerM.events.on('routeChangeStart', () => nprogress.start());
    routerM.events.on('routeChangeComplete', () => nprogress.done());
    routerM.events.on('routeChangeError', () => nprogress.done());
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <ThemeProvider attribute="class">
      <AuthProvider noProtected={noProtected}>
        <SocketProvider>
          <ConversationProvider>

            <Navbar />
            <div className="pt-65">
              <Component {...pageProps} noProtected={noProtected} />
            </div>
            <UserToCall />
            <VideoCall />
            <Footer />

          </ConversationProvider>
        </SocketProvider>

      </AuthProvider>

    </ThemeProvider>
  );
};

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const { ctx } = appContext;
  const { req } = ctx;
  // const cookies = parseCookies(ctx);
  // console.log(cookies);
  const noProted = ctx.pathname === '/login'
    || ctx.pathname === '/register'
    || ctx.pathname === '/forgot'
    || ctx.pathname === '/activate/[id]/[token]'
    || ctx.pathname === '/confirm_password/[email]/[token]';
  await axios.get(`${process.env.SERVER}/users/auth`, {
    headers: {
      Cookie: req.headers.cookie,
    },
    withCredentials: true,
  }).then((res) => {
    if (noProted) {
      redirectUser(ctx, '/');
    }
  }).catch((err) => {
    // console.log(err?.response?.data);
    if (!noProted) { redirectUser(ctx, '/login'); }
  });
  return { ...appProps, noProtected: noProted };
};

export default appWithTranslation(MyApp);
