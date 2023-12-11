export const onEnter = (event: KeyboardEvent, callback: VoidFunction) => {
  if (event.key === "Enter") {
    callback();
  }
};
