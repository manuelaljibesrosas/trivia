import { createAction } from 'typesafe-actions';

export const RESET = '@@trivia/global/RESET';

export const reset = createAction(RESET)();