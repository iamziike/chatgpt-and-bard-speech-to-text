import PromptUpdater from "./components/PromptUpdater";
import Settings from "./components/Settings";
import { SettingsProvider } from "./components/SettingsProvider";

const App = () => {
  return (
    <div>
      <SettingsProvider>
        <Settings />
        <PromptUpdater />
      </SettingsProvider>
    </div>
  );
};

export default App;
