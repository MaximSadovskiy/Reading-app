/** @type {import('next').NextConfig} */

import path from 'node:path';

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(path.dirname('.'), 'src', 'styles')],
    },
    reactStrictMode: true,
}

export default nextConfig;