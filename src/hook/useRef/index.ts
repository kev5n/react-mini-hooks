import { hookStore } from '../../store';
import { updateWorkInProgressHook } from '../../utils';

function useRef<T>(initialValue: T): { current: T } {
  return hookStore.isMount ? mountRef(initialValue) : updateRef();
}

function mountRef<T>(initialValue: T) {
  const hook = updateWorkInProgressHook();

  const ref = { current: initialValue };
  hook.memoizedState = ref;
  return ref;
}

function updateRef() {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}

export { useRef };
