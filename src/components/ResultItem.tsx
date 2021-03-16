/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import React from 'react';

type Props = {
  question: string;
  answer: string;
  correct: boolean;
};

const ResultItem = React.forwardRef<HTMLDivElement, Props>(
  ({ question, answer, correct }, ref) => (
    <div
      ref={ref}
      css={css`
        margin-bottom: 10px;
        min-height: 64px;
        display: flex;
        align-items: center;
        padding: 15px 16px;
        font: 400 14px/1.45 'VarelaRound', sans-serif;
        background-color: #c1c1c159;
        border-radius: 5px;
        color: #fff;
        opacity: 0;
      `}
    >
      <div css={css`
        margin-right: 10px;
        width: 25px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      `}>
        {
          (correct) ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0.75 9.25L4.25 12.75L13.25 1.25" stroke="#2BDE88" strokeWidth="2"/>
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              // incresing the viewbox will scale the
              // graphic down a bit which is what we want
              viewBox="-4 -4 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="0" y1="0" x2="15" y2="15" stroke="red" strokeWidth="2"></line>
              <line x1="0" y1="15" x2="15" y2="0" stroke="red" strokeWidth="2"></line>
            </svg>
          )
        }
      </div>
      <div css={css`
        flex: 1;
      `}>
        <div
          css={css`word-break: break-word`} // symmetric CSS <3
          dangerouslySetInnerHTML={{ __html: question }}
        />
        <div css={css`
          margin-top: 10px;
          width: 100%;
          font-size: 12px;
        `}>
          {`Correct answer: ${answer}`}
        </div>
      </div>
    </div>
  )
);

export default ResultItem;
