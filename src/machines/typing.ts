import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

const guards = {
  isEndOfLine: (context: ITypingMachineContext, event) => {
    return event.input.length > context.lines[context.currentLine].length - 1;
  },
  isLineComplete: (context: ITypingMachineContext, event) => {
    return (
      guards.isEndOfLine(context, event) &&
      event.input.slice(0, -1) === context.lines[context.currentLine]
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
      lines: [""],
      typed: [""],
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
          RESET: {
            target: "created",
            actions: assign((context, event) => ({
              typed: context.lines.map(() => ""),
              currentPosition: 0,
              currentLine: 0,
              mistakeCount: 0,
              timeStarted: 0,
              timeEnded: 0,
            })),
          },
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
                /* long way to get the two characters we need to compare */
                const current =
                  context.lines[context.currentLine][context.currentPosition];
                const newest = event.input[context.currentPosition];

                /* add one to the mistake count if they aren't the same */
                return {
                  mistakeCount:
                    context.mistakeCount +
                    (newest && current !== newest ? 1 : 0),
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
