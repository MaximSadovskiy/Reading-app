/** @type {import('next').NextConfig} */
import path from 'node:path';
import CopyPlugin from 'copy-webpack-plugin';

export const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'src', 'styles')],
    },
    webpack: (config) => {
      config.plugins.push(
        new CopyPlugin({
            patterns: [
                {
                  from: './src/booksStorage/srcs/books/*.txt', // Use a glob pattern to match multiple .txt files
                  to: 'booksStorage/[name][ext]', // This will copy the files to .next/static/books, preserving their names and extensions
                },
                // Add more patterns as needed
              ],
        }),
      );
      return config;
    },
    reactStrictMode: true,
}