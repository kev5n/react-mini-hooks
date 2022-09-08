import { hookStore, run } from "../../store";
import { IHookQueue } from "../../types";
import { updateWorkInProgressHook } from "../../utils";

function dispatchSetState(queue: any, action: any) {
  const update: any = {
    action,
    next: null,
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

function useState<K>(initialState?: K) {
  return hookStore.isMount ? mountState(initialState) : updateState();
}

function mountState<K>(initialState?: K) {
  const hook = updateWorkInProgressHook();

  if (typeof initialState === "function") {
    initialState = initialState();
  }

  hook.memoizeState = initialState;
  const queue: IHookQueue = {
    pending: null,
    dispatch: null,
  };
  hook.queue = queue;
  const dispatch = (queue.dispatch = dispatchSetState.bind(null, hook.queue));

  return [hook.memoizeState, dispatch];
}

function updateState() {
  const hook = updateWorkInProgressHook();

  let baseState = hook.memoizeState;

  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending.next);

    hook.queue.pending = null;
  }
  hook.memoizeState = baseState;

  return [baseState, dispatchSetState.bind(null, hook.queue)];
}
export { useState };
