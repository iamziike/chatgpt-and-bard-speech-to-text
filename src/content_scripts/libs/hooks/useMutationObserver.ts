import { onMount } from "solid-js";

interface Props {
  targetNode: HTMLElement;
  callback: MutationCallback;
  config?: MutationObserverInit;
}

const useMutationObserver = (props: Props) => {
  const {
    callback,
    targetNode,
    config = {
      attributes: false,
      characterData: false,
      childList: true,
      subtree: true,
    },
  } = props;

  onMount(() => {
    if (!targetNode) return;
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  });
};

export default useMutationObserver;
