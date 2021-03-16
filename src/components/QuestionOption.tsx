/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';
import {
  run,
  unit,
  merge,
  interpolate,
  computeTransform,
  sequence,
  easings,
} from 'tween-fn';

type Props = {
  onClick: () => void;
  onAnimationEnd: () => void;
  label: string;
  checked: boolean;
}

class QuestionOption extends React.Component<Props> {
  tick = React.createRef<SVGPathElement>();
  tickBg = React.createRef<HTMLDivElement>();

  componentDidUpdate({ checked }: Props) {
    if (!checked && this.props.checked) {
      const buttonCheckedSeq = sequence([
        merge(
          unit({
            duration: 280,
            ease: easings.QUART,
            meta: { originalTransform: 'translate(-50%, -50%)' },
            change: (y, { originalTransform }) => {
              if (this.tickBg.current)
                this.tickBg.current.style.transform = computeTransform(
                  originalTransform,
                  `scale(${y})`,
                );
            },
          }),
          unit({
            duration: 380,
            ease: easings.QUINT,
            update: (y) => {
              if (this.tick.current)
                this.tick.current.style.strokeDashoffset = String(interpolate(y, 19.55, 0));
            },
            complete: (y) => {
              if (this.tick.current)
                this.tick.current.style.strokeDashoffset = String(interpolate(y, 19.55, 0));
              this.props.onAnimationEnd();
            },
          }),
        ),
      ]);

      run(buttonCheckedSeq);
    }
  }

  render() {
    return (
      <div
        style={{ borderColor: (this.props.checked) ? 'aliceblue' : '#6e7dc6' }}
        onClick={this.props.onClick}
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
        <span>{this.props.label}</span>
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
            this.props.checked && (
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

export default QuestionOption;
