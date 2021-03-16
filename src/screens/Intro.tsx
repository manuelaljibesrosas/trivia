/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';
import { history, routes } from '../shared/router';
import {
  interpolatePath,
  directions,
  mergeAll,
  interpolate,
  unit,
  sequence,
  run,
  easings,
} from 'tween-fn';

// TODO: this should be imported from tween-fn, but the version
// we're using doesn't export it
class Subscription {
  id: number = 0;
  unsubscribe = () => cancelAnimationFrame(this.id)
}

// TODO: extract the background into a standalone component
class Intro extends React.PureComponent {
  // we use this flag to ignore click events when
  // the outro animation is playing
  private isTransitioning = false;
  private subscription: Subscription | null = null;
  private titleRef = React.createRef<HTMLHeadingElement>();
  private blob1Ref = React.createRef<SVGPathElement>();
  private blob2Ref = React.createRef<SVGPathElement>();
  private blob3Ref = React.createRef<SVGPathElement>();
  private blob4Ref = React.createRef<SVGPathElement>();
  private blob5Ref = React.createRef<SVGPathElement>();
  private overlayRef = React.createRef<HTMLDivElement>();
  private handRef = React.createRef<SVGSVGElement>();
  private circle1Ref = React.createRef<SVGCircleElement>();
  private circle2Ref = React.createRef<SVGCircleElement>();

  outro = () => {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    const overlay = this.overlayRef.current;

    const seq = sequence([
      unit({
        duration: 300,
        update: (y: number) => { (overlay as HTMLDivElement).style.opacity = String(y); },
        complete: () => { history.push(routes.GAME); },
      }),
    ]);
    run(seq);
  };

