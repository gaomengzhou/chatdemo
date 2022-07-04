import {
  useSelector as useSelectorCustom,
  TypedUseSelectorHook,
} from 'react-redux';
import { RootState } from './store';

// eslint-disable-next-line import/prefer-default-export
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorCustom;
