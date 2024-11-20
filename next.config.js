const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const config = {};

module.exports = withNextIntl(config);