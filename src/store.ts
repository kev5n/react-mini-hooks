import { IHook } from './types';
import { App } from './app';

function initStore() {
  //当前执行的hook
  let workInProgressHook: IHook | null = null;
  //是否为初始化
  let isMount = true;

  const fiber: {
    //保存所有hook
    memoizedState: IHook | null;
    //保存组件
    stateNode: () => void;
  } = {
    //缓存hook
    memoizedState: null,
    stateNode: App,
  };

  return {
    workInProgressHook: workInProgressHook as IHook | null,
    isMount,
    fiber,
  };
}

export const hookStore = initStore();

export function run() {
  hookStore.workInProgressHook = hookStore.fiber.memoizedState;
  // console.log(hookStore);
  hookStore.fiber.stateNode();
  hookStore.isMount = false;
}
