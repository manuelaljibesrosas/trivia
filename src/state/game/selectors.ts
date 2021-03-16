import { RootState } from 'state/store';

export const selectCurrentQuestion = (s: RootState) => s.game.current;
export const selectDidFinish = (s: RootState) => (
  s.game.queue.length === 0 && !s.game.current
);
export const selectResults = (s: RootState) => s.game.answers;
