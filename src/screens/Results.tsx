/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import React from 'react';
import { connect } from 'react-redux';
import {
  unit,
  mergeAll,
  sequence,
  interpolate,
  easings,
  directions,
  run,
} from 'tween-fn';
import { routes, history } from '../shared/router';
import { RootState } from 'state/store';
// selectors
import { selectResults } from 'state/game/selectors';
// actions
import { questions } from 'state/resources/questions/actions';
// components
import ResultItem from 'components/ResultItem';
import PlayAgainButton from 'components/PlayAgainButton';

const mapStateToProps = (s: RootState) => ({
  results: selectResults(s),
});
const dispatchProps = {
  request: questions.request,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

class Results extends React.Component<Props> {
  playAgainButtonRef = React.createRef<HTMLDivElement>();
  scoreRef = React.createRef<HTMLDivElement>();
  overlayRef = React.createRef<HTMLDivElement>();
  confettiRootRef = React.createRef<HTMLCanvasElement>();
  score = 0;
  answerRefs: Array<React.RefObject<HTMLDivElement>> = [];
  answers: Array<React.ReactElement> = [];

  constructor(props: Props) {
    super(props);

    for (let i = 0; i < this.props.results.length; i++) {
      this.answerRefs[i] = React.createRef();
    }
    this.answers = this.props.results.map((result, i) => {
      const [question, answer] = result;
      const correct = question.correct_answer === answer;

      if (correct) this.score++;
      
      return (
        <ResultItem
          key={`answer-${i}`}
          ref={this.answerRefs[i]}
          question={question.question}
          answer={question.correct_answer}
          correct={correct}
        />
      );
    });

    this.intro = this.intro.bind(this);
    this.playAgainButtonPulse = this.playAgainButtonPulse.bind(this);
    this.outro = this.outro.bind(this);
  }

  intro() {
    const overlay = (this.overlayRef.current as HTMLDivElement);
    const score = (this.scoreRef.current as HTMLDivElement);
    const seq = sequence([
      unit({
        begin: () => {
          (window as any).confetti.start(this.confettiRootRef.current, null, null, 50);
        },
      }),
      unit({
        delay: 600,
        duration: 200,
        ease: easings.SQUARED,
        change: (y: number) =>  {
          overlay.style.opacity = String(interpolate(y, 1, 0));
        },
      }),
      unit({
        duration: 500,
        ease: easings.SQUARED,
        change: (y: number) => {
          score.style.opacity = String(y);
        },
      }),
      unit({ delay: 300 }),
      mergeAll(this.answerRefs.map(({ current: answer }, i) => unit({
        delay: i * 150,
        duration: 800,
        ease: easings.EASE_OUT_QUINT,
        change: (y: number) => {
          (answer as HTMLDivElement).style.opacity = String(y);
          (answer as HTMLDivElement).style.transform =
            `translateX(${interpolate(y, 50, 0)}px)`;
        },
      }))),
    ]);
    run(seq);
  }

  outro() {
    const overlay = (this.overlayRef.current as HTMLDivElement);
    const seq = sequence([
      unit({
        duration: 300,
        begin: (window as any).confetti.stop(),
        change: (y: number) => {
          overlay.style.opacity = String(y);
        },
      }),
      unit({
        delay: 1000,
        begin: () => {
          (window as any).confetti.remove();
          history.push(routes.GAME);
        },
      }),
    ]);
    run(seq);
  }

  // TODO: move this inside the definition of PlayAgainButton
  playAgainButtonPulse() {
    const button = (this.playAgainButtonRef.current as HTMLDivElement);
    const seq = sequence([
      unit({
        duration: 500,
        iterations: Infinity,
        ease: easings.SQUARED,
        direction: directions.ALTERNATE,
        update: (y: number) => {
          button.style.transform = `scale(${interpolate(y, 1, 1.02)})`;
        },
      }),
    ]);
    run(seq);
  }

  componentDidMount() {
    this.playAgainButtonPulse();
    this.intro();
    // preemptively request new questions in case
    // the player decides to play another round
    this.props.request();
  }

  render() {

    return (
      <React.Fragment>
        <div ref={this.overlayRef} css={css`
          pointer-events: none;
          z-index: 3;
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: #000620;
          opacity: 1;
        `} />
        <canvas ref={this.confettiRootRef} />
        <div
          css={css`
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
              position: relative;
              height: 110px;
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
              >{`${this.score}/10`}</h2>
            </div>
          </div>
          <div
            css={css`
              height: calc(100% - 110px);
              padding-bottom: 60px;
              overflow-y: scroll;
            `}
          >
            {this.answers}
          </div>
          <PlayAgainButton
            ref={this.playAgainButtonRef}
            onClick={this.outro}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchProps)(Results);
