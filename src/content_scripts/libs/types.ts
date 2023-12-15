export type RecordStopType = "onSpeechEnd" | "onSayWord";

export interface Settings {
  recordStopType: RecordStopType;
  sendOnRecordStop: boolean;
  controlWords: {
    stopRecording: {
      value: string;
      enabled: boolean;
    };
    clearPrompt: {
      value: string;
      enabled: boolean;
    };
  };
}
