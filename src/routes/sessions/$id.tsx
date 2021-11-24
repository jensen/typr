import type { LoaderFunction } from "remix";
import { useSubmit, useLoaderData, json } from "remix";
import { useParams } from "react-router-dom";
import { withAuth, AuthedLoaderFunction } from "~/utils/auth";
import TypingInput from "~/components/TypingInput";
import { Spinner } from "~/components/common/Loading";
import { definitions } from "~/services/types/supabase";
import { useTypingMachine } from "~/machines/typing";
import { StatPill } from "~/components/common/StatPill";
import { calculateCompletedWords } from "~/utils/calculations";

const handleLoad: AuthedLoaderFunction = ({
  params,
  supabase,
  response: { data, headers },
}) => {
  return supabase
    .from<definitions["sessions"]>("sessions")
    .select()
    .match({ id: params.id })
    .then((response) => response.data)
    .then((session) => {
      if (session) {
        return json(
          { ...data, session: session[0] || null },
          {
            headers: headers,
          }
        );
      }
    }) as Promise<Response>;
};

export let loader: LoaderFunction = withAuth(handleLoad);

export default function Session() {
  const { id } = useParams();
  const submit = useSubmit();

  const { session } = useLoaderData<{
    session: {
      lines: string[];
      seconds: number;
      words: number;
      attempts: any[];
    };
    user: any;
  }>();

  const [state, send] = useTypingMachine({
    context: {
      lines: session.lines,
      typed: session.lines.map((line) => ""),
    },
    actions: {
      submitResults: (context, event) =>
        submit(
          {
            seconds: String(
              Math.round((context.timeEnded - context.timeStarted) / 1000)
            ),
            missed: context.mistakeCount,
            words: String(calculateCompletedWords(context)),
          },
          { method: "post", action: `/sessions/${id}/results` }
        ),
    },
  });

  if (state.matches("results")) {
    return (
      <div className="px-8 py-2 rounded-full flex justify-center items-center bg-green-400 space-x-4">
        <Spinner show />
        <span className="text-white">Submitting Results</span>
      </div>
    );
  }

  if (state.matches("started")) {
    return (
      <div className="space-y-4">
        <StatPill label="MISTAKES" value={state.context.mistakeCount} />
        <div className="text-xl font-mono flex flex-col space-y-2">
          {state.context.lines.map((line, index) =>
            index === state.context.currentLine ? (
              <TypingInput
                key={index}
                position={state.context.currentPosition}
                line={line}
                input={state.context.typed[state.context.currentLine]}
                onInput={(input: string, position: number) =>
                  send({ type: "INPUT", input, position })
                }
              />
            ) : (
              <div key={index} className="px-3 text-gray-300 select-none">
                {line}
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  if (state.matches("created")) {
    return (
      <p className="text-3xl font-light">
        Press <span className="text-green-400 font-bold uppercase">Space</span>{" "}
        to begin.
      </p>
    );
  }

  return null;
}
