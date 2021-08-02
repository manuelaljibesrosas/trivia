import { createReducer } from 'redux-create-reducer';
import { ActionType } from 'typesafe-actions';
import { NetworkStatus } from 'shared/network';
import * as questionActions from './actions';
import * as globalActions from 'state/global/actions';

export interface State {
  status: NetworkStatus;
}

export type Actions = ActionType<typeof questionActions & typeof globalActions>;

const initialState: State = {
  status: NetworkStatus.READY,
};

export default createReducer<State, Actions>(initialState, {
  [globalActions.RESET]: () => initialState,
  [questionActions.REQUEST]: () => ({ status: NetworkStatus.PENDING }),
  [questionActions.SUCCESS]: () => ({ status: NetworkStatus.READY }),
  [questionActions.FAILURE]: () => ({ status: NetworkStatus.ERROR }),
});
