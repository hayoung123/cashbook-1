type createElemType = {
  tagName: string;
  classNames?: Array<string>;
  value?: string;
};

type targetType = HTMLElement | Document;

const _ = {
  $: (selector: string, target: targetType = document): HTMLElement =>
    target.querySelector(selector),
  $$: (selector: string, target: targetType = document): NodeListOf<HTMLElement> =>
    target.querySelectorAll(selector),
  onEvent: (target: HTMLElement, eventType: string, fn: () => void): void => {
    target.addEventListener(eventType, fn);
  },
  createElement: ({ tagName, classNames = [], value = '' }: createElemType): HTMLElement => {
    const element = document.createElement(tagName);
    element.classList.add(...classNames);
    if (value) element.innerHTML = value;
    return element;
  },
};

export default _;
