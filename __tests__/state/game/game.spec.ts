import { expect } from 'chai';
import reducer, {
  State,
  Question,
  Answers,
} from '../../../src/state/game/reducer';
import * as actions from '../../../src/state/game/actions';

const getInitialState = (initial?: Partial<State>) =>
  reducer(initial as State, {} as any);
const questions: Array<Question> = [
  {
    index: 0,
    category: 'Entertainment: Video Games',
    type: 'boolean',
    difficulty: 'hard',
    question: 'The retail disc of Tony Hawk&#039;s Pro Skater 5 only comes with the tutorial.',
    correct_answer: Answers.TRUE,
    incorrect_answers: [Answers.FALSE],
  },
  {
    index: 1,
    category: 'History',
    type: 'boolean',
    difficulty: 'hard',
    question: 'Japan was part of the Allied Powers during World War I.',
    correct_answer: Answers.TRUE,
    incorrect_answers: [Answers.FALSE],
  },
];

describe('state/game', () => {
  describe('reducer', () => {
    describe('enqueue', () => {
      it('should insert items in the queue', () => {
        const initialState = getInitialState();
        const state = reducer(initialState, actions.enqueue(questions));
        expect(state.queue).to.deep.equal(questions);
      });
      it('should not delete existing items in queue', () => {
        const initialState = getInitialState();
        const firstUpdate = reducer(initialState, actions.enqueue(questions));
        const secondUpdate = reducer(firstUpdate, actions.enqueue(questions));
        expect(secondUpdate.queue).to.have.lengthOf(4);
      });
    });
    describe('start', () => {
      it('should return the original state if the queue is empty', () => {
        const initialState = getInitialState(); 
        const firstUpdate = reducer(initialState, actions.enqueue(questions.slice(0, 1)));
        const secondUpdate = reducer(firstUpdate, actions.start());
        const thirdUpdate = reducer(secondUpdate, actions.answer(Answers.TRUE));
        const fourthUpdate = reducer(thirdUpdate, actions.start());
        expect(fourthUpdate).to.deep.equal(thirdUpdate);
      });
      it('should dequeue a question from the queue', () => {
        const initialState = getInitialState();
        const firstUpdate = reducer(initialState, actions.enqueue(questions));
        const secondUpdate = reducer(firstUpdate, actions.start());
        expect(secondUpdate.current).to.equal(questions[0]);
        expect(secondUpdate.queue).to.have.lengthOf(1);
      });
    });
    describe('answer', () => {
      it('should dequeue the next question from the queue', () => {
        const initialState = getInitialState();
        let state = reducer(initialState, actions.enqueue(questions));
        state = reducer(state, actions.start());
        state = reducer(state, actions.answer(Answers.FALSE));
        expect(state.queue).to.have.lengthOf(0);
      });
      it('should update the answers array', () => {
        const initialState = getInitialState();
        let state = reducer(initialState, actions.enqueue(questions));
        state = reducer(state, actions.start());
        state = reducer(state, actions.answer(Answers.FALSE));
        expect(state.answers).to.have.lengthOf(1);
        expect(state.answers[0][1]).to.be.equal(Answers.FALSE);
      });
      it('should return the original state if the queue is empty', () => {
        const initialState = getInitialState();
        const firstUpdate = reducer(initialState, actions.enqueue(questions));
        const secondUpdate = reducer(firstUpdate, actions.start());
        const thirdUpdate = reducer(secondUpdate, actions.answer(Answers.FALSE));
        const fourthUpdate = reducer(thirdUpdate, actions.answer(Answers.FALSE));
        const fifthUpdate = reducer(fourthUpdate, actions.answer(Answers.FALSE));
        expect(fifthUpdate).to.deep.equal(fourthUpdate);
      });
    });
  });
});
