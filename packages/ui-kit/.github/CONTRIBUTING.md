# Contributing

## Development

To set up the development environment:

### Clone the repository

```bash
git clone git@github.com:SAMA-Communications/sama-client.git
cd sama-client/packages/ui-kit
```

### Install dependencies

```bash
npm install
```

### Build lib

```bash
npm run build
```

## How to publish new version

1. Ensure you have Node.js 22 installed, then run `npm install`
2. Build the library with `npm run build`
3. Update the library version in `package.json`
4. Log in to npm with `npm login`
5. Publish the library with `npm publish --access public`
6. Verify that the library has been published successfully with `npm view @sama-communications/ui-kit`
