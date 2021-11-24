import { ActionFunction, LoaderFunction, useLoaderData } from "remix";
import { json, redirect, Link } from "remix";
import { useParams } from "react-router-dom";
import {
  withAuth,
  AuthedActionFunction,
  AuthedLoaderFunction,
} from "~/utils/auth";
import { definitions } from "~/services/types/supabase";

import useSessionResults from "~/hooks/useSessionResults";

import { Button } from "~/components/common/Button";
import { StatPill } from "~/components/common/StatPill";

const handleAction: AuthedActionFunction = ({ request, params, supabase }) => {
  return request
    .formData()
    .then((data) =>
      supabase.from("attempts").insert([
        {
          seconds: Number(data.get("seconds")),
          words: Number(data.get("words")),
          missed: Number(data.get("missed")),
          session_id: params.id,
        },
      ])
    )
    .then(({ data, error }) =>
      redirect(`/sessions/${params.id}/results`)
    ) as Promise<Response>;
};

export let action: ActionFunction = withAuth(handleAction);

const handleLoad: AuthedLoaderFunction = ({
  params,
  supabase,
  response: { data, headers },
}) => {
  return supabase
    .from<definitions["sessions"]>("sessions")
    .select("*, attempts(*, user:user_id(*))")
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

const UserResult = (props) => {
  return (
    <>
      <div className="font-bold text-2xl text-green-400 uppercase">Result</div>
      <StatPill label="WPM" value={props.wpm} />
      <StatPill label="MISTAKES" value={props.missed} />
    </>
  );
};

const Top5Results = (props) => {
  return (
    <>
      <div className="font-bold text-2xl text-green-400 uppercase">Top 5</div>
      <div className="flex bg-green-400 text-white rounded py-2 px-2 text-xs font-light">
        <div className="w-1/4">RANK</div>
        <div className="w-1/4">WPM</div>
        <div className="w-1/4">MISSED</div>
        <div className="w-1/4">NAME</div>
      </div>
      {props.attempts.map((attempt, index) => (
        <div
          key={attempt.id}
          className="flex text-green-400 border border-green-400 rounded py-2 px-2"
        >
          <div className="w-1/4">
            <div className="w-6 h-6 rounded-full border border-green-400 flex justify-center items-center text-xs">
              {index + 1}
            </div>
          </div>
          <div className="w-1/4 font-bold">{attempt.wpm}</div>
          <div className="w-1/4 font-bold">{attempt.missed}</div>
          <div className="w-1/4">{attempt.user.name}</div>
        </div>
      ))}
    </>
  );
};

export default function SessionResults() {
  const { id } = useParams();
  const { session } = useLoaderData<{
    session: { seconds: number; words: number; attempts: any[] };
    user: any;
  }>();
  const { mine, top } = useSessionResults(session);

  return (
    <div className="w-96 p-4 flex flex-col space-y-2">
      {mine ? <UserResult missed={mine.missed} wpm={mine.wpm} /> : <p></p>}
      <Link to={`/sessions/${id}`}>
        <Button intent="secondary">
          {mine ? "Try Again" : "Make Attempt"}
        </Button>
      </Link>
      {top.length > 0 && <Top5Results attempts={top} />}
    </div>
  );
}
