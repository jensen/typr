import type { LoaderFunction } from "remix";
import { useSubmit, useLoaderData, json } from "remix";
import { useParams, useNavigate } from "react-router-dom";
import { withAuth, AuthedLoaderFunction } from "~/utils/auth";
import TypingInput from "~/components/TypingInput";
import { Spinner } from "~/components/common/Loading";
import { definitions } from "~/services/types/supabase";
import { useTypingMachine } from "~/machines/typing";
import { StatPill } from "~/components/common/StatPill";
import { Button } from "~/components/common/Button";
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
  const { user } = useLoaderData();
  const { id } = useParams();
  const navigate = useNavigate();
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
      submitResults: (context, event) => {
        const seconds = String(
          Math.round((context.timeEnded - context.timeStarted) / 1000)
        );
        const words = String(calculateCompletedWords(context));
        const missed = context.mistakeCount;

        const params = {
          seconds,
          missed,
          words,
        };

        if (user) {
          submit(params, { method: "post", action: `/sessions/${id}/results` });
        } else {
          navigate(`practice?${new URLSearchParams(params).toString()}`);
        }
      },
    },
  });

  if (state.matches("results") && user) {
    return (
      <div className="px-8 py-2 rounded-full flex justify-center items-center bg-green-400 space-x-4">
        <Spinner show />
        <span className="text-white">Submitting Results</span>
      </div>
    );
  }

  if (state.matches("started")) {
    return (
      <div className="p-4 space-y-4">
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
        <Button intent="danger" onClick={() => send("RESET")}>
          Reset
        </Button>
      </div>
    );
  }

  if (state.matches("created")) {
    return (
      <div className="flex flex-col space-y-2">
        <p className="text-3xl font-light">
          Press{" "}
          <span className="text-green-400 font-bold uppercase">Space</span> to
          begin.
        </p>
        <p className="text-sm text-gray-400">or press this button</p>
        <Button sm intent="secondary" onClick={() => send("START")}>
          Start
        </Button>
      </div>
    );
  }

  return null;
}
