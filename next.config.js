/** @type {import('next').NextConfig} */
// const { nextI18Next } = require('next-i18next/rewrites');
const { i18n } = require('./i18n');

const nextConfig = {
  reactStrictMode: false,
  // swcMinify: true,
  i18n,
  env: {
    SERVER: 'http://localhost:3001/api/v1',
  },
};

module.exports = nextConfig;
