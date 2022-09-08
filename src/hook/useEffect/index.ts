import { hookStore } from '../../store';
import { areHookInputsEqual, updateWorkInProgressHook } from '../../utils';

type IUseEffect = [
  create: () => (() => void) | void,
  deps: any[] | void | null,
];
type Effect = {
  create: () => (() => void) | void;
  destroy: (() => void) | void;
  deps: Array<any> | null;
  next: Effect;
};

function createFunctionComponentUpdateQueue() {
  return {
    lastEffect: null,
    stores: null,
  };
}
export function useEffect(...props: IUseEffect) {
  return hookStore.isMount ? mountEffectImpl(props) : updateEffectImpl(props);
}
function mountEffectImpl([create, deps]: IUseEffect) {
  const hook = updateWorkInProgressHook();

  const nextDeps = deps === undefined ? null : deps;
  hook.memoizeState = pushEffect(create, nextDeps);
}

function updateEffectImpl([create, deps]: IUseEffect) {
  const hook = updateWorkInProgressHook();
  const oldDeps = hook.memoizeState.deps;
  if (deps && !areHookInputsEqual(deps, oldDeps)) {
    const inset = create();
    hook.memoizeState.deps = deps;
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
    destroy,
    deps,
    // Circular
    next: null as any,
  };

  return effect;
}
