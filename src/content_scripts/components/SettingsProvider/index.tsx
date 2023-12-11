import "./index.scss";
import {
  Accessor,
  Component,
  JSX,
  Setter,
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";

interface Props {
  children: JSX.Element;
}

interface Settings {
  whenToSend: "OnSpeechEnd" | "onSaySend" | "Nothing";
  isClearAllowed: boolean;
}

const SettingsContext = createContext<{
  settings: Accessor<Settings | null>;
  setSettings: Setter<Settings | null>;
}>();

export const useSettings = () => {
  return useContext(SettingsContext)!;
};

export const SettingsProvider: Component<Props> = (props) => {
  const SETTINGS_DB_KEY = "SETTINGS_DB_KEY";
  const [settings, setSettings] = createSignal<Settings | null>(null);

  onMount(async () => {
    const currentSettings = (await chrome.storage.local.get(SETTINGS_DB_KEY))[
      SETTINGS_DB_KEY
    ] as Settings;

    const defaultSetting: Settings = {
      whenToSend: "OnSpeechEnd",
      isClearAllowed: false,
    };

    setSettings(currentSettings ?? defaultSetting);
  });

  createEffect(() => {
    chrome.storage.local.set({ [SETTINGS_DB_KEY]: settings() });
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {props.children}
    </SettingsContext.Provider>
  );
};
