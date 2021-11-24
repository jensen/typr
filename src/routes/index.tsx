import type { LinksFunction, LoaderFunction } from "remix";
import { json } from "remix";
import { Link } from "react-router-dom";
import { Button } from "~/components/common/Button";
import { withAuth, AuthedLoaderFunction } from "~/utils/auth";

import stylesUrl from "../styles/index.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const handleLoad: AuthedLoaderFunction = ({ response: { data, headers } }) =>
  json(data, {
    headers,
  });

export let loader: LoaderFunction = withAuth(handleLoad);

export default function Index() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-2xl mb-8 font-light">
        Welcome to <span className="font-black">typr.</span>
      </h3>
      <Link to="/sessions">
        <Button intent="secondary">View Sessions</Button>
      </Link>
      <Link to="/sessions/new">
        <Button intent="primary">Start Session</Button>
      </Link>
    </div>
  );
}
