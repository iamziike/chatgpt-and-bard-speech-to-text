import styles from "./PromptUpdater.module.scss";
import { Portal } from "solid-js/web";
import { createSignal } from "solid-js";

const PromptUpdater = () => {
  const [isRecording, setIsRecording] = createSignal(false);
  const promptBox = document.getElementById(
    "prompt-textarea"
  ) as HTMLInputElement;
  const promptBoxWrapper = promptBox?.parentElement;

  const beginRecord = () => {
    if (!isRecording()) {
      let timeoutId = 0;

      setIsRecording(true);

      const recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();

      recognition.continuous = true;
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.start();

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        clearTimeout(timeoutId);

        const getNewResults = (event: SpeechRecognitionEvent) => {
          let result = "";
          for (let count = 0; count < event.results.length; count++) {
            result += event.results[count][0].transcript;

            if (count + 1 < event.results.length) {
              result += "\n";
              promptBox.style.height = `${
                parseInt(promptBox.style.height) + 24
              }px`;
            }
          }

          return result;
        };

        promptBox.value = getNewResults(event);

        timeoutId = setTimeout(() => {
          setIsRecording(false);
          recognition.stop();
        }, 2000);
      };
    }
  };

  return (
    <div>
      {promptBoxWrapper && (
        <Portal mount={promptBoxWrapper}>
          <div class={styles["prompt-updater"]}>
            <svg
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              height="30"
              width="30"
              onClick={beginRecord}
              class={styles["prompt-updater__icon"]}
              classList={{
                [styles["prompt-updater__icon--recording"]]: isRecording(),
              }}
            >
              <path
                fill="white"
                d="M480-423q-43 0-72-30.917-29-30.916-29-75.083v-251q0-41.667 29.441-70.833Q437.882-880 479.941-880t71.559 29.167Q581-821.667 581-780v251q0 44.167-29 75.083Q523-423 480-423Zm0-228Zm-30 531v-136q-106-11-178-89t-72-184h60q0 91 64.288 153t155.5 62Q571-314 635.5-376 700-438 700-529h60q0 106-72 184t-178 89v136h-60Zm30-363q18 0 29.5-13.5T521-529v-251q0-17-11.788-28.5Q497.425-820 480-820q-17.425 0-29.212 11.5Q439-797 439-780v251q0 19 11.5 32.5T480-483Z"
              />
            </svg>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default PromptUpdater;
