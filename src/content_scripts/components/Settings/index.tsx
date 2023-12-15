import styles from "./Settings.module.scss";
import logo from "../../../assets/logo.svg";
import Radio from "../Radio";
import Checkbox from "../Checkbox";
import { Component, JSX, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { onEnter } from "../../libs";
import { useSettings } from "../SettingsProvider";
import { RecordStopType } from "../../libs/types";

interface ModalProps {
  isOpen: boolean;
  onHide: VoidFunction;
}

const SettingsIcon: Component<{ onClick: VoidFunction }> = (props) => {
  const promptBox = document.getElementById(
    "prompt-textarea"
  ) as HTMLInputElement;
  const promptBoxWrapper = promptBox?.parentElement?.parentElement;

  return (
    <div>
      {promptBoxWrapper && (
        <Portal mount={promptBoxWrapper}>
          <svg
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            height="30"
            width="30"
            viewBox="0 -960 960 960"
            class={`${styles.settings} hi-there`}
            // tabIndex={0}
            fill="#00a67e"
            onClick={props.onClick}
            onKeyDown={(event) => {
              onEnter(event, props.onClick);
            }}
          >
            <path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm48-60h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Zm44-210q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-130Z" />
          </svg>
        </Portal>
      )}
    </div>
  );
};

const SettingsModal: Component<ModalProps> = (props) => {
  const { settings, setSettings } = useSettings();

  const whenToStopOptions: Array<{
    title: string | JSX.Element;
    value: RecordStopType;
  }> = [
    {
      title: "Stop recording after I finish speaking",
      value: "onSpeechEnd",
    },
    {
      value: "onSayWord",
      title: (
        <>
          Stop recording when I say{" "}
          <span>
            <input
              type="text"
              placeholder="Word"
              class={styles["settings-modal-container__text-input"]}
              value={settings.controlWords.stopRecording.value ?? ""}
              style={{
                width:
                  (settings.controlWords.stopRecording.value.length || 4) +
                  "ch",
              }}
              onInput={({ target }) => {
                setSettings(
                  "controlWords",
                  "stopRecording",
                  "value",
                  target.value
                );
              }}
            />
          </span>
        </>
      ),
    },
  ];

  return (
    <div>
      {props.isOpen && (
        <div class={styles["settings-modal"]}>
          <div
            class={styles["settings-modal__backdrop"]}
            onClick={props.onHide}
          />
          <div class={`${styles["settings-modal__container"]}`}>
            <header class={styles["settings-modal__container__header"]}>
              <h3 class={styles["settings-modal__container__header-title"]}>
                <img src={chrome.runtime.getURL(logo)} width={32} />
                ChatGPT Speech to Text
              </h3>
              <button class="icon-button" onClick={props.onHide}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    fill="black"
                    d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
                  />
                </svg>
              </button>
            </header>
            <main class={styles["settings-modal__container__body"]}>
              <div>
                <Radio
                  desc={{ header: "When To Stop Recording" }}
                  options={whenToStopOptions}
                  value={settings?.recordStopType}
                  onChange={({ target }) => {
                    const type = target.value as RecordStopType;
                    setSettings("recordStopType", type);
                  }}
                />

                <div class="mt-3">
                  <div class={styles["settings-modal-container__label"]}>
                    Controls
                  </div>

                  <Checkbox
                    checked={Boolean(settings?.sendOnRecordStop)}
                    onChange={({ target }) => {
                      setSettings("sendOnRecordStop", target.checked);
                    }}
                    option={{
                      title: "Send Message when Record ends",
                    }}
                  />

                  <Checkbox
                    checked={Boolean(
                      settings?.controlWords?.clearPrompt?.enabled
                    )}
                    onChange={({ target }) => {
                      setSettings(
                        "controlWords",
                        "clearPrompt",
                        "enabled",
                        target.checked
                      );
                    }}
                    option={{
                      title: (
                        <>
                          Clear Prompt when I say{" "}
                          <span>
                            <input
                              type="text"
                              placeholder="Word"
                              class={
                                styles["settings-modal-container__text-input"]
                              }
                              value={
                                settings.controlWords.clearPrompt.value ?? ""
                              }
                              style={{
                                width:
                                  (settings.controlWords.clearPrompt.value
                                    .length || 4) + "ch",
                              }}
                              onInput={({ target }) => {
                                setSettings(
                                  "controlWords",
                                  "clearPrompt",
                                  "value",
                                  target.value
                                );
                              }}
                            />
                          </span>
                        </>
                      ),
                    }}
                  />
                </div>
              </div>
            </main>
            <footer class={styles["settings-modal-container__footer"]}>
              <p class="wobble">Made with ❤️ and ☕</p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

const Settings = () => {
  const [showModal, setShowModal] = createSignal(false);

  const toggleShowModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <>
      <SettingsIcon onClick={toggleShowModal} />
      <SettingsModal isOpen={showModal()} onHide={toggleShowModal} />
    </>
  );
};

export default Settings;
