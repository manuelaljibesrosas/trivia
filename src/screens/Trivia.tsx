/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';
import styled from '@emotion/styled';
import {
  run,
  unit,
  merge,
  interpolate,
  computeTransform,
  sequence,
  easings,
} from 'tween-fn';
import { Question } from '../types/Question';
import { questions } from '../shared/questions';
import { routes, history } from '../shared/router';
// components
import { Link } from 'react-router-dom';

const reactSetState = (component, key, value) => (
  component.setState((s) => ({
    ...s,
    [key]: value,
  }))
);

const Timer = ({ totalTime, timeLeft }) => (
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
    >{`${(timeLeft / 1000).toFixed(1)}s`}</div>
  </div>
);

class QuestionOption extends React.Component {
  tick = React.createRef();
  tickBg = React.createRef();

  componentDidUpdate({ checked }) {
    if (!checked && this.props.checked) {
      const buttonCheckedSeq = sequence([
        merge(
          unit({
            duration: 280,
            ease: easings.SQUARED,
            meta: { originalTransform: 'translate(-50%, -50%)' },
            update: (y, { originalTransform }) => {
              this.tickBg.current.style.transform = computeTransform(
                originalTransform,
                `scale(${y})`,
              );
            },
            complete: (y, { originalTransform }) => {
              this.tickBg.current.style.transform = computeTransform(
                originalTransform,
                `scale(${y})`,
              );
            },
          }),
          unit({
            duration: 380,
            ease: easings.SQUARED,
            update: y => {
              this.tick.current.style.strokeDashoffset = interpolate(y, 19.55, 0);
            },
            complete: y => {
              this.tick.current.style.strokeDashoffset = interpolate(y, 19.55, 0);
            },
          }),
        ),
      ]);

      run(buttonCheckedSeq);
    }
  }
  
