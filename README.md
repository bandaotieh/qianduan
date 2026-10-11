# element-plus-vite-starter

> A starter kit for Element Plus with Vite

- Preview: <https://vite-starter.element-plus.org>

This is an example of on-demand element-plus with [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components).

> If you want to import all, it may be so simple that no examples are needed. Just follow [quickstart | Docs](https://element-plus.org/zh-CN/guide/quickstart.html) and import them.

If you just want an on-demand import example `manually`, you can check [unplugin-element-plus/examples/vite](https://github.com/element-plus/unplugin-element-plus/tree/main/examples/vite).

If you want to a nuxt starter, see [element-plus-nuxt-starter](https://github.com/element-plus/element-plus-nuxt-starter/).

## Project setup

```bash
pnpm install

# npm install
# yarn install
```

### Compiles and hot-reloads for development

```bash
npm run dev
```

### Compiles and minifies for production

```bash
npm run build
```

## Usage

```bash
git clone https://github.com/element-plus/element-plus-vite-starter
cd element-plus-vite-starter
npm i
npm run dev
```

## Local AI chat

The application includes a floating local AI chat launcher. To use it, create a
`.env.local` file in the project root and configure the Dify app API key:

```env
VITE_DIFY_API_KEY=your-dify-app-api-key # Replace with your local Dify app API key; do not commit .env.local.
```

The existing Vite `/api` proxy forwards requests to `http://localhost:8080`.
Browser `VITE_` variables are included in the client bundle, so this setup is
intended for local development only; use a server-side authenticated proxy in
production. Conversation history is stored in this browser's local storage.

### Custom theme

See `src/styles/element/index.scss`.
