import React from 'react';
import { MdErrorOutline } from 'react-icons/md';

const HomeError = ({ error }) => (
  <div className="nav-h flex mt-10 justify-center text-xl gap-1 flex-row">{error} <MdErrorOutline className="text-2xl" /> </div>
);

export default HomeError;
