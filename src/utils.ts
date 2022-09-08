import { hookStore } from './store';
import { IHook } from './types';

//获取当前hook
export const updateWorkInProgressHook = () => {
  let hook: IHook;

  const { isMount, fiber } = hookStore;
  if (isMount) {
    hook = {
      queue: {
        pending: null,
        dispatch: null,
      },
      memoizeState: null,
      next: null,
    };
    if (!fiber.memoizeState) {
      fiber.memoizeState = hook;
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

export function areHookInputsEqual(nextDeps: Array<any>, prevDeps: Array<any>) {
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}
