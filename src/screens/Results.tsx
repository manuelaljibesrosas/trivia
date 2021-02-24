/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';
import {
  unit,
  mergeAll,
  sequence,
  interpolate,
  easings,
  run,
} from 'tween-fn';
import { routes, history } from '../shared/router';

const ResultItem = React.forwardRef((_, ref) => (
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
    <svg
      css={css`
        margin-right: 10px;
        width: 30px;
        height: 30px;
      `}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.75 9.25L4.25 12.75L13.25 1.25" stroke="#2BDE88" strokeWidth="2"/>
    </svg>
    <div>{'Japan was part of the allied powers during World War I.'}</div>
  </div>
));

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

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.scoreRef = React.createRef();
    this.overlayRef = React.createRef();
    this.confettiRootRef = React.createRef();

    this.answerRefs = [];
    this.answers = new Array();
    for (let i = 0; i < 10; i++) {
      this.answerRefs[i] = React.createRef();

      this.answers.push(<ResultItem key={`answer-${i}`} ref={this.answerRefs[i]} />);
    };

    this.intro = this.intro.bind(this);
    this.outro = this.outro.bind(this);
  }

  intro() {
    const seq = sequence([
      unit({ begin: () => confetti.start(this.confettiRootRef.current) }),
      unit({
        duration: 500,
        ease: easings.SQUARED,
        update: (y) => {
          this.scoreRef.current.style.opacity = y;
        },
        complete: (y) => {
          this.scoreRef.current.style.opacity = y;
        },
      }),
      unit({ delay: 300 }),
      mergeAll(this.answerRefs.map(({ current: answer }, i) => unit({
        delay: i * 150,
        duration: 800,
        ease: easings.EASE_OUT_QUINT,
        update: (y) => {
          answer.style.opacity = y;
          answer.style.transform = `translateX(${interpolate(y, 50, 0)}px)`;
        },
        complete: (y) => {
          answer.style.opacity = y;
          answer.style.transform = `translateX(${interpolate(y, 50, 0)}px)`;
        },
      }))),
    ]);
    run(seq);
  }

  outro() {
    const seq = sequence([
      unit({
        duration: 300,
        begin: confetti.stop(),
        update: (y) => {
          this.overlayRef.current.style.opacity = y;
        },
        complete: (y) => {
          this.overlayRef.current.style.opacity = y;
        },
      }),
      unit({
        delay: 1000,
        begin: () => {
          confetti.remove();
          history.push(routes.GAME);
        },
      }),
    ]);
    run(seq);
  }

  componentDidMount() {
    this.intro();
  }

  render() {

    return (
      <React.Fragment>
        <div ref={this.overlayRef} css={css`
          pointer-events: none;
          z-index: 2;
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: #000620;
          opacity: 0;
        `} />
        <canvas ref={this.confettiRootRef} />
        <div
          css={css`
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
              position: relative;
              height: 120px;
            `}
          >
            <div ref={this.scoreRef} css={css`
              transform: translate(-50%, -50%);
              position: absolute;
              top: 50%;
              left: 50%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              color: #fff;
              opacity: 0;
            `}>
              <h5
                css={css`
                  font: 400 12px/1 'VarelaRound', sans-serif;
                  text-transform: uppercase;
                `}
              >{'final score'}</h5>
              <h2
                css={css`
                  font: 700 64px/1 Roboto, sans-serif;
                `}
              >{'7/10'}</h2>
            </div>
          </div>
          <div
            css={css`
              // we subtract the space taken by the score section
              height: calc(100% - 130px);
            `}
          >
            {this.answers}
          </div>
          <PlayAgainButton onClick={this.outro} />
        </div>
      </React.Fragment>
    );
  }
}

export default Results;
