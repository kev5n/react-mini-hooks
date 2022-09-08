import { hookStore } from "./store";
import { IHook } from "./types";

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
      hookStore.workInProgressHook = hook;
    }
  } else {
    hook = hookStore.workInProgressHook as IHook;
    hookStore.workInProgressHook = hookStore.workInProgressHook?.next || null;
  }

  return hook;
};
