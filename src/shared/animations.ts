const noop = () => {};

const easings = {
  LINEAR: (x) => x,
  SQUARED: (x) => Math.pow(x, 2),
};

class Tween {
  complete: boolean = false;
  constructor({
    from = 0,
    to = 1,
    delay = 0,
    duration = 200,
    ease = easings.LINEAR,
    begin = noop,
    update = noop,
    complete = noop,
    meta = {},
  } = {}) {
    this.from = from;
    this.to = to;
    this.delay = delay;
    this.duration = duration;
    this.ease = ease;
    this.begin = begin;
    this.update = update;
    this.complete = complete;
    this.meta = meta;
    this.delta = to - from;
    this.begun = false;
  }

  tick(elapsed: number) {
    // calculate elapsed using delay offset
    elapsed -= this.delay;
    if (elapsed < 0) // it isn't our time yet
      return;
    else if (!this.begun) {
      this.begun = true;
      this.begin(this.meta);
    }
    const progress = Math.min(elapsed / this.duration, 1);
    const value = (this.ease(progress) * this.delta) + this.from;

    if (progress === 1) {
      this.complete(value, this.meta);
      this.completed = true;
    } else
      this.update(value, this.meta);
  }
}

class TweenPair extends Tween {
  a: Tween;
  b: Tween;

  constructor(a, b, opts) {
    super(opts);
    this.a = a;
    this.b = b;
    const totalDurationA = a.duration + a.delay;
    const totalDurationB = b.duration + b.delay;
    this.duration = Math.max(
      totalDurationA,
      totalDurationB,
    );
  }

  tick(elapsed: number) {
    // calculate elapsed using delay offset
    elapsed -= this.delay;
    if (elapsed < 0) // it isn't our time yet
      return;

    if (!this.a.completed)
      this.a.tick(elapsed);
    if (!this.b.completed)
      this.b.tick(elapsed);

    if (this.a.completed && this.b.completed) {
      this.complete();
      this.completed = true;
    }
  }
}

const unit = (options): Tween => (
  new Tween(options)
);
const merge = (a: Tween, b: Tween): Tween => (
  new TweenPair(a, b)
);
const sequence = (ts: Array<Tween>): Iterator<Tween> => (
  ts[Symbol.iterator]()
);

function run(ts) {
  let startTime = performance.now();
  let { value: tween } = ts.next();
  let subscription = {
    id: null,
  };

  const tick = (currentTime) => {
    const elapsed = currentTime - startTime;

    tween.tick(elapsed);

    if (tween.completed) {
      const { value, done } = ts.next();

      if (!done) {
        tween = value;
        startTime = currentTime;
      } else {
        subscription.id = null;
        return;
      }
    }

    subscription.id = requestAnimationFrame(tick);
  };

  subscription.id = requestAnimationFrame(tick);

  // return a reference to the current frame id
  return subscription;
}

const valueReg = /\d+\w+/g;
const getTransformValues = (f: string): Array<string> => (
  f.match(valueReg)
);
const unitValueReg = /(\d+|\w+)/g;
const getUnitAndValue = (v: string): Array<string> => (
  v.match(unitValueReg)
);

const computeTransform = (target: string, transform: string): string => {
  const transformArray = target.split(" ");
  const transformIndex = transformArray.findIndex(s => (
    s.split("(")[0] === transform.split("(")[0]
  ));
  if (transformIndex > 0) {
    const oldValues = getTransformValues(transformArray[transformIndex]);
    const newValues = getTransformValues(transform);

    while (oldValues.length < newValues.length) {
      oldValues.push("0");
    }

    const computedNewValues = oldValues.map((value, i) => {
      if (typeof newValues[i] !== "undefined")
        // this will get nasty quick as recursive calc calls are
        // created
        return `calc(${value} + ${newValues[i]}`;
      else
        return value;
    });
  }

  // return the joined transformArray
  return target.split(" ")
    .filter(s => s.split("(")[0] !== transform.split("(")[0])
    .concat([transform])
    .join(" ");
};

const interpolate = (progress: number, from: number, to: number): number => (
  from + ((to - from) * progress)
);

export {
  run,
  unit,
  merge,
  interpolate,
  computeTransform,
  sequence,
  easings,
};
