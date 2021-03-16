import { createAsyncAction } from 'typesafe-actions';

export const REQUEST = '@@trivia/resources/questions/REQUEST';
export const SUCCESS = '@@trivia/resources/questions/SUCCESS';
export const FAILURE = '@@trivia/resources/questions/FAILURE';

export const questions = createAsyncAction(
  REQUEST,
  SUCCESS,
  FAILURE,
)<undefined, undefined, undefined>();
