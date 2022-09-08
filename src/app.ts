import { useEffect } from "./hook/useEffect";
import { useState } from "./hook/useState";

const useApp = () => {
  const [num, updateNum] = useState(1);

  useEffect(() => {}, [num]);
  return { num, updateNum };
};

export const App = () => {
  const body = document.querySelector("body");
  const { num, updateNum } = useApp();

  const button = document.createElement("button");
  button.innerText = "clickMe";
  button.onclick = () => updateNum((num: number) => num + 1);
  const span = document.createElement("span");
  span.innerText = num;
  if (body) {
    body.innerHTML = "";
    body.appendChild(button);
    body.appendChild(span);
  }
};
