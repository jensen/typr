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

export const calculateWordsPerMinute = (seconds: number, words: number) => {
  return Math.round((words / seconds) * 60);
};
