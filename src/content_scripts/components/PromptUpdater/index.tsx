import styles from "./PromptUpdater.module.scss";
import useMutationObserver from "../../libs/hooks/useMutationObserver";
import useSpeechRecognition from "../../libs/hooks/useSpeechRecognition";
import { createSignal, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import { useSettings } from "../SettingsProvider";
import {
  getInputPromptElements,
  newLine,
  onEnter,
  removeFullStop,
} from "../../libs";

const PromptUpdater = () => {
  const [elements, setElements] = createSignal(getInputPromptElements());

  const { settings } = useSettings();
  const [promptBoxFinalWords, setPromptBoxFinalWords] = createSignal("");
  const { beginRecord, isRecording, stopRecord } = useSpeechRecognition();

  const handleBeginRecord = () => {
    const { promptBox } = elements();

    if (isRecording()) {
      stopRecord();
      return;
    }

    const whenToStop = settings.recordStopType;

    // setup promptBox
    promptBox.dispatchEvent(
      new Event("input", {
        bubbles: !0,
        cancelable: !0,
      })
    );

    beginRecord({
      handleEndRecord(stopControl) {
        if (stopControl) {
          if (settings.sendOnRecordStop) {
            const sendButton = document.querySelector(
              '[data-testid="send-button"]'
            ) as HTMLButtonElement;

            sendButton.disabled = false;
            sendButton.click();
          }
        }
      },
      handleNewRecoginition(word, isFinal) {
        // isClear
        if (
          settings?.controlWords.clearPrompt.enabled &&
          removeFullStop(word.toLowerCase()) ===
            settings.controlWords.clearPrompt.value?.toLowerCase()
        ) {
          setPromptBoxFinalWords("");
          promptBox.value = "";
          promptBox.style.height = "24px";
          return;
        }

        if (isFinal) {
          return setPromptBoxFinalWords((prev) => {
            const value = newLine(prev) + word;
            promptBox.value = value;
            promptBox.style.height = `${
              parseInt(promptBox.style.height) + 24
            }px`;
            return value;
          });
        }
        promptBox.value = newLine(promptBoxFinalWords()) + word;
        promptBox.style.height = `${parseInt(promptBox.style.height) + 24}px`;
      },
      stopControl: {
        type: whenToStop,
        word: settings?.controlWords?.stopRecording?.value,
      },
    });
  };

  useMutationObserver({
    targetNode: document.querySelector("main")!,
    config: {
      attributes: false,
      characterData: false,
      childList: true,
      subtree: false,
    },
    callback() {
      setElements(getInputPromptElements());
    },
  });

  onMount(() => {
    const { promptBox } = elements();
    setPromptBoxFinalWords(promptBox.value);
    promptBox.addEventListener("keyup", ({ target }) => {
      setPromptBoxFinalWords((target as HTMLTextAreaElement).value ?? "");
    });
  });

  return (
    <div>
      {elements().promptBoxWrapper && (
        <Portal mount={elements().promptBoxWrapper!}>
          <svg
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            height="30"
            width="30"
            onClick={handleBeginRecord}
            onKeyDown={(event) => {
              onEnter(event, handleBeginRecord);
            }}
            class={`${styles["prompt-updater__icon"]} bounce`}
            tabIndex={0}
            classList={{
              [styles["prompt-updater__icon--recording"]]: isRecording(),
            }}
          >
            <path
              fill="white"
              d="M480-423q-43 0-72-30.917-29-30.916-29-75.083v-251q0-41.667 29.441-70.833Q437.882-880 479.941-880t71.559 29.167Q581-821.667 581-780v251q0 44.167-29 75.083Q523-423 480-423Zm0-228Zm-30 531v-136q-106-11-178-89t-72-184h60q0 91 64.288 153t155.5 62Q571-314 635.5-376 700-438 700-529h60q0 106-72 184t-178 89v136h-60Zm30-363q18 0 29.5-13.5T521-529v-251q0-17-11.788-28.5Q497.425-820 480-820q-17.425 0-29.212 11.5Q439-797 439-780v251q0 19 11.5 32.5T480-483Z"
            />
          </svg>
        </Portal>
      )}
    </div>
  );
};

export default PromptUpdater;
