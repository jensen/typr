export function withPreventDefault<T extends Event>(fn: (event: T) => void) {
  return (event: T) => {
    event.preventDefault();

    if (fn) {
      fn(event);
    }
  };
}
