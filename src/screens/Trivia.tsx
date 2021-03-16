/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';
import { connect } from 'react-redux';
import {
  run,
  unit,
  merge,
  interpolate,
  computeTransform,
  sequence,
  easings,
  directions,
} from 'tween-fn';
import { routes, history } from '../shared/router';
import { RootState } from 'state/store';
import { Answers, Question } from 'state/game/reducer';
// actions
import { answer } from 'state/game/actions';
// selectors
import { selectStatus } from 'state/resources/questions/selectors';
import {
  selectDidFinish,
  selectCurrentQuestion,
} from 'state/game/selectors';
// components
import networkGuard from 'components/NetworkGuard';
import Timer from 'components/Timer';
import QuestionOption from 'components/QuestionOption';

// TODO: this should be imported from tween-fn, but the version
// we're using doesn't export it
class Subscription {
  id: number = 0;
  unsubscribe = () => cancelAnimationFrame(this.id)
}

const mapStateToProps = (s: RootState) => ({
  status: selectStatus(s),
  currentQuestion: selectCurrentQuestion(s),
  didFinish: selectDidFinish(s),
});
const dispatchProps = { answer };

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;
type State = {
  timeLeft: number,
  selected: Answers | null,
};

class Trivia extends React.Component<Props, State> {
  countdownRef = React.createRef<HTMLDivElement>();
  overlayRef = React.createRef<HTMLDivElement>();
  counterRef = React.createRef<HTMLDivElement>();
  timerSubscription: Subscription | null = null;
  isButtonPressed = false;
  state = {
    timeLeft: 15000,
    selected: null,
  };

  initTimer = () => {
    const overlay = (this.overlayRef.current as HTMLDivElement);
    const seq = sequence([
      merge(
        unit({
          duration: 15000,
          update: (y: number) => {
            this.setState({ timeLeft: interpolate(y, 15000, 0) });
          },
          complete: (y: number) => {
            this.setState({
              timeLeft: interpolate(y, 15000, 0),
              selected: Answers.NOT_AVAILABLE,
            });
            this.getNextCardOrFinish();
          },
        }),
        unit({
          delay: 11500,
          duration: 500,
          iterations: 7,
          direction: directions.ALTERNATE,
          begin: () => {
            overlay.style.backgroundColor = '#bd04445c';
            overlay.style.opacity = '0';
          },
          update: (y: number) => {
            overlay.style.opacity = String(interpolate(easings.SQUARED(y), 0, 1));
            //counter.style.transform = `translate(-50%, -50%) scale(${interpolate(Math.pow(y, 40), 1, 1.8)})`;
          },
          complete: () => {
            overlay.style.opacity = '0';
            //counter.style.transform = '';
          },
        }),
      ),
    ]);
    this.timerSubscription = run(seq);
  }

  handleButtonClick = (answer: Answers) => {
    // we use this flag to prevent the player from
    // issuing answers when the button animation is
    // playing out, this will reset to false once the
    // animation is finished
    if (this.isButtonPressed) return;
    this.isButtonPressed = true;
    // update state
    this.setState({ selected: answer });
    // we hide the overlay which may be red if the
    // danger animation was playing when the player
    // answered
    Object.assign(
      (this.overlayRef.current as HTMLDivElement).style,
      {
        opacity: '0',
        backgroundColor: '#000620',
      },
    );
    // stop the timer
    this.timerSubscription?.unsubscribe();
  }

  buttonAnimationEndCallback = () => {
    const seq = sequence([
      unit({
        delay: 500,
        begin: () => {
          this.isButtonPressed = false;
          this.getNextCardOrFinish();
        },
      }),
    ]);
    run(seq);
  }

  getNextCardOrFinish = () => {
    // we know that this won't ever be null, but the compiler doesn't
    const selected: unknown = this.state.selected;
    this.props.answer(selected as Answers);

    if (this.props.didFinish)
      this.outro();
    else {
      this.initTimer();
      this.setState({
        timeLeft: 15000,
        selected: null,
      });
    }
  }

