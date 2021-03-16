import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';
import * as fixtures from './fixtures';
import { questions } from 'state/resources/questions/actions';
import { fetchQuestionsEpic, removeLongQuestions } from 'state/resources/questions/epics';
import * as gameActions from 'state/game/actions';

describe('state/resources/questions', () => {
  describe('epics', () => {
    describe('fetchQuestionsEpic', () => {
      it('should accumulate responses until it gathers ten questions', () => {
        const testScheduler = new TestScheduler((actual, expected) => {
          expect(actual).to.deep.equal(expected);
        });

        testScheduler.run(({ cold, expectObservable }) => {
          const action$ = cold('-a', { a: questions.request() });
          const state$ = null;
          // we use this flag to simulate distinct server responses
          let attemptNumber = 1;
          const dependencies = {
            getJSON: (url) => {
              if (url === 'https://opentdb.com/api_token.php?command=request')
                return cold('--a', { a: fixtures.tokenResponse });

              const ret = fixtures[`questionsResponse${attemptNumber}`];
              attemptNumber++;
              return cold('--a', { a: ret });
            },
          };

          const output$ = fetchQuestionsEpic(action$, state$, dependencies);

          const expected = removeLongQuestions(fixtures.questionsResponse1.results)
            .concat(removeLongQuestions(fixtures.questionsResponse2.results))
            .slice(0, 10)
            .map((q, index) => ({ ...q, index }));

          expectObservable(output$).toBe('-----(abc)', {
            a: gameActions.enqueue(expected),
            b: gameActions.start(),
            c: questions.success(),
          });
        });
      });
      it('should emit a failure signal if unable to connect');
    });
  });
});
