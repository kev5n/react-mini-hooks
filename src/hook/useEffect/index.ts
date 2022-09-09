import { hookStore } from '../../store';
import { areHookInputsEqual, updateWorkInProgressHook } from '../../utils';

type IUseEffect = [create: () => (() => void) | void, deps: any[] | null];
type Effect = {
  create: () => (() => void) | void;
  destroy: (() => void) | void;
  deps: Array<any> | null;
  next: Effect;
};

export function useEffect(...props: IUseEffect) {
  return hookStore.isMount ? mountEffectImpl(props) : updateEffectImpl(props);
}
function mountEffectImpl([create, deps]: IUseEffect) {
  const hook = updateWorkInProgressHook();

  const nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = pushEffect(create, nextDeps);
}

function updateEffectImpl([create, deps]: IUseEffect) {
  const hook = updateWorkInProgressHook();
  const oldDeps = hook.memoizedState.deps;
  if (deps !== null && !areHookInputsEqual(deps, oldDeps)) {
    hook.memoizedState = pushEffect(create, deps);
  }
  return hook;
}

function pushEffect(
  create: () => void | (() => void),
  deps: any,
  destroy?: undefined,
) {
  const inset = create();
  const effect: Effect = {
    create,
    destroy: destroy || inset,
    deps,
    next: null as any,
  };

  return effect;
}