  intro = () => {
    const countdown = (this.countdownRef.current as HTMLDivElement);
    const overlay = (this.overlayRef.current as HTMLDivElement);
    // prevent players from issuing answers during the
    // intro animation
    overlay.style.pointerEvents = 'all';
    const seq = sequence([
      unit({
        delay: 600,
        update: (y: number) => {
          overlay.style.opacity = String(interpolate(y, 1, .45));
        },
        complete: (y: number)=> {
          overlay.style.opacity = String(interpolate(y, 1, .45));
        },
      }),
      unit({
        duration: 300,
        ease: easings.SQUARED,
        begin: () => countdown.innerText = 'Get Ready',
        update: (y: number) => {
          countdown.style.transform = `translate(-50%, calc(-50% + ${interpolate(y, -20, 0)}px))`;
          countdown.style.opacity = String(y);
        },
        complete: (y: number) => {
          countdown.style.transform = `translate(-50%, calc(-50% + ${interpolate(y, -20, 0)}px))`;
          countdown.style.opacity = String(y);
        },
      }),
      unit({
        delay: 600,
        duration: 200,
        ease: easings.SQUARED,
        update: (y: number) => {
          countdown.style.opacity = String(interpolate(y, 1, 0));
        },
        complete: (y: number) => {
          countdown.style.opacity = String(interpolate(y, 1, 0));
        },
      }),
      unit({ duration: 100 }),
      merge(
        unit({
          duration: 800,
          ease: easings.EASE_OUT_ELASTIC,
          meta: { originalTransform: '' },
          begin: (meta: { originalTransform: string }) => {
            countdown.innerText = 'START!';
            countdown.style.fontSize = '70px';
            countdown.style.letterSpacing = '2px';
            countdown.style.transform += 'scale(2)';
            meta.originalTransform = countdown.style.transform;
          },
          update: (y: number, { originalTransform }: { originalTransform: string }) => {
            countdown.style.transform = computeTransform(
              originalTransform,
              `scale(${interpolate(y, 2, 1)}) rotate(${interpolate(y, 10, 0)}deg)`,
            );
          },
          complete: (y: number, { originalTransform }: { originalTransform: string }) => {
            countdown.style.transform = computeTransform(
              originalTransform,
              `scale(${interpolate(y, 2, 1)}) rotate(${interpolate(y, 10, 0)}deg)`,
            );
          },
        }),
        unit({
          duration: 200,
          ease: easings.SQUARED,
          update: (y: number) => {
            countdown.style.opacity = String(y);
          },
          complete: (y: number) => {
            countdown.style.opacity = String(y);
          },
        }),
      ),
      unit({
        duration: 300,
        ease: easings.SQUARED,
        update: (y: number) => {
          countdown.style.opacity = String(interpolate(y, 1, 0));
          overlay.style.opacity = String(interpolate(y, .45, 0));
        },
        complete: (y: number) => {
          countdown.style.opacity = String(interpolate(y, 1, 0));
          overlay.style.opacity = String(interpolate(y, .45, 0));
          overlay.style.pointerEvents = 'none';
        },
      }),
      unit({ begin: this.initTimer }),
    ]);
    run(seq);
  }

  outro = () => {
    const countdown = (this.countdownRef.current as HTMLDivElement);
    const overlay = (this.overlayRef.current as HTMLDivElement);
    // prevent players from issuing answers during
    // the outro animation
    overlay.style.pointerEvents = 'none';
    const seq = sequence([
      unit({
        duration: 800,
        ease: easings.EASE_OUT_ELASTIC,
        begin: (meta: { originalTransform: string }) => {
          countdown.innerText = 'FINISH!';
          countdown.style.fontSize = '70px';
          meta.originalTransform = countdown.style.transform;
          overlay.style.backgroundColor = '#000620';
        },
        change: (y: number, { originalTransform }: { originalTransform: string }) => {
          countdown.style.transform = computeTransform(
            originalTransform,
            `rotate(${interpolate(y, 10, 0)}deg) scale(${interpolate(y, 2, 1)})`,
          );
          countdown.style.opacity = String(y);
          overlay.style.opacity = String(interpolate(y, 0, .45));
        },
      }),
      unit({ duration: 800 }),
      unit({
        duration: 200,
        ease: easings.SQUARED,
        begin: () => { overlay.style.zIndex = '2'; },
        update: (y: number) => {
          countdown.style.opacity = String(interpolate(y, 1, 0));
          overlay.style.opacity = String(interpolate(y, .45, 1));
        },
        complete: (y: number) => {
          countdown.style.opacity = String(interpolate(y, 1, 0));
          overlay.style.opacity = String(interpolate(y, .45, 1));
          overlay.style.pointerEvents = 'none';
          history.push(routes.RESULTS);
        },
      }),
    ]);
    run(seq);
  }

  componentDidMount() {
    this.intro();
  }

