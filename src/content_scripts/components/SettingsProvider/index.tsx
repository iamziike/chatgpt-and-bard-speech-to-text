import { Settings } from "../../libs/types";
import { SetStoreFunction, createStore } from "solid-js/store";
import {
  Component,
  JSX,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  useContext,
} from "solid-js";

interface Props {
  children: JSX.Element;
}

const DEFAULT_SETTINGS: Settings = {
  sendOnRecordStop: true,
  recordStopType: "onSpeechEnd",
  controlWords: {
    clearPrompt: {
      value: "Clear",
      enabled: true,
    },
    stopRecording: {
      value: "Stop",
      enabled: true,
    },
  },
};

const SettingsContext = createContext<{
  settings: Settings;
  setSettings: SetStoreFunction<Settings>;
}>();

export const useSettings = () => {
  return useContext(SettingsContext)!;
};

export const SettingsProvider: Component<Props> = (props) => {
  const SETTINGS_DB_KEY = "SETTINGS_DB_KEY";
  const [isComponentMounted, setIsComponentMounted] = createSignal(false);
  const [settings, setSettings] = createStore<Settings>(DEFAULT_SETTINGS);

  onMount(async () => {
    const currentSettings = await chrome.storage.local.get(SETTINGS_DB_KEY);

    setSettings(currentSettings?.[SETTINGS_DB_KEY] ?? DEFAULT_SETTINGS);

    setIsComponentMounted(true);
  });

  createEffect(() => {
    if (isComponentMounted()) {
      chrome.storage.local.set({ [SETTINGS_DB_KEY]: settings });
    }
  });

  return (
    <SettingsContext.Provider
      value={createMemo(() => ({ settings, setSettings }))()}
    >
      {props.children}
    </SettingsContext.Provider>
  );
};
