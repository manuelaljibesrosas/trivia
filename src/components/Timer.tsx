/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';

type Props = {
  totalTime: number;
  timeLeft: number;
};

const Timer = React.forwardRef<HTMLDivElement, Props>(
  ({ totalTime, timeLeft }, ref) => (
    <div
      css={css`
        position: relative;
        height: 28px;
        border: 3px solid #28387f;
        border-radius: 20px;
      `}
    >
      <div
        style={{ width: `${(timeLeft / totalTime) * 100}%` }}
        css={css`
          transform: translateY(-50%);
          position: absolute;
          top: 50%;
          left: 0;
          height: 22px;
          width: 100%;
          background-image: linear-gradient(90deg, #fe6bdc 0%, #d642f5 100%);
          border-radius: 20px;
        `}
      />
      <div
        ref={ref}
        css={css`
          transform: translate(-50%, -50%);
          position: absolute;
          top: 50%;
          left: 50%;
          font-family: VarelaRound;
          font-size: 14px;
          line-height: 1;
          color: #fff;
        `}
      >{`${(timeLeft / 1000).toFixed(0)}`}</div>
    </div>
  )
);

export default Timer;
