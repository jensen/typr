import type { LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import cx from "classnames";
import { withAuth, AuthedLoaderFunction } from "~/utils/auth";
import { definitions } from "~/services/types/supabase";

import { StatPill } from "~/components/common/StatPill";
import { Button } from "~/components/common/Button";
import useSessionResults from "~/hooks/useSessionResults";

type ISession = definitions["sessions"];
type ISessionWithAttempts = definitions["sessions"] & {
  user: definitions["profiles"];
  attempts: definitions["attempts"][];
};

const handleLoad: AuthedLoaderFunction = ({
  supabase,
  response: { data, headers },
}) => {
  return supabase
    .from<ISessionWithAttempts>("sessions")
    .select("*, user:user_id(*), attempts(*, attempter:user_id(*))")
    .order("created_at", { ascending: false })
    .then((sessions) => {
      return json(
        { ...data, sessions: sessions.data },
        {
          headers: headers,
        }
      );
    }) as Promise<Response>;
};

export let loader: LoaderFunction = withAuth(handleLoad);

interface ISessionItemProps {
  session: ISessionWithAttempts;
}

const SessionItem = (props: ISessionItemProps) => {
  const {
    top: [best],
  } = useSessionResults(props.session);

  return (
    <li className="flex flex-col space-y-2">
      <h3 className="text-2xl font-bold uppercase">
        <span className="bg-gradient-to-r from-gray-700 to-green-400 bg-clip-text text-transparent">
          {props.session.title}
        </span>
      </h3>
      <div className="flex flex-col sm:space-x-2 sm:flex-row space-y-2 sm:space-y-0">
        <div className={cx("flex-1", { "opacity-30": !best })}>
          <StatPill label={best?.attempter.name} value={best?.wpm} />
        </div>
        <div className="flex flex-col space-y-2">
          <Link to={props.session.id}>
            <Button sm intent="secondary">
              Make Attempt
            </Button>
          </Link>
          <Button sm intent="primary" disabled={best === undefined}>
            <Link to={`${props.session.id}/results`}>View Results</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="text-xs">
          Created by {props.session.user.name}&nbsp;
        </div>
        <div className="text-gray-400 text-xs">
          on {format(new Date(props.session.created_at), "dd/MM/yyyy")}
        </div>
      </div>
    </li>
  );
};

interface ISessionListProps {
  sessions: ISessionWithAttempts[];
}

const SessionList = (props: ISessionListProps) => {
  return (
    <div className="h-full">
      <ul className="w-96 p-4 space-y-8">
        {props.sessions.map((session) => (
          <SessionItem key={session.id} session={session} />
        ))}
      </ul>
    </div>
  );
};

export default function Sessions() {
  let { sessions } = useLoaderData();

  return <SessionList sessions={sessions} />;
}
