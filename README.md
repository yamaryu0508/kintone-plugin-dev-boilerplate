# kintone-plugin-dev-boilerplate

This is a boilerplate for Kintone plug-in development. Plug-in building is based on `esbuild`. Here, building includes module bundle, React and TypeScript transpile, etc.

## Quick Start
### Download the boilerplate
```:sh
git clone https://github.com/yamaryu0508/kintone-plugin-dev-boilerplate.git
```

### Initialize
```:sh
cd ./kintone-plugin-dev-boilerplate/
yarn install # or npm install
```

### Build
#### For development
```:sh
yarn dev # or npm run dev
```

### For production
```:sh
yarn build # or npm run build
```

## Config files to build
### Default building parameters
`default-build-parameters.js`

### For production
`build.js`

### For development 
`build-dev.js`

## Other commands from NPM scripts
```:js
{
    "dev": "node build-dev.js",
    "build": "node build.js",
    "lint": "eslint src/ts/**/*.ts*",
    "lint:fix": "eslint src/ts/**/*.ts* --fix",
    "lint:style": "stylelint ./src/ts/**/*.tsx",
    "lint:style:fix": "stylelint ./src/ts/**/*.tsx --fix"
}
```