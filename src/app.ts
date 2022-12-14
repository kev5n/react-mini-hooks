import { useCallback } from './hook/useCallback';
import { useEffect } from './hook/useEffect';
import { useMemo } from './hook/useMemo';
import { useRef } from './hook/useRef';
import { useState } from './hook/useState';

const useApp = () => {
  const [num, updateNum] = useState(1);
  const [num1] = useState(1);
  const ref = useRef(false);
  const num2 = useMemo(() => {
    return num + 1;
  }, [num]);

  useEffect(() => {
    console.log(num1, 'num1');
  }, [num1]);

  const getNum = useCallback(() => {
    console.log(num, 'num');
  }, [num]);

  useEffect(() => {
    console.log(num, 'num');
    console.log(num2, 'num2');
    console.log(ref, 'ref');
    ref.current = !ref.current;
    getNum();
  }, [num]);

  // useMemo(() => {}, []);
  return { num, updateNum };
};

export const App = () => {
  const body = document.querySelector('body');
  const { num, updateNum } = useApp();

  const button = document.createElement('button');
  button.innerText = 'clickMe';
  button.onclick = () => updateNum((num: number) => num + 1);
  const span = document.createElement('span');
  span.innerText = num;
  if (body) {
    body.innerHTML = '';
    body.appendChild(button);
    body.appendChild(span);
  }
};

// let html = render(vdom);

// console.log(html)
