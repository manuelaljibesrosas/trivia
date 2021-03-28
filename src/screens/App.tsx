/** @jsx jsx */
import React from 'react';
import { history, routes } from 'shared/router';
import store from 'state/store';
import 'regenerator-runtime/runtime';
import 'shared/confetti';
// components
import { Provider } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import { Global, css, jsx } from '@emotion/react';
import Intro from 'screens/Intro';
import Trivia from 'screens/Trivia';
import Results from 'screens/Results';
// assets
import FredokaOne from 'assets/fonts/Fredoka_One/FredokaOne-Regular.ttf';
import VarelaRound from 'assets/fonts/Varela_Round/VarelaRound-Regular.ttf';

const App: React.FC = () => (
  <React.StrictMode>
    <Global
      styles={css`
        @font-face {
          font-family: 'FredokaOne';
          src: url(${FredokaOne});
        }
        @font-face {
          font-family: 'VarelaRound';
          src: url(${VarelaRound});
        }
        * {
          box-sizing: border-box;
          user-select: none;
          margin: 0;
        }
        body {
          background: #eee;
        }
      `}
    />
    <Provider store={store}>
      <div
        // we use this instead of the idiomatic
        // vh and vw units because those have
        // problems with the browser's url bar
        // on mobile
        css={css`
          position: fixed;
          width: 100%;
          height: 100%;
        `}
      >
        <Router history={history}>
          <Switch>
            <Route exact path={routes.INTRO}>
              <Intro />
            </Route>
            <Route path={routes.GAME}>
              <Trivia />
            </Route>
            <Route path={routes.RESULTS}>
              <Results />
            </Route>
          </Switch>
        </Router>
      </div>
    </Provider>
  </React.StrictMode>
);

export default App;