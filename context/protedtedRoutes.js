// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import i18n from '../i18n';

import axios from 'axios';

export default async function ProtectedPage(
  context,
  redirectTo, // string route where user will be redirected if they are not authenticated
  getProps, // function to fetch initial props
) {
  // const feruz = context?.req?.cookies;
  //   console.log(feruz);
  // const [key, value] = Object.entries(feruz);
  // console.log(key);
  // await axios({
  //   method: 'GET',
  //   url: `${process.env.SERVER}/users/auth`,
  //   headers: {
  //     cookie: {
  //       'connect.sid:': key[1] }
  //     ,
  //     // ...feruz,
  //   },
  //   withCredentials: true,
  // }).then(() => {
  //   console.log('icinde');
  // }).catch((err) => console.log('err:', err?.response?.data));
  //   const userIsAuthenticated = true; // TODO: check if user is authenticated
  //   if (!userIsAuthenticated) {
  //     return {
  //       redirect: {
  //         destination: redirectTo ?? '/signin',
  //         permanent: false,
  //       },
  //     };
  //   }

  if (getProps) {
    return {
      props: getProps(),
    };
  }

  return {
    props: {},
  };
}

// export const getServerSideProps = (context) => ProtectedPage(
//   context,
//   null,
//   async () => {
//     //   const { locale } = context;
//     //   return (
//     //     {
//     //     ...(await serverSideTranslations(
//     //       locale,
//     //       ['common'],
//     //       i18n,
//     //     )),
//     //   }
//     //   );
//   },
// );
