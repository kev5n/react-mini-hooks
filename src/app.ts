import { useEffect } from './hook/useEffect';
import { useState } from './hook/useState';

const useApp = () => {
  const [num, updateNum] = useState(1);
  const [num1, updateNum1] = useState(1);

  useEffect(() => {
    console.log(num1, 'num1');
  }, [num1]);

  useEffect(() => {
    console.log(num, 'num');
  }, [num]);
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
