import { hookStore } from '../../store';
import { areHookInputsEqual, updateWorkInProgressHook } from '../../utils';

function mountMemo<T>(nextCreate: () => T, deps: Array<any> | null): T {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
function updateMemo<T>(nextCreate: () => T, deps: Array<any> | void | null): T {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    // Assume these are defined. If they're not, areHookInputsEqual will warn.
    if (nextDeps !== null) {
      const prevDeps: Array<any> = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
export const useMemo = <T>(nextCreate: () => T, deps: Array<any> | null) => {
  return hookStore.isMount
    ? mountMemo(nextCreate, deps)
    : updateMemo(nextCreate, deps);
};
