import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type CounterState = {
  count: number;
};

export const CounterStore = signalStore(
  { providedIn: 'root' },
  withState<CounterState>({ count: 0 }),
  withMethods((store) => ({
    decrement: () => patchState(store, (state) => ({ count: state.count - 1 })),
    increment: () => patchState(store, (state) => ({ count: state.count + 1 })),
    reset: () => patchState(store, { count: 0 }),
  })),
);