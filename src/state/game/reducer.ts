import { createReducer } from 'redux-create-reducer';
import { ActionType } from 'typesafe-actions';
import * as gameActions from './actions';

export enum Answers {
  TRUE = 'True',
  FALSE = 'False',
  NOT_AVAILABLE = 'N/A',
}

export type Question = {
  index: number;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: Answers;
  incorrect_answers: Array<Answers>;
};

export const NUMBER_OF_QUESTIONS_PER_SESSION = 10;

export interface State {
  // this queue holds the questions we've already
  // fetched but that we haven't yet showed to the
  // player
  queue: Array<Question>;
  // the question to display to the player at any
  // given moment
  current: Question | null;
  // the answers collected from the player
  answers: Array<[Question, Answers]>;
}

export type Actions = ActionType<typeof gameActions>

const initialState: State = {
  queue: [],
  current: null,
  answers: [],
};

export default createReducer<State, Actions>(initialState, {
  [gameActions.ENQUEUE]: (s: State, { payload: qs }) => ({
    ...s,
    queue: s.queue.concat(qs),
  }),
  [gameActions.ANSWER]: (s: State, { payload: answer }) => {
    if (s.current === null) return s;

    let queue = s.queue.concat([]);

    return {
      ...s,
      queue,
      answers: s.answers.concat([[s.current, answer]]),
      current: queue.shift() || null,
    };
  },
  [gameActions.START]: (s: State) => {
    let queue = s.queue.concat([]);

    if (queue.length === 0)
      return s;

    const current = (queue.shift() as Question);

    return {
      ...initialState,
      queue,
      current,
    };
  },
});
