import type { ITypingMachineContext } from "~/machines/typing";

export const calculateCompletedWords = ({
  currentPosition,
  currentLine,
  lines,
}: Pick<
  ITypingMachineContext,
  "currentPosition" | "currentLine" | "lines"
>) => {
  const finished = lines
    .slice(0, currentLine)
    .concat(lines[currentLine].slice(0, currentPosition));

  return finished.reduce(
    (completed: number, current: string) =>
      completed + current.split(" ").length,
    0
  );
};

export const calculateWordsPerMinute = ({
  timeStarted,
  timeEnded,
  wordCount,
}: Pick<ITypingMachineContext, "timeStarted" | "timeEnded"> & {
  wordCount: number;
}) => {
  return Math.round(
    (wordCount / Math.round((timeEnded - timeStarted) / 1000)) * 60
  );
};