  intro = () => {
    const title = this.titleRef.current;
    const blob1 = this.blob1Ref.current;
    const blob2 = this.blob2Ref.current;
    const blob3 = this.blob3Ref.current;
    const blob4 = this.blob4Ref.current;
    const blob5 = this.blob5Ref.current;
    const hand = this.handRef.current;
    const circle1 = this.circle1Ref.current;
    const circle2 = this.circle2Ref.current;

    const seq = sequence([
      mergeAll([
        // background
        unit({
          iterations: Infinity,
          direction: directions.ALTERNATE,
          duration: 7000,
          meta: {
            originalPath: (blob1 as SVGPathElement).getAttribute('d'),
            targetPath: 'M187.5 423.5C125.465 376.957 259.534 260.388 211.5 199.5C164.425 139.828 62.2887 215.806 30 147C3.43603 90.3935 104.285 25.1198 150.5 -17C184.109 -47.6308 237.527 -68.5173 283 -68.5C327.958 -68.4829 363.566 -64.5922 404.5 -46C434.87 -32.2056 443.429 7.31229 473.891 20.9022C526.405 44.3297 593.944 57.9389 616 111.043C638.413 165.005 619.906 234.943 580.838 278.393C542.964 320.514 493 350 448 377C390.051 403.977 238.63 461.861 187.5 423.5Z',
          },
          update: (y: number, { originalPath, targetPath }: { originalPath: string, targetPath: string }) => {
            const path = interpolatePath(y, originalPath, targetPath);
            (blob1 as SVGPathElement).setAttribute('d', path);
          },
        }),
        unit({
          iterations: Infinity,
          direction: directions.ALTERNATE,
          duration: 3000,
          meta: {
            originalPath: (blob3 as SVGPathElement).getAttribute('d'),
            targetPath: 'M30.7455 120.714C10.6831 103.631 20.9863 86.1989 30.7454 61.9085C38.9374 41.5189 55.0417 24.9011 77.0932 24.4092C103.429 23.8216 131.293 34.4652 139.599 59.48C148.587 86.5507 133.373 103.187 110.028 119.368C86.0998 135.953 53.0555 139.712 30.7455 120.714Z',
          },
          update: (y: number, { originalPath, targetPath }: { originalPath: string, targetPath: string }) => {
            const path = interpolatePath(y, originalPath, targetPath);
            (blob3 as SVGPathElement).setAttribute('d', path);
          },
        }),
        unit({
          iterations: Infinity,
          direction: directions.ALTERNATE,
          duration: 5000,
          meta: {
            originalPath: (blob4 as SVGPathElement).getAttribute('d'),
            targetPath: 'M277.211 36.7334C285.59 49.4459 291.119 66.2745 277.949 89.5877C265.255 112.058 173.421 129.755 151.949 152.458C133.02 172.472 153.049 209.053 151.949 236.958C150.849 264.862 139.939 267.981 118.411 272.482C98.5249 276.64 82.8371 275.016 70.0343 270.245C57.3652 265.523 47.5884 258.068 45.2713 245.224C42.8621 231.869 68.525 193.344 76.9489 174.957C86.5987 153.896 95.0385 141.562 118.411 120.642C141.837 99.6731 149.142 103.341 175.762 89.5877C203.917 75.0408 206.035 21.2175 230.206 17.1525C255.154 12.9567 268.657 23.7545 277.211 36.7334Z',
          },
          update: (y: number, { originalPath, targetPath }: { originalPath: string, targetPath: string }) => {
            const path = interpolatePath(y, originalPath, targetPath);
            (blob4 as SVGPathElement).setAttribute('d', path);
          },
        }),
        unit({
          iterations: Infinity,
          direction: directions.ALTERNATE,
          duration: 7000,
          meta: {
            originalPath: (blob2 as SVGPathElement).getAttribute('d'),
            targetPath: 'M185 29.5C191.463 34.3942 219.176 36.7392 227.195 37.9246C243.865 40.3884 257.357 43.0526 267.513 56.5C276.775 68.7639 272.547 76.7906 267.513 91.3111C262.588 105.517 234.54 120.381 227.195 133.5C212.671 159.442 219.5 185.5 187.5 206C155.5 226.5 126.662 219 105.5 197.5C84.4067 176.07 85.3308 140.552 74.5 112.5C62.5638 81.5854 14.5 91.3111 2 37.9246C-10.5 -15.4619 61.8608 -44.2432 94 -41C132.419 -37.1232 154.215 6.1886 185 29.5Z'
          },
          update: (y: number, { originalPath, targetPath }: { originalPath: string, targetPath: string }) => {
            const path = interpolatePath(y, originalPath, targetPath);
            (blob2 as SVGPathElement).setAttribute('d', path);
          },
        }),
        unit({
          iterations: Infinity,
          direction: directions.ALTERNATE,
          duration: 7000,
          meta: {
            originalPath: (blob5 as SVGPathElement).getAttribute('d'),
            targetPath: 'M42.5 6.50002C64.5 0.455664 95.7671 -6.15868 121.964 12.5444C148.253 31.3136 166.994 62.8787 167.931 95.1819C168.795 124.965 151.868 160.759 138.95 187.604C128.486 209.35 118.281 221.952 99.5899 237.206C80.5812 252.718 53.7439 251.905 29.2213 251.395C5.18001 250.895 -29.3375 249.515 -50 237.206C-72.2517 223.95 -88.6706 210.115 -101.5 187.604C-117.151 160.144 -131.122 121.369 -120.37 91.6439C-109.592 61.8485 -53.6956 85.5417 -27 68.5C-2.5793 52.9106 20.5 12.5444 42.5 6.50002Z',
          },
          update: (y: number, { originalPath, targetPath }: { originalPath: string, targetPath: string }) => {
            const path = interpolatePath(y, originalPath, targetPath);
            (blob5 as SVGPathElement).setAttribute('d', path);
          },
        }),
        // title
        unit({
          delay: 500,
          ease: easings.LINEAR,
          duration: 500,
          change: (y: number) => { (title as HTMLHeadingElement).style.opacity = String(y); }
        }),
        // hand
        unit({
          ease: easings.SQUARED,
          delay: 1000,
          duration: 500,
          change: (y: number) => {
            (hand as SVGSVGElement).style.opacity = String(interpolate(y, 0, 1));
          },
        }),
        unit({
          iterations: Infinity,
          ease: easings.EASE_OUT_QUINT,
          duration: 1800,
          update: (y: number) => {
            (circle1 as SVGCircleElement).setAttribute('r', String(interpolate(y, 10, 30)));
            (circle1 as SVGCircleElement).style.opacity = String(interpolate(y, 1, .0));
          },
        }),
        unit({
          iterations: Infinity,
          ease: easings.EASE_OUT_QUINT,
          delay: 180,
          duration: 1800,
          update: (y: number) => {
            (circle2 as SVGCircleElement).setAttribute('r', String(interpolate(y, 10, 20)));
            (circle2 as SVGCircleElement).style.opacity = String(interpolate(y, .8, 0));
          },
        }),
      ]),
    ]);
    this.subscription = run(seq);
  }

