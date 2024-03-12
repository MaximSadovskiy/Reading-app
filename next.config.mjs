/** @type {import('next').NextConfig} */

import CopyPlugin from 'copy-webpack-plugin';
import path from 'node:path';

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(path.dirname('.'), 'src', 'styles')],
    },
    webpack: (config) => {
      config.plugins.push(
        new CopyPlugin({
            patterns: [
                {
                  from: './src/booksStorage/srcs/books/*.txt',
                  to: '/var/task/booksStorage/[name][ext]',
                },
                // Add more patterns as needed
              ],
        }),
      );
      return config;
    },
    reactStrictMode: true,
}

export default nextConfig;