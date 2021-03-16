/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import React from 'react';

type Props = {
  onClick: () => void;
};

const PlayAgainButton= React.forwardRef<HTMLDivElement, Props>(({ onClick }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    css={css`
      cursor: pointer;
      z-index: 2;
      position: fixed;
      bottom: 16px;
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
));

export default PlayAgainButton;
