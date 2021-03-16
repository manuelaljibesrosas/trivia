import { combineEpics, ofType, Epic } from 'redux-observable';
import { Observable, iif, of, from } from 'rxjs';
import {
  mergeMap,
  map,
  repeat,
  retry,
  scan,
  takeWhile,
  catchError,
  takeLast,
  tap,
} from 'rxjs/operators';
import { Dependencies, RootState, RootAction } from 'state/store';
import { REQUEST, questions } from './actions';
import { NUMBER_OF_QUESTIONS_PER_SESSION, Question } from 'state/game/reducer';
import { enqueue, start as startGame } from 'state/game/actions';

// TODO: persist this using localstorage or something
let token: string = '';
const tokenIsAvailable = () => token.length !== 0;
export const removeLongQuestions = (qs: Array<Question>): Array<Question> => (
  qs.filter(({ question }) => question.length <= 100)
);

type TokenResponse = {
  token: string,
};

type QuestionsResponse = {
  results: Array<Question>,
};

export const fetchQuestionsEpic: Epic<RootAction, RootAction, RootState, Dependencies> = (
  action$: Observable<RootAction>,
  state$: Observable<RootState>,
  { getJSON }: Dependencies,
) => action$.pipe(
  ofType(REQUEST),
  // get token
  mergeMap(() => (
    iif(
      tokenIsAvailable,
      of(token),
      getJSON<TokenResponse>('https://opentdb.com/api_token.php?command=request').pipe(
        // retry three times, change status to error if we can't get a response
        retry(3),
        // store the token
        tap((data) => { token = data.token; }),
        map(({ token }) => token),
      ),
    )
  )),
  // fetch questions
  mergeMap((token) => (
    getJSON<QuestionsResponse>(
      // we add a 5 questions offset to increase the chance of
      // getting 10 valid questions in one response
      `https://opentdb.com/api.php?amount=${NUMBER_OF_QUESTIONS_PER_SESSION + 5}&type=boolean&token=${token}`
    ).pipe(
      // retry three times, change status to error if we can't get a response
      retry(3),
      // we filter out questions which break layout on small screens
      map(({ results }) => removeLongQuestions(results)),
      // reissue the request
      repeat(),
      // reduce the server responses
      scan<Array<Question>, Array<Question>>((acc, cur) => (
        acc.concat(cur).slice(0, NUMBER_OF_QUESTIONS_PER_SESSION)
      ), []),
      // stop firing requests after we've gathered all questions
      takeWhile((qs) => qs.length < NUMBER_OF_QUESTIONS_PER_SESSION, true),
      // takeWhile stops reading from its source observable and
      // completes as soon as the condition is false, rescue the last
      // emitted value from takeWhile
      takeLast(1),
      // store the index of each question inside the question itself
      map((qs) => qs.map((q, index) => ({ ...q, index }))),
      // map to a Redux action sequence
      mergeMap((qs) => from([
        enqueue(qs),
        startGame(),
        questions.success(),
      ])),
    )
  )),
  catchError(() => of(questions.failure())),
);

export default combineEpics(fetchQuestionsEpic);
