import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { StateType, ActionType } from 'typesafe-actions';
import { ajax } from 'rxjs/ajax';
import * as gameActions from './game/actions';
import game from './game/reducer';
import questionsReducer from './resources/questions/reducer';
import { questions } from './resources/questions/actions';
import * as globalActions from './global/actions';
import questionsEpic from './resources/questions/epics';

const rootReducer = combineReducers({
  game,
  resources: combineReducers({
    questions: questionsReducer,
  }),
});

export type RootState = StateType<typeof rootReducer>;
export type RootAction = ActionType<typeof questions & typeof gameActions & typeof globalActions>

// TODO: checking for a property on window will break SSR
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export type Dependencies = {
  getJSON: typeof ajax.getJSON,
};

const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, Dependencies>({
  dependencies: { getJSON: ajax.getJSON },
});

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(epicMiddleware),
));

epicMiddleware.run(questionsEpic);

// we want to start fetching the questions immediatelly
// TODO: this should be guarded on a condition for SSR
store.dispatch(questions.request());

export default store;
