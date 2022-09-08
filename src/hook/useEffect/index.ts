import { hookStore } from "../../store";
import { updateWorkInProgressHook } from "../../utils";

export function useEffect<K>(
  create: () => (() => void) | void,
  deps: Array<K> | void | null
) {
  return hookStore.isMount
    ? mountEffectImpl(create, deps)
    : updateEffectImpl(create, deps);
  // let destroy = undefined;

  // const effect = {
  //   create,
  //   destroy,
  //   deps,
  //   // Circular
  //   next: null,
  // };

  // console.log(deps);
}

function mountEffectImpl<K>(
  create: () => (() => void) | void,
  deps: Array<K> | void | null
) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  hook.memoizeState = pushEffect(create, undefined, nextDeps);
}

function updateEffectImpl<K>(
  create: () => (() => void) | void,
  deps: Array<K> | void | null
) {}

function pushEffect(create: () => void | (() => void), destroy: undefined, deps:any) {
  const effect: any = {
    create,
    destroy,
    deps,
    // Circular
    next: null,
  };
  
  let componentUpdateQueue: any = hookStore.workInProgressHook;
  const lastEffect = componentUpdateQueue.lastEffect;
  if (lastEffect === null) {
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    const firstEffect = lastEffect.next;
    lastEffect.next = effect;
    effect.next = firstEffect;
    componentUpdateQueue.lastEffect = effect;
  }

  return effect;
}
