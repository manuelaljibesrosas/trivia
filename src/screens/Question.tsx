/** @jsx jsx */
import { jsx, css } from '@emotion/react';

const Timer = () => (
  <div
    css={css`
      position: relative;
      height: 28px;
      border: 3px solid #28387f;
      border-radius: 20px;
    `}
  >
    <div
      css={css`
        transform: translateY(-50%);
        position: absolute;
        top: 50%;
        left: 0;
        height: 22px;
        width: 70%;
        background-image: linear-gradient(90deg, #fe6bdc 0%, #d642f5 100%);
        border-radius: 20px;
      `}
    />
    <div
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
    >4</div>
  </div>
);

const QuestionOption = ({ label, checked }) => (
  <div
    css={css`
      cursor: pointer;
      margin-bottom: 9px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      height: 45px;
      border: 3px solid #6e7dc6;
      border-radius: 12px;
      font: 400 14px/1 VarelaRound;
      color: #dedede;

      &:last-child {
        margin-bottom: 0;
      }
    `}
  >
    <span>{label}</span>
    {
      checked ?
        <div
          css={css`
            width: 25px;
            height: 25px;
            background-color: #3a5eff;
            border-radius: 50%;
          `}
        >
          <svg width="25" height="25">
            <path
              transform="translate(6 6)"
              d="M1 9L4.5 12.5L13.5 1"
              stroke="#fff"
              fill="transparent"
            />
          </svg>
        </div> :
        <div
          css={css`
            width: 25px;
            height: 25px;
            border: 3px solid #28387f;
            border-radius: 50%;
          `}
        />
    }
  </div>
); 

const Question = () => (
  <div
    css={css`
      height: 100%;
      padding: 40px;
      background-color: #0a1a61;
    `}
  >
    <Timer />
    <div
      css={css`
        height: calc(100% - 28px); // 28px is the timer's height
        padding-top: 20%;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          margin-bottom: 23px;
          padding-bottom: 12px;
          border-bottom: 1px solid #505980;
          font-family: VarelaRound;
          line-height: 16px;
        `}
      >
        <span
          css={css`
            font-size: 20px;
            color: #949cbf;
          `}
        >{'Question 1'}</span>
        <span
          css={css`
            font-size: 16px;
            color: #505980;
          `}
        >{'/10'}</span>
      </div>
      <div>
        <h5
          css={css`
            margin-bottom: 16px;
            font: 400 11px/1 VarelaRound;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: #efefef;
          `}
        >{'History'}</h5>
        <h3
          css={css`
            font: 400 24px/29px VarelaRound;
            color: #fff;
          `}
        >
          {'Japan was part of the allied powers during World War I.'}
        </h3>
      </div>
      <div
        css={css`
          margin: 50px 0 20px;
          height: 100%;
          overflow-y: auto;
        `}
      >
        <QuestionOption label="True" checked />
        <QuestionOption label="False" />
      </div>
    </div>
  </div>
);

export default Question;