  shouldComponentUpdate({ didFinish }: Props) {
    // we don't want to re-render if we're done, as the
    // value of this.props.current is null which will
    // cause problems in our render method
    if (didFinish)
      return false;

    return true;
  }

  render() {
    const currentQuestion = this.props.currentQuestion as Question;

    return (
      <div
        css={css`
          height: 100%;
          background-color: #0a1a61;
        `}
      >
        <svg
          css={css`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          `}
          viewBox="0 0 360 640"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g css={css`transform: translate(10%, 50%)`}>
            <path fillRule="evenodd" clipRule="evenodd" d="M100.136 17.5326C115.794 21.6618 130.478 25.4107 145.251 32.0566C164.475 40.7052 191.5 42.387 199.162 62.0816C206.767 81.6319 188.911 101.494 179.567 120.27C171.682 136.117 161.333 149.319 149.302 162.28C134.027 178.738 122.407 208.373 100.136 205.849C77.0548 203.232 74.3462 168.955 58.4274 151.98C46.8212 139.603 29.2703 134.747 20.0753 120.475C8.63303 102.715 -2.08574 82.8403 0.348416 61.8331C3.02308 38.7504 12.5515 12.0476 33.7285 2.64614C54.9912 -6.79337 77.6492 11.6024 100.136 17.5326Z" fill="#122269" />
          </g>
          <g css={css`transform: translate(55%, 60%)`}>
            <path fillRule="evenodd" clipRule="evenodd" d="M168.979 0.701929C203.682 4.94087 228.231 35.2163 251.265 61.5212C269.972 82.8836 282.468 108.314 287.661 136.233C292.337 161.37 283.625 185.412 278.988 210.556C273.457 240.55 279.313 275.53 257.959 297.302C235.816 319.879 200.529 320.616 168.979 322.718C135.267 324.964 100.524 326.104 70.9509 309.76C39.0226 292.114 5.54926 265.704 0.450082 229.575C-4.57185 193.994 33.8248 168.633 46.2747 134.926C57.9398 103.344 47.9552 64.3083 70.6698 39.4613C95.0354 12.8083 133.138 -3.67608 168.979 0.701929Z" fill="#122269" />
          </g>
          <g css={css`transform: translate(-25%, 80%)`}>
            <path fillRule="evenodd" clipRule="evenodd" d="M120.709 0.101295C147.716 1.35059 171.543 16.4645 192.3 33.7802C211.899 50.1303 231.527 69.9211 234.746 95.2338C237.791 119.166 212.499 136.981 208.452 160.765C203.202 191.623 231.466 231.631 208.01 252.37C185.38 272.379 150.808 240.967 120.709 238.346C94.529 236.066 65.768 252.488 43.8017 238.071C21.722 223.579 19.976 192.73 12.5884 167.382C5.45956 142.922 -3.88126 118.478 1.70206 93.6201C7.62063 67.2693 22.8946 43.6183 44.1357 26.9265C65.9313 9.79891 93.0132 -1.17983 120.709 0.101295Z" fill="#122269" />
          </g>
        </svg>
        <div css={css`
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0) 73.44%, rgba(255, 255, 255, 0.1) 100%), #0A1A61;
          opacity: .5;
        `} />
        <div
          css={css`
            position: fixed;
            height: 100%;
            width: 100%;
            padding: 10%;
          `}
        >
          <Timer
            ref={this.counterRef}
            totalTime={15000}
            timeLeft={this.state.timeLeft}
          />
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
              >{`Question ${currentQuestion.index + 1}`}</span>
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
              >{currentQuestion.category}</h5>
              <h3
                css={css`
                  font: 400 24px/29px VarelaRound;
                  word-break: break-word;
                  color: #fff;
                `}
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
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
                onClick={() => this.handleButtonClick(Answers.TRUE)}
                onAnimationEnd={this.buttonAnimationEndCallback}
                checked={this.state.selected === Answers.TRUE}
              />
              <QuestionOption
                label="False"
                onClick={() => this.handleButtonClick(Answers.FALSE)}
                onAnimationEnd={this.buttonAnimationEndCallback}
                checked={this.state.selected === Answers.FALSE}
              />
            </div>
          </div>
        </div>
        <div
          ref={this.overlayRef}
          css={css`
            pointer-events: none;
            z-index: 1;
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-color: #000620;
            opacity: 1;
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
            font: 400 32px/1 'FredokaOne', sans-serif;
            text-shadow: 0px 4px 3px #00000066;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #fff;
            opacity: 0;
          `}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  dispatchProps,
)(networkGuard<Props>(Trivia));
