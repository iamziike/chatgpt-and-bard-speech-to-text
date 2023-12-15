import { createSignal } from "solid-js";
import { RecordStopType } from "../types";

interface BeginRecordProps {
  handleNewRecoginition: (word: string, isFinal: boolean) => void;
  handleEndRecord: (stopType?: RecordStopType | null) => void;
  stopControl: {
    type: RecordStopType;
    word?: string;
  };
}

const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = createSignal(false);
  const [cachedRecognitionInstance, setCachedRecognitionInstance] =
    createSignal<SpeechRecognition | null>(null);

  const setupRecognitionInstance = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    setCachedRecognitionInstance(recognition);
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    return recognition;
  };

  const cleanUp = () => {
    setIsRecording(false);
    setCachedRecognitionInstance(null);
  };

  const stopRecord = () => {
    const recognition = cachedRecognitionInstance();

    if (recognition) {
      cleanUp();
      recognition.stop();
    }
  };

  const beginRecord = ({
    handleNewRecoginition,
    handleEndRecord,
    stopControl,
  }: BeginRecordProps) => {
    if (isRecording()) {
      return;
    }

    let timeoutId = 0;
    const recognition = setupRecognitionInstance();
    recognition.start();
    setIsRecording(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      clearTimeout(timeoutId);
      const length = event.results.length;
      const transcript = event.results[length - 1][0].transcript;
      const isFinal = event.results[length - 1].isFinal;

      if (
        stopControl.type === "onSayWord" &&
        transcript.toLowerCase()?.replace(".", "") ===
          (stopControl.word?.toLowerCase() || "stop")
      ) {
        recognition.onend = () => {
          handleEndRecord(stopControl.type);
        };
        stopRecord();
        return;
      }

      if (stopControl.type === "onSpeechEnd") {
        // timeoutId = setTimeout(() => {
        recognition.onend = () => {
          handleEndRecord(stopControl.type);
        };
        stopRecord();
        // }, 2000);
        return;
      }

      handleNewRecoginition(transcript, isFinal);
    };

    recognition.onend = () => {
      cleanUp();
      handleEndRecord();
    };
  };

  return {
    beginRecord,
    isRecording,
    stopRecord,
  };
};

export default useSpeechRecognition;
