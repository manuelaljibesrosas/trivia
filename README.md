## Super Trivia App

A simple true or false trivia game, showcases some playful animations with a clean design; for technical details consult the `ARCHITECTURE.md` file

To play locally, install `node@12.x.x` and `npm@6.x.x` and run

```bash
npm install && npm start
```

This will start a local development server at port 8080, to access the game from your phone, make sure that your phone is connected to the same network as your computer, then open the browser and go to `http://<your-computer-ip>:8080`

To run the unit tests, install the dependencies run this command

```bash
npm test
```

To run the integration test suite, start the development server and run this command on a new terminal

```bash
npm run cypress:open
```

This will open a new Cypress window from which the tests can be run

Please note that this app is __NOT responsive__ in its current version, and it's meant for devices with an aspect ratio close to 9:16 (~~any~~ most phones should be ok), running it on screens with an aspect ratio far from 9:16 is not supported and will break layout
