# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Заметки:

- на странице постов не сделал пагинации, вместо этого пришлось сделать infinity scroll
    - в api не учитывается пагинации по странице то есть back-end api не реализовано учитывая эти задачи
    - https://disneyapi.dev/ в этом api не возвращает total,pages, next, и prev для контролируемый пагинации
- сделал таск на Nuxt 3 Composition Api (TS)
- не сделал live search комментарии по пользователю так как бек не фильтрует данные
- все фильтры делаются через бек а не на фронте.
- использовал tailwindcss для стилизации
- использовал $fetch для запроса на бек.
- eslint, prettier конфиги по умолчанию
- env переменные добавлены в среду vercel

- ☑️ Запрещается грузить сразу все данные ;
- ☑️ Использовать Composition API;
- ☑️ Минимальное количество зависимостей - будет плюсом;
- ☑️ Единый Code Style в проекте;
- ☑️ Использование TypeScript;
- ☑️ Запрещается игнорировать TS ошибки // @ts-ignore
- ☑️ Бандлер Vite;
- ➖ Допускается использование UI библиотек (“Quasar”, “Naiveui”, etc);
- ☑️ Желательно использовать fetch без axios

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