  render() {
    const { label, checked, onClick } = this.props;

    return (
      <div
        style={{ borderColor: (checked) ? 'aliceblue' : '#6e7dc6' }}
        onClick={onClick}
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
          -webkit-tap-highlight-color: transparent;

          &:last-child {
            margin-bottom: 0;
          }
        `}
      >
        <span>{label}</span>
        <div
          css={css`
            position: relative;
            width: 25px;
            height: 25px;
            border: 3px solid #28387f;
            border-radius: 50%;
          `}
        >
          {
            checked && (
              <React.Fragment>
                <div
                  ref={this.tickBg}
                  css={css`
                    transform: translate(-50%, -50%) scale(1);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 25px;
                    height: 25px;
                    background-color: #3a5eff;
                    border-radius: 50%;
                  `}
                />
                <svg
                  css={css`
                    transform: translate(-50%, -50%);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                  `}
                  width="25"
                  height="25"
                >
                  <path
                    ref={this.tick}
                    transform="translate(6 6)"
                    d="M1 9L4.5 12.5L13.5 1"
                    stroke="#fff"
                    fill="transparent"
                    strokeDasharray="19.55"
                    strokeDashoffset="19.55"
                  />
                </svg>
              </React.Fragment>
            )
          }
        </div>
      </div>
    ); 
  }
}

class GameIntro extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      transform: 'translateX(-50%) translateY(-50%)',
      opacity: 0,
      innerText: 'Get ready',
      fontSize: '42px',
      backdropOpacity: 1,
    };
  }

  componentDidMount() {
    const seq = sequence([
      merge(
        unit({
          from: -30,
          to: 0,
          duration: 300,
          ease: easings.SQUARED,
          meta: { originalTransform: this.state.transform },
          update: (y, { originalTransform }) => {
            this.setState(s => ({
              ...s,
              transform: computeTransform(originalTransform, `translateY(${y}px)`),
            }));
          },
          complete: (y, { originalTransform }) => {
            this.setState(s => ({
              ...s,
              transform: computeTransform(originalTransform, `translateY(${y}px)`),
            }));
          },
        }),
        unit({
          duration: 200,
          ease: easings.SQUARED,
          update: y => {
            this.setState(s => ({
              ...s,
              opacity: y,
            }));
          },
          complete: y => {
            this.setState(s => ({
              ...s,
              opacity: y,
            }));
          },
        }),
      ),
      unit({
        delay: 600,
        duration: 200,
        ease: easings.SQUARED,
        update: y => {
          this.setState(s => ({
            ...s,
            opacity: interpolate(y, 1, 0),
          }));
        },
        complete: y => {
          this.setState(s => ({
            ...s,
            opacity: interpolate(y, 1, 0),
          }));
        },
      }),
      unit({ duration: 100 }),
      merge(
        unit({
          duration: 300,
          ease: easings.SQUARED,
          meta: { originalTransform: this.state.transform },
          begin: () => {
            this.setState((s) => ({
              ...s,
              innerText: 'START!',
              fontSize: '48px',
            }));
          },
          update: (y, { originalTransform }) => {
            this.setState((s) => ({
              ...s,
              transform: computeTransform(
                originalTransform,
                `scale(${interpolate(y, 2, 1)}) rotate(${interpolate(y, 10, 0)}deg)`,
              ),
            }));
          },
          complete: (y, { originalTransform }) => {
            this.setState((s) => ({
              ...s,
              transform: computeTransform(
                originalTransform,
                `scale(${interpolate(y, 2, 1)}) rotate(${interpolate(y, 10, 0)}deg)`,
              ),
            }));
          },
        }),
        unit({
          duration: 200,
          ease: easings.SQUARED,
          update: y => {
            this.setState((s) => ({
              ...s,
              opacity: y,
            }));
          },
          complete: y => {
            this.setState((s) => ({
              ...s,
              opacity: y,
            }));
          },
        }),
      ),
      merge(
        unit({
          duration: 800,
          meta: { originalTransform: this.state.transform },
          update: (y, { originalTransform }) => {
            this.setState((s) => ({
              ...s,
              transform: computeTransform(
                originalTransform,
                `scale(${interpolate(y, 1, 1.03)})`,
              ),
            }));
          },
          complete: (y, { originalTransform }) => {
            this.setState((s) => ({
              ...s,
              transform: computeTransform(
                originalTransform,
                `scale(${interpolate(y, 1, 1.03)})`,
              ),
            }));
          },
        }),
        unit({
          delay: 700,
          duration: 300,
          ease: easings.SQUARED,
          update: y => {
            this.setState((s) => ({
              ...s,
              opacity: interpolate(y, 1, 0),
              backdropOpacity: interpolate(y, 1, 0),
            }));
          },
          complete: y => {
            this.setState((s) => ({
              ...s,
              opacity: interpolate(y, 1, 0),
              backdropOpacity: interpolate(y, 1, 0),
            }));
          },
        }),
      ),
    ]);
    run(seq);
  }

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            transform: this.state.transform,
            opacity: this.state.opacity,
            fontSize: this.state.fontSize,
          }}
          css={css`
            z-index: 2;
            position: fixed;
            top: 50%;
            left: 50%;
            width: fit-content;
            font: 400 42px/1 sans-serif;
            color: #fff;
            opacity: 0;
          `}
        >{this.state.innerText}</div>
        {
          (this.state.backdropOpacity !== 0) && (
            <div
              style={{ opacity: this.state.backdropOpacity }}
              css={css`
                position: fixed;
                z-index: 1;
                height: 100%;
                width: 100%;
                backdrop-filter: blur(3px);
              `}
            />
          )
        }
      </React.Fragment>
    );
  }
}

class Trivia extends React.PureComponent {
  constructor(props) {
    super(props);

    this.countdownRef = React.createRef();

    this.state = {
      curtains: {
        opacity: 1,
      },
      currentCard: {
        index: 0,
        timeLeft: 15000,
      },
      answer: null,
    };
    this.questions = questions.concat([]);
    this.timerSubscription = null;
    this.animateButton = this.animateButton.bind(this);
    this.initTimer = this.initTimer.bind(this);
  }

  initTimer() {
    const seq = sequence([
      unit({
        duration: 15000,
        update: (y) => {
          this.setState((s) => ({
            ...s,
            currentCard: {
              ...s.currentCard,
              timeLeft: interpolate(y, 15000, 0),
            },
          }));
        },
        complete: (y) => {
          this.setState((s) => ({
            ...s,
            currentCard: {
              ...s.currentCard,
              timeLeft: interpolate(y, 15000, 0),
            },
          }));
        },
      }),
    ]);
    this.timerSubscription = run(seq);
  }

  animateButton(e, answer) {
    reactSetState(this, 'answer', answer);
    cancelAnimationFrame(this.timerSubscription.id);
    // TODO: devise a way to listen for the complete event
    // in the button animation, try to keep the button
    // sequence inside the Button component...
    setTimeout(() => {
      if (this.state.currentCard.index < 9) {
        this.initTimer();
        this.setState((s) => ({
          ...s,
          answer: null,
          currentCard: {
            index: s.currentCard.index + 1,
            timeLeft: 15000,
          },
        }));
      } else {
        // run finish animation and
        // navigate to results page
        history.push(routes.RESULTS);
      }
    }, 1000);
  }

  componentDidMount() {
    const countdown = this.countdownRef.current;
    const seq = sequence([
      unit({
        delay: 600,
        update: y => {
          reactSetState(this, 'curtains', { opacity: interpolate(y, 1, 0) });
        },
        complete: y => {
          reactSetState(this, 'curtains', { opacity: interpolate(y, 1, 0) });
        },
      }),
      unit({
        duration: 300,
        ease: easings.SQUARED,
        begin: () => countdown.innerText = 'Get ready',
        update: (y) => {
          countdown.style.transform = `translate(-50%, calc(-50% + ${interpolate(y, -20, 0)}px))`;
          countdown.style.opacity = y;
        },
        complete: (y) => {
          countdown.style.transform = `translate(-50%, calc(-50% + ${interpolate(y, -20, 0)}px))`;
          countdown.style.opacity = y;
        },
      }),
      unit({
        delay: 600,
        duration: 200,
        ease: easings.SQUARED,
        update: (y) => {
          countdown.style.opacity = interpolate(y, 1, 0);
        },
        complete: (y) => {
          countdown.style.opacity = interpolate(y, 1, 0);
        },
      }),
      unit({ duration: 100 }),
      merge(
        unit({
          duration: 300,
          ease: easings.SQUARED,
          begin: (meta) => {
            meta.originalTransform = countdown.style.transform;
            countdown.innerText = 'START!';
            countdown.style.fontSize = '48px';
          },
          update: (y, { originalTransform }) => {
            countdown.style.transform = computeTransform(
              originalTransform,
              `scale(${interpolate(y, 2, 1)}) rotate(${interpolate(y, 10, 0)}deg)`,
            );
          },
          complete: (y, { originalTransform }) => {
            countdown.style.transform = computeTransform(
              originalTransform,
              `scale(${interpolate(y, 2, 1)}) rotate(${interpolate(y, 10, 0)}deg)`,
            );
          },
        }),
        unit({
          duration: 200,
          ease: easings.SQUARED,
          update: (y) => {
            countdown.style.opacity = y;
          },
          complete: (y) => {
            countdown.style.opacity = y;
          },
        }),
      ),
      merge(
        unit({
          duration: 800,
          begin: (meta) => meta.originalTransform = countdown.style.transform,
          update: (y, { originalTransform }) => {
            countdown.style.transform = computeTransform(
              originalTransform,
              `scale(${interpolate(y, 1, 1.03)})`,
            );
          },
          complete: (y, { originalTransform }) => {
            countdown.style.transform = computeTransform(
              originalTransform,
              `scale(${interpolate(y, 1, 1.03)})`,
            );
          },
        }),
        unit({
          delay: 700,
          duration: 300,
          ease: easings.SQUARED,
          update: (y) => {
            countdown.style.opacity = interpolate(y, 1, 0);
          },
          complete: (y) => {
            countdown.style.opacity = interpolate(y, 1, 0);
          },
        }),
      ),
      unit({ begin: this.initTimer }),
    ]);
    run(seq);
  }

  render() {

    return (
      <div
        css={css`
          height: 100%;
        `}
      >
        <div
          style={this.state.curtains}
          css={css`
            pointer-events: none;
            z-index: 2;
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-color: #000620;
            opacity: 0;
          `}
        />
        <div
          ref={this.countdownRef}
          css={css`
            pointer-events: none;
            z-index: 2;
            position: fixed;
            top: 50%;
            left: 50%;
            width: fit-content;
            font: 400 42px/1 sans-serif;
            color: #fff;
            opacity: 0;
          `}
        />
        <div
          css={css`
            height: 100%;
            padding: 40px;
            background-color: #0a1a61;
          `}
        >
          <Timer totalTime="15000" timeLeft={this.state.currentCard.timeLeft} />
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
              >{`Question ${this.state.currentCard.index + 1}`}</span>
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
              >{this.questions[this.state.currentCard.index].category}</h5>
              <h3
                css={css`
                  font: 400 24px/29px VarelaRound;
                  word-break: break-word;
                  color: #fff;
                `}
                dangerouslySetInnerHTML={{ __html: this.questions[this.state.currentCard.index].question.slice(0, 100) }}
              />
            </div>
            <div
              css={css`
                margin: 50px 0 20px;
                height: 100%;
                overflow-y: auto;
              `}
            >
              <QuestionOption
                label="True"
                onClick={(e) => this.animateButton(e, 'True')}
                checked={this.state.answer === "True"}
              />
              <QuestionOption
                label="False"
                onClick={(e) => this.animateButton(e, 'False')}
                checked={this.state.answer === "False"}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Trivia;
