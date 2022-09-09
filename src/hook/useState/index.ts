import { hookStore, run } from '../../store';
import { IHookQueue } from '../../types';
import { updateWorkInProgressHook } from '../../utils';

function dispatchSetState<T>(queue: IHookQueue, action: (action: T) => void) {
  const update = {
    action,
    next: null as any,
  };

  if (queue.pending === null) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }

  queue.pending = update;
  run();
}

function mountState<K>(initialState?: K) {
  const hook = updateWorkInProgressHook();

  if (typeof initialState === 'function') {
    initialState = initialState();
  }

  hook.memoizedState = initialState;

  const queue: IHookQueue = {
    pending: null,
    dispatch: null,
  };
  hook.queue = queue;

  const dispatch = (queue.dispatch = dispatchSetState.bind(null, hook.queue));

  return [hook.memoizedState, dispatch];
}

function updateState() {
  const hook = updateWorkInProgressHook();

  let baseState = hook.memoizedState;

  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending.next);

    hook.queue.pending = null;
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchSetState.bind(null, hook.queue)];
}

function useState<K>(initialState?: K) {
  return hookStore.isMount ? mountState(initialState) : updateState();
}

export { useState };
