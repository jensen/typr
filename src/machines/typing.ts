import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

const lines = [
  "The Atlantic was born today, and I'll tell you how",
  "The clouds above opened up and let it out",
  "I was standing on the surface of a perforated sphere",
  "When the water filled every hole",
  "And thousands upon thousands made an ocean",
  "Making islands where no island should go",
];

const guards = {
  isEndOfLine: (context: ITypingMachineContext, event) => {
    return event.input.length > context.lines[context.currentLine].length - 1;
  },
  isLineComplete: (context: ITypingMachineContext, event) => {
    return (
      guards.isEndOfLine(context, event) &&
      event.input === context.lines[context.currentLine]
    );
  },
  isEndOfLastLine: (context: ITypingMachineContext, event) => {
    return (
      context.currentLine === context.lines.length - 1 &&
      guards.isLineComplete(context, event)
    );
  },
};

export interface ITypingMachineContext {
  lines: string[];
  typed: string[];
  currentPosition: number;
  currentLine: number;
  mistakeCount: number;
  timeStarted: number;
  timeEnded: number;
}

const typingMachine = createMachine<ITypingMachineContext>(
  {
    id: "typr",
    initial: "created",
    context: {
      lines,
      typed: lines.map(() => ""),
      currentPosition: 0,
      currentLine: 0,
      mistakeCount: 0,
      timeStarted: 0,
      timeEnded: 0,
    },
    states: {
      created: {
        invoke: {
          id: "listener",
          src: (context, event) => (callback) => {
            const onKeyUp = (event) => {
              if (event.keyCode === 32) {
                /* Space */ callback("START");
              }
            };

            document.addEventListener("keyup", onKeyUp);

            return () => {
              document.removeEventListener("keyup", onKeyUp);
            };
          },
        },
        on: {
          START: "started",
        },
      },
      started: {
        entry: assign((context, event) => ({
          timeStarted: new Date().getTime(),
        })),
        on: {
          START: "created",
          INPUT: [
            {
              target: "results",
              cond: "isEndOfLastLine",
            },
            {
              actions: assign((context, event) => ({
                currentLine: context.currentLine + 1,
                currentPosition: 0,
              })),
              cond: "isLineComplete",
            },
            {
              actions: assign((context, event) => {
                const current =
                  context.lines[context.currentLine][context.currentPosition];
                const newest = event.input[context.currentPosition];

                const mistakeCount = {
                  mistakeCount:
                    context.mistakeCount +
                    (newest && current !== newest ? 1 : 0),
                };

                return {
                  ...mistakeCount,
                  typed: context.typed.map((line, index) =>
                    index === context.currentLine ? event.input : line
                  ),
                  currentPosition: event.position,
                };
              }),
            },
          ],
        },
      },
      results: {
        type: "final",
        entry: assign((context, event) => ({
          timeEnded: new Date().getTime(),
        })),
        exit: ["submitResults"],
      },
    },
  },
  {
    guards,
  }
);

interface IUseTypingMachine {
  actions: any;
  context: any;
}

export const useTypingMachine = ({ actions, context }: IUseTypingMachine) =>
  useMachine(typingMachine, { devTools: true, actions, context });
