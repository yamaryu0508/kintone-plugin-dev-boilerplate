import kintonePluginPackerPlugin from 'esbuild-kintone-plugin-packer-plugin';

export const defaultParams = {
  entryPoints: ['./src/ts/desktop.tsx', './src/ts/mobile.tsx', './src/ts/config.tsx'],
  outdir: 'dist/js',
  plugins: [
    kintonePluginPackerPlugin({
      copyFiles: [
        ['./src/manifest.json', './dist/manifest.json'],
        ['./src/html/config.html', './dist/html/config.html'],
        ['./src/image/icon.png', './dist/image/icon.png']
      ],
      manifestJSONPath: './dist/manifest.json',
      privateKeyPath: './plugin/private.ppk',
      pluginZipPath: './plugin/plugin.zip'
    })
  ],
  bundle: true,
  minify: true,
  target: 'es2020',
  jsx: 'automatic',
  jsxImportSource: '@emotion/react'
};
