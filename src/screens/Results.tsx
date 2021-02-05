/** @jsx jsx */
import { jsx, css } from '@emotion/react';
// components
import { Link } from 'react-router-dom';

const ResultItem = () => (
  <div
    css={css`
      margin-bottom: 10px;
      min-height: 64px;
      padding: 5px 15px;
      display: flex;
      align-items: center;
      background-color: #c1c1c159;
      border-radius: 5px;
      color: #fff;
      font: 400 12px/16px VarelaRound;
    `}
  >
    <div
      css={css`
        width: 30px;
        height: 30px;
      `}
    />
    <div
      css={css`
        flex: 1;
      `}
    >Japan was part of the allied powers during World War I.</div>
  </div>
);

const PlayAgainButton = ({ onClick }) => (
  <div
    onClick={onClick}
    css={css`
      cursor: pointer;
      position: fixed;
      bottom: 16px;
      // subtract 10px padding from each side
      width: calc(100% - 20px);
      height: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      font: 400 14px/1 VarelaRound;
      text-transform: uppercase;
      background-color: #ec0eae;
      border-radius: 8px;
      color: #fff;
    `}
  >{'play again'}</div>
);

const Results = () => (
  <div
    css={css`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 0 10px;
      background-color: #0a1a61;
    `}
  >
    <div
      css={css`
        pointer-events: none;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 300px;
        background-image: linear-gradient(180deg, #ffffff00 0%, #ffffff1a 100%);
      `}
    />
    <div
      css={css`
        margin: 35px 0 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        color: #fff;
      `}
    >
      <h5
        css={css`
          font: 400 11px/1 VarelaRound;
          text-transform: uppercase;
        `}
      >final score</h5>
      <h2
        css={css`
          font: 200 64px/1 Roboto, sans-serif;
        `}
      >7/10</h2>
    </div>
    <ul
      css={css`
        // we subtract the space taken by the score section
        height: calc(100% - 130px);
        padding: 0;
        overflow-y: hidden;
      `}
    >
      <ResultItem />
      <ResultItem />
      <ResultItem />
      <ResultItem />
      <ResultItem />
      <ResultItem />
      <ResultItem />
      <ResultItem />
      <ResultItem />
      <ResultItem />
    </ul>
    <Link to="/" component={({ navigate }) => (
      <PlayAgainButton onClick={navigate} />
    )} />
  </div>
);

export default Results;
