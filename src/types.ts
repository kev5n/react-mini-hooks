export interface IHookQueue {
  pending: null | any;
  dispatch: null | ((action: any) => void);
}

export interface IHook {
  queue: IHookQueue;
  memoizedState: any;
  next: IHook | null;
}
