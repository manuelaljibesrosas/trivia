/** @jsx jsx */
import { jsx, css } from '@emotion/react';
// components
import { Link } from 'react-router-dom';

const Intro = () => (
  <Link to="/game">
    <div
      css={css`
        position: relative;
        height: 100%;
        background: #1233c8;
      `}
    >
      <div
        css={css`
          transform: translate(-50%, calc(-50% - 15px));
          position: absolute;
          top: 50%;
          left: 50%;
          text-align: center;
        `}
      >
        <h1
          css={css`
            position: relative;
            margin-bottom: 50px;
            font-family: 'FredokaOne', sans-serif;
            font-size: 64px;
            font-weight: 400;
            text-transform: uppercase;
            line-height: 1;
            color: #fff;
            &:before {
              content: "Super Trivia App";
              transform: translate(-50%, calc(-50% + 8px));
              position: absolute;
              top: 50%;
              left: 50%;
              opacity: .5;
            }
          `}
        >{'Super Trivia App'}</h1>
        <h3
          css={css`
            cursor: pointer;
            font-family: VarelaRound, sans-serif;
            text-transform: uppercase;
            font-size: 16px;
            line-height: 1;
            font-weight: 400;
            color: #fff;
          `}
        >{'Tap to start'}</h3>
      </div>
      <div
        css={css`
          transform: translateX(-50%);
          position: absolute;
          left: 50%;
          bottom: 30px;
          width: fit-content;
          font-family: VarelaRound;
          font-size: 13px;
          line-height: 1;
          text-align: center;
          color: #fff;
        `}
      >{'terms of service | privacy policy'}</div>
    </div>
  </Link>
);

export default Intro;
