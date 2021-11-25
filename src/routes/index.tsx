import { LinksFunction, LoaderFunction, useLoaderData } from "remix";
import { json } from "remix";
import { LinkButton } from "~/components/common/Button";
import { DiscordLoginButton } from "~/components/DiscordLoginButton";
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
  let data = useLoaderData();

  return (
    <div className="flex flex-col items-center space-y-8">
      <h3 className="text-2xl mb-8 font-light">
        <span className="font-light">welcome to </span>
        <span className="font-black">typr.</span>
      </h3>
      <LinkButton to="/sessions" intent="secondary">
        View Sessions
      </LinkButton>
      {data.user && (
        <LinkButton to="/sessions/new" intent="primary">
          Create Session
        </LinkButton>
      )}
      {data.user === null && (
        <>
          <DiscordLoginButton />{" "}
          <p className="text-xs text-gray-400">
            Must login to create a session or save results.
          </p>
        </>
      )}
    </div>
  );
}
