import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    AWS_REGION: 'us-east-2',
    AWS_ACCESS_KEY_ID: 'ASIA4MTWK44KWMCKOLQM',
    AWS_SECRET_ACCESS_KEY: 'zOu0WT1mPtKBNR7zlDViEjL3h3rCM2HXijkQkeZC',
    S3_BUCKET_NAME: 'ai-metadata-tagging-2',
  }
};

export default nextConfig;
