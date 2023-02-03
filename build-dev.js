import { typecheckPlugin } from '@jgoz/esbuild-plugin-typecheck';
import { build } from 'esbuild';
import kintonePluginPackerPlugin from 'esbuild-kintone-plugin-packer-plugin';
import s3PutObjectPlugin from 'esbuild-s3-put-object-plugin';

import { defaultParams } from './default-build-params.js';

const { PLUGIN_DEV_REGION, PLUGIN_DEV_BUCKET } = process.env;
const PLUGIN_NAME = 'ocr-plugin';

const params = {
  ...defaultParams,
  minify: false,
  plugins: [
    typecheckPlugin(),
    kintonePluginPackerPlugin({
      copyFiles: [
        ['./src/manifest-dev.json', './dist/manifest.json'], // file name must be 'manifest.json' to build
        ['./src/html/config.html', './dist/html/config.html'],
        ['./src/image/icon.png', './dist/image/icon.png']
      ],
      manifestJSONPath: './dist/manifest.json', // file name must be 'manifest.json' to build
      privateKeyPath: './plugin/private-dev.ppk',
      pluginZipPath: './plugin/plugin-dev.zip'
    }),
    // s3PutObjectPlugin({
    //   Region: PLUGIN_DEV_REGION,
    //   Bucket: PLUGIN_DEV_BUCKET,
    //   Key: `${PLUGIN_NAME}/js/desktop.js`,
    //   FilePath: './dist/js/desktop.js'
    // }),
    // s3PutObjectPlugin({
    //   Region: PLUGIN_DEV_REGION,
    //   Bucket: PLUGIN_DEV_BUCKET,
    //   Key: `${PLUGIN_NAME}/js/mobile.js`,
    //   FilePath: './dist/js/mobile.js'
    // }),
    // s3PutObjectPlugin({
    //   Region: PLUGIN_DEV_REGION,
    //   Bucket: PLUGIN_DEV_BUCKET,
    //   Key: `${PLUGIN_NAME}/js/config.js`,
    //   FilePath: './dist/js/config.js'
    // })
  ],
  watch: {
    onRebuild(error, result) {
      if (error) {
        console.error(error);
      } else {
        console.log(`esbuild rebuilt. ${JSON.stringify(result)}`);
      }
    }
  }
};

await build(params);
