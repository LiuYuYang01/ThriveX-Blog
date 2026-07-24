type ThemeListener = (nextDark: boolean) => void;

let listener: ThemeListener | null = null;

export function subscribeThemeTransition(fn: ThemeListener) {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

/** 由开关调用：先播过渡动画，再真正切换主题 */
export function requestThemeTransition(nextDark: boolean) {
  if (listener) {
    listener(nextDark);
    return;
  }
  document.documentElement.classList.toggle('dark', nextDark);
}
