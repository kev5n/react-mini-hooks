export interface IHookQueue {
  pending: null | any;
  dispatch: null | ((action: any) => void);
}

export interface IHook {
  queue:IHookQueue
  memoizeState: any;
  next: IHook | null;
}
