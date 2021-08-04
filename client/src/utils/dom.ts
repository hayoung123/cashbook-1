interface createElemType {
  tagName: string;
  classNames?: string[];
  value?: string;
}

type targetType = HTMLElement | Document;

const _ = {
  $: (selector: string, target: targetType = document): HTMLElement | null => {
    return target.querySelector(selector);
  },
  $$: (selector: string, target: targetType = document): NodeListOf<HTMLElement> => {
    return target.querySelectorAll(selector);
  },
  onEvent: (
    target: HTMLElement,
    eventType: keyof HTMLElementEventMap,
    fn: (e: Event) => void,
  ): void => {
    target.addEventListener(eventType, fn);
  },
  createElement: ({ tagName, classNames = [], value = '' }: createElemType): HTMLElement => {
    const element = document.createElement(tagName);
    element.classList.add(...classNames);
    if (value) element.innerHTML = value;
    return element;
  },
  focusInput: (input: HTMLInputElement): void => {
    input.focus();
    const inputType = input.type;
    if (inputType === 'number') input.type = 'text';
    input.setSelectionRange(input.value.length, input.value.length);
    if (inputType === 'number') input.type = 'number';
  },
  isTarget: (target: HTMLElement, selector: string): boolean => {
    return !!target.closest(selector);
  },
};

export default _;
