import { hookStore } from './store';
import { IHook } from './types';

//get current hook
export const updateWorkInProgressHook = () => {
  let hook: IHook;

  const { isMount, fiber } = hookStore;
  if (isMount) {
    hook = {
      queue: {
        pending: null,
        dispatch: null,
      },
      memoizedState: null,
      next: null,
    };
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      if (hookStore.workInProgressHook) {
        hookStore.workInProgressHook.next = hook;
      }
    }
    hookStore.workInProgressHook = hook;
  } else {
    hook = hookStore.workInProgressHook as IHook;
    hookStore.workInProgressHook = hookStore.workInProgressHook?.next || null;
  }

  return hook;
};

//浅比较数据
export function areHookInputsEqual<T, K>(
  nextDeps: Array<T>,
  prevDeps: Array<K>,
) {
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}
