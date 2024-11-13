# Nuxt 3 Expense Manager

Built with Nuxt3
Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

```

## Development Server

Start the development server on `http://localhost:3003`:

```bash
# npm
npm run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

However, JWT Authentication requires an HTTPS SSL connection, otherwise you will not be able to log into 
the app. For development i use Caddy & mkcert to issue a local certificate in my home network. There the App runs in a docker stack with caddy & expense, but it should run in SSL environment.


Expense is a small Web Application with Vuetify UI to distribute Cost/Expenses among Trip participants or other group members. I created this Application to explore Nuxt3 and to be free to implement whatever Function we desire on our extended Camper Trips.

Features are

JWT Authentication
Role based UI
Excel download for further analysis

(c) 2024 Dieter Chvatal (dieter.chvatal@gmail.com)
