import { createAction } from 'typesafe-actions';
import { Answers, Question } from './reducer';

export const ENQUEUE = '@@trivia/game/ENQUEUE';
export const ANSWER = '@@trivia/game/ANSWER';
export const START = '@@trivia/game/START';

// store questions
export const enqueue = createAction(ENQUEUE)<Array<Question>>();
// insert answer for current question and dequeue next one
export const answer = createAction(ANSWER)<Answers>();
// reset answers and prepare the first question
export const start = createAction(START)();
