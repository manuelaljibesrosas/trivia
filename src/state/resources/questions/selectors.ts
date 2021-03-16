import { RootState } from 'state/store';

export const selectStatus = (s: RootState) => s.resources.questions.status;