  componentDidMount() {
    this.intro();
  }

  componentWillUnmount() {
    if (this.subscription !== null)
      this.subscription.unsubscribe();
  }

  render() {
    return (
      <div
        onClick={this.outro}
        css={css`
          position: relative;
          height: 100%;
          background: #1233c8;
        `}
      >
        <svg width="100%" height="100%" viewBox="0 0 360 538" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            ref={this.blob1Ref}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M191 442C128.965 395.457 231.034 277.888 183 217C135.925 157.328 70.49 208.882 38.2013 140.076C11.6373 83.4697 90.6594 8.14089 136.875 -33.9789C170.484 -64.6097 235.527 -93.5173 281 -93.5C325.958 -93.4829 373.566 -102.092 414.5 -83.5C444.87 -69.7057 467.038 -63.5899 497.5 -50C550.014 -26.5725 593.944 57.939 616 111.043C638.413 165.005 619.906 234.943 580.838 278.393C542.964 320.514 494 366 449 393C391.051 419.977 242.13 480.361 191 442Z"
            fill="#B6A1D1"
            css={css`transform: translate(0px, -50px)`}
          ></path>
          <path
            ref={this.blob2Ref}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M152.518 36.4145C158.981 41.3087 168.176 36.7392 176.195 37.9246C192.865 40.3884 214.498 33.629 224.653 47.0763C233.915 59.3402 221.547 76.7906 216.513 91.3111C211.588 105.517 203.192 117.039 195.847 130.159C181.323 156.101 179.52 193.174 152.518 205.614C125.119 218.236 92.0947 206.5 70.9323 185C49.8391 163.57 62.5974 131.307 51.7666 103.255C39.8304 72.3402 -4.04036 53.9078 0.300947 21.0542C4.53294 -10.9721 38.7931 -45.0283 70.9323 -41.7852C109.351 -37.9083 121.733 13.1031 152.518 36.4145Z"
            fill="#F0E9E4"
            css={css`transform: translate(185px, -50px)`}
          ></path>
          <path
            ref={this.blob3Ref}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M38.6274 133.749C18.565 116.665 26.1732 86.8875 35.9324 62.597C44.1243 42.2074 60.2287 25.5897 82.2802 25.0977C108.616 24.5102 136.48 35.1537 144.786 60.1686C153.774 87.2393 141.255 116.222 117.91 132.403C93.9816 148.988 60.9374 152.746 38.6274 133.749Z"
            fill="#C874D6"
            css={css`transform: translate(180px, 220px)`}
          ></path>
          <path
            ref={this.blob4Ref}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M298.441 60.8297C306.82 73.5423 312.349 90.3709 299.178 113.684C286.484 136.154 190.285 127.989 168.813 150.692C149.883 170.706 146.1 202.095 145 230C143.9 257.905 132.99 261.023 111.462 265.524C91.5758 269.682 75.888 268.058 63.0853 263.287C50.4162 258.565 40.6394 251.111 38.3223 238.267C35.9131 224.911 41.3007 207.61 49.7246 189.224C59.3744 168.162 67.1179 145.324 90.4901 124.404C113.916 103.435 142.193 96.3838 168.813 82.6302C196.968 68.0833 227.264 45.3139 251.435 41.2489C276.383 37.0531 289.886 47.8509 298.441 60.8297Z"
            fill="#C874D6"
            css={css`transform: translate(140px, 370px)`}
          ></path>
          <path
            ref={this.blob5Ref}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M59.2715 16.5451C90.9308 10.7742 125.817 14.2368 152.014 32.9399C178.303 51.7091 197.045 83.2742 197.981 115.577C198.845 145.361 181.918 181.154 169 208C158.536 229.746 148.332 242.348 129.64 257.601C110.631 273.113 83.7941 272.3 59.2715 271.79C35.2302 271.29 11.6592 267.026 -9.00327 254.717C-31.255 241.462 -48.5588 222.422 -61.3882 199.911C-77.0389 172.45 -101.072 141.765 -90.3193 112.039C-79.5418 82.2441 -38.488 79.8403 -11.7924 62.7986C12.6283 47.2092 30.774 21.7397 59.2715 16.5451Z"
            fill="#FFACEC"
            css={css`transform: translate(-15px, 370px)`}
          ></path>
        </svg>
        <div
          ref={this.overlayRef}
          css={css`
            pointer-events: none;
            z-index: 10;
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
          css={css`
            transform: translate(-50%, calc(-50% - 15px));
            position: absolute;
            top: 50%;
            left: 50%;
            text-align: center;
          `}
        >
          <h1
            ref={this.titleRef}
            css={css`
              position: relative;
              margin-bottom: 50px;
              font-family: 'FredokaOne', sans-serif;
              font-size: 10vh;
              font-weight: 400;
              text-transform: uppercase;
              line-height: 1;
              color: #fff;
              opacity: 0;
              &:before {
                content: "Super Trivia App";
                transform: translate(-50%, calc(-50% + 8px));
                position: absolute;
                top: 50%;
                left: 50%;
                opacity: .5;
              }
            `}
          >{'Super Trivia App'}</h1>
          <svg ref={this.handRef} css={css`opacity: 0`} width="100" height="121" viewBox="0 -10 69 121" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path transform="translate(8 20)" d="M36 78L34.143 78.7428C34.5273 79.7033 35.5807 80.2123 36.5721 79.9164L36 78ZM22 60L20.628 61.4552L20.6871 61.5109L20.7506 61.5617L22 60ZM69.5 68L70.0721 69.9164C70.5863 69.7629 71.0173 69.4092 71.2681 68.9347C71.5189 68.4603 71.5686 67.905 71.4059 67.3936L69.5 68ZM68 47L69.9696 46.6524L69.9582 46.5879L69.9426 46.5243L68 47ZM4.5 43.5L5.87202 42.0448C5.86078 42.0342 5.84941 42.0237 5.83793 42.0134L4.5 43.5ZM12.5 35.5L11.3 37.1L11.3068 37.1051L11.3136 37.1101L12.5 35.5ZM22 42.5L20.8136 44.1101C21.4978 44.6143 22.4259 44.6309 23.1278 44.1517C23.8297 43.6724 24.152 42.8019 23.9315 41.9811L22 42.5ZM13 8.99999L14.9315 8.48108L14.9274 8.46578L14.923 8.45055L13 8.99999ZM24.5 7L22.5658 7.50899L22.5669 7.51287L24.5 7ZM29.0669 32.0129C29.3501 33.0805 30.4452 33.7164 31.5129 33.4331C32.5805 33.1499 33.2164 32.0548 32.9331 30.9871L29.0669 32.0129ZM29.5 23.5L27.5044 23.367L27.5 23.4334V23.5H29.5ZM40 21L38.0388 21.3922L38.0506 21.451L38.0659 21.509L40 21ZM42.5 30.5L40.5659 31.009C40.8408 32.0539 41.896 32.6915 42.9489 32.449C44.0018 32.2065 44.6717 31.1716 44.4619 30.1117L42.5 30.5ZM41.5 23L43.4846 23.2481L43.5 23.1245V23H41.5ZM51.5 22L53.3974 21.3675L53.383 21.3244L53.3667 21.282L51.5 22ZM54 29.5L52.1026 30.1325C52.4482 31.1691 53.5618 31.7365 54.6036 31.4067C55.6454 31.0769 56.2297 29.972 55.9157 28.9253L54 29.5ZM53 22L54.9612 22.3922L53 22ZM62 22.5L63.9426 22.0243L63.8892 21.8063L63.7889 21.6056L62 22.5ZM37.857 77.2572C35.7267 71.9315 32.0426 67.2225 28.9696 63.8934C27.4217 62.2165 26.0029 60.8621 24.9681 59.9243C24.4501 59.4549 24.027 59.0887 23.7304 58.8373C23.582 58.7116 23.4651 58.6145 23.3836 58.5475C23.3429 58.514 23.311 58.4881 23.2885 58.4698C23.2772 58.4607 23.2683 58.4535 23.2618 58.4482C23.2585 58.4456 23.2558 58.4434 23.2538 58.4418C23.2527 58.4409 23.2519 58.4402 23.2511 58.4396C23.2508 58.4393 23.2503 58.439 23.2502 58.4389C23.2498 58.4385 23.2494 58.4383 22 60C20.7506 61.5617 20.7503 61.5615 20.7501 61.5613C20.7501 61.5613 20.7499 61.5611 20.7498 61.5611C20.7497 61.561 20.7497 61.561 20.7499 61.5612C20.7503 61.5615 20.7512 61.5622 20.7528 61.5635C20.7559 61.566 20.7614 61.5704 20.7691 61.5767C20.7847 61.5893 20.8095 61.6095 20.843 61.637C20.9099 61.6921 21.0118 61.7767 21.1447 61.8892C21.4105 62.1144 21.7999 62.4513 22.282 62.8882C23.2471 63.7629 24.5783 65.0335 26.0304 66.6065C28.9574 69.7775 32.2733 74.0684 34.143 78.7428L37.857 77.2572ZM36.5721 79.9164L70.0721 69.9164L68.9279 66.0835L35.4279 76.0835L36.5721 79.9164ZM71.4059 67.3936C69.742 62.1644 69.7639 59.3072 69.9922 56.7396C70.2312 54.05 70.777 51.2277 69.9696 46.6524L66.0304 47.3476C66.723 51.2723 66.2688 53.45 66.0079 56.3854C65.7361 59.4427 65.758 62.8356 67.5942 68.6064L71.4059 67.3936ZM23.372 58.5448L5.87202 42.0448L3.12797 44.9552L20.628 61.4552L23.372 58.5448ZM5.83793 42.0134C5.01721 41.2748 4.77036 40.4969 4.7956 39.7901C4.82279 39.0288 5.17759 38.1931 5.83407 37.4929C7.122 36.1191 9.2389 35.5542 11.3 37.1L13.7 33.9C9.7611 30.9458 5.37799 32.1309 2.91592 34.7571C1.69741 36.0569 0.864707 37.7837 0.798149 39.6474C0.72964 41.5656 1.48279 43.4752 3.16207 44.9866L5.83793 42.0134ZM11.3136 37.1101L20.8136 44.1101L23.1864 40.8899L13.6864 33.8899L11.3136 37.1101ZM23.9315 41.9811L14.9315 8.48108L11.0685 9.5189L20.0685 43.0189L23.9315 41.9811ZM14.923 8.45055C14.5876 7.27637 14.8346 6.45144 15.2746 5.86201C15.7572 5.21544 16.5997 4.69467 17.6422 4.48616C19.7166 4.07129 21.8926 4.95046 22.5658 7.50899L26.4341 6.49101C25.1074 1.44954 20.5334 -0.171294 16.8578 0.563836C15.0253 0.93032 13.2428 1.89705 12.0692 3.46923C10.8529 5.09855 10.4124 7.22361 11.0769 9.54943L14.923 8.45055ZM22.5669 7.51287L29.0669 32.0129L32.9331 30.9871L26.4331 6.48713L22.5669 7.51287ZM31 31.5C32.9331 30.9871 32.9331 30.9872 32.9332 30.9873C32.9332 30.9872 32.9332 30.9873 32.9332 30.9873C32.9331 30.9872 32.9331 30.9871 32.9331 30.9869C32.9329 30.9865 32.9327 30.9857 32.9325 30.9846C32.9319 30.9824 32.9309 30.9789 32.9297 30.974C32.9271 30.9643 32.9232 30.9495 32.918 30.9296C32.9076 30.8899 32.8921 30.8305 32.8723 30.7534C32.8326 30.5993 32.7755 30.3751 32.7068 30.0982C32.5691 29.5436 32.386 28.7817 32.2034 27.9506C31.8206 26.2085 31.5 24.4201 31.5 23.5H27.5C27.5 24.9261 27.9294 27.1377 28.2966 28.809C28.489 29.6846 28.6809 30.4828 28.8245 31.0616C28.8964 31.3514 28.9565 31.5873 28.9988 31.7515C29.02 31.8337 29.0367 31.898 29.0483 31.9423C29.0541 31.9644 29.0586 31.9815 29.0617 31.9934C29.0633 31.9993 29.0645 32.0039 29.0654 32.0072C29.0658 32.0088 29.0661 32.0101 29.0664 32.0111C29.0665 32.0115 29.0666 32.0119 29.0667 32.0122C29.0667 32.0124 29.0668 32.0125 29.0668 32.0126C29.0668 32.0128 29.0669 32.0129 31 31.5ZM31.4956 23.633C31.6806 20.857 33.3072 19.7398 34.8168 19.5463C36.5513 19.3239 37.8057 20.2264 38.0388 21.3922L41.9612 20.6078C41.1943 16.7736 37.4487 15.1761 34.3082 15.5787C30.9428 16.0102 27.8194 18.643 27.5044 23.367L31.4956 23.633ZM38.0659 21.509L40.5659 31.009L44.4341 29.991L41.9341 20.491L38.0659 21.509ZM42.5 30.5C44.4619 30.1117 44.462 30.1118 44.462 30.1118C44.462 30.1118 44.462 30.1118 44.4619 30.1117C44.4619 30.1116 44.4619 30.1115 44.4618 30.1112C44.4617 30.1107 44.4616 30.1098 44.4613 30.1086C44.4608 30.1061 44.4601 30.1022 44.459 30.0969C44.4569 30.0863 44.4538 30.0703 44.4496 30.049C44.4413 30.0065 44.429 29.9432 44.4134 29.8617C44.382 29.6986 44.3373 29.463 44.284 29.1752C44.1774 28.5987 44.0376 27.8172 43.9039 26.9926C43.7697 26.164 43.6448 25.3112 43.5652 24.5863C43.5253 24.2235 43.4988 23.9104 43.4869 23.6586C43.481 23.5334 43.4792 23.4333 43.4802 23.3568C43.4812 23.2764 43.485 23.2442 43.4846 23.2481L39.5154 22.7519C39.4353 23.3934 39.5069 24.2743 39.5891 25.0231C39.6794 25.845 39.8163 26.7735 39.9554 27.6324C40.0953 28.4953 40.2406 29.3075 40.3508 29.9029C40.4059 30.201 40.4524 30.4459 40.4853 30.6168C40.5017 30.7023 40.5148 30.7694 40.5238 30.8155C40.5283 30.8386 40.5318 30.8564 40.5342 30.8686C40.5354 30.8747 40.5363 30.8794 40.537 30.8827C40.5373 30.8844 40.5375 30.8857 40.5377 30.8866C40.5378 30.8871 40.5379 30.8874 40.5379 30.8877C40.538 30.8879 40.538 30.888 40.538 30.8881C40.538 30.8882 40.5381 30.8883 42.5 30.5ZM43.5 23C43.5 21.9021 44.4976 20.67 46.0081 20.3247C46.6946 20.1678 47.365 20.2384 47.9416 20.546C48.5056 20.8467 49.1519 21.4662 49.6333 22.718L53.3667 21.282C52.5981 19.2838 51.3694 17.8408 49.824 17.0165C48.2913 16.1991 46.6179 16.0822 45.1169 16.4253C42.2524 17.08 39.5 19.5979 39.5 23H43.5ZM49.6026 22.6325L52.1026 30.1325L55.8974 28.8675L53.3974 21.3675L49.6026 22.6325ZM54 29.5C55.9157 28.9253 55.9157 28.9255 55.9158 28.9257C55.9158 28.9257 55.9158 28.9259 55.9158 28.9259C55.9159 28.9261 55.9159 28.9261 55.9159 28.9261C55.9159 28.9261 55.9158 28.9258 55.9156 28.9251C55.9152 28.9239 55.9145 28.9215 55.9135 28.9179C55.9114 28.9108 55.9079 28.8991 55.9032 28.883C55.8938 28.8508 55.8795 28.8013 55.8611 28.7361C55.8242 28.6057 55.7711 28.4134 55.7084 28.1736C55.5825 27.6925 55.4203 27.0286 55.2737 26.2953C54.9577 24.7152 54.7988 23.2043 54.9612 22.3922L51.0388 21.6078C50.7012 23.2957 51.0423 25.5348 51.3513 27.0797C51.5172 27.9089 51.6987 28.6513 51.8385 29.1857C51.9086 29.4538 51.9688 29.6717 52.012 29.8245C52.0336 29.9009 52.051 29.9612 52.0633 30.0035C52.0695 30.0246 52.0744 30.0413 52.078 30.0532C52.0797 30.0592 52.0812 30.064 52.0822 30.0676C52.0828 30.0694 52.0832 30.0709 52.0836 30.0721C52.0837 30.0726 52.0839 30.0732 52.084 30.0736C52.0841 30.0738 52.0842 30.0741 52.0842 30.0742C52.0843 30.0745 52.0843 30.0747 54 29.5ZM54.9612 22.3922C55.0888 21.754 55.7474 21.1 56.8925 21.0614C57.9217 21.0266 59.2929 21.5579 60.2111 23.3944L63.7889 21.6056C62.2071 18.4421 59.4283 16.9734 56.7575 17.0636C54.2026 17.15 51.6112 18.746 51.0388 21.6078L54.9612 22.3922ZM60.0574 22.9757L66.0574 47.4757L69.9426 46.5243L63.9426 22.0243L60.0574 22.9757Z" fill="white"/>
            <circle ref={this.circle1Ref} cx="25" cy="25" r="10" strokeWidth="5px" stroke="white"></circle>
            <circle ref={this.circle2Ref} cx="25" cy="25" r="10" strokeWidth="5px" stroke="white"></circle>              
          </svg>
        </div>
        <div
          css={css`
            transform: translateX(-50%);
            position: absolute;
            left: 50%;
            bottom: 30px;
            width: fit-content;
            font-family: VarelaRound;
            font-size: 14px;
            line-height: 1;
            text-align: center;
            color: #fff;
          `}
        >{'terms of service | privacy policy'}</div>
      </div>
    );
  }
}

export default Intro;
