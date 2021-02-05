/** @jsx jsx */
import React from 'react';
import { render } from 'react-dom';
// components
import { Global, css, jsx } from '@emotion/react';
import Intro from './screens/Intro';
import Question from './screens/Question';
import Results from './screens/Results';
// assets
import FredokaOne from './assets/fonts/Fredoka_One/FredokaOne-Regular.ttf';
import VarelaRound from './assets/fonts/Varela_Round/VarelaRound-Regular.ttf';

render(
  <React.Fragment>
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
    <div
      css={css`
        // we use this instead of the idiomatic
        // vh and vw units because those have
        // problems with the browser's url bar
        // on mobile
        position: fixed;
        width: 100%;
        height: 100%;
      `}
    >
      <Question />
    </div>
  </React.Fragment>,
  document.getElementById('root'),
);
