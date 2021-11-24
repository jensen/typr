import React from "react";
import type { ActionFunction, LinksFunction, MetaFunction } from "remix";
import {
  Meta,
  Links,
  Scripts,
  useLoaderData,
  LiveReload,
  useCatch,
  json,
  redirect,
  useTransition,
} from "remix";
import { Outlet } from "react-router-dom";
import { AuthedLoaderFunction, withAuth } from "~/utils/auth";
import cookie from "~/services/cookie.server";

import useSupabaseAuth from "~/hooks/useSupabaseAuth";

import { Progress } from "~/components/common/Loading";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

import stylesUrl from "./styles/global.css";

export let meta: MetaFunction = () => {
  return {
    title: "typr.",
    description: "https://github.com/jensen/typing-tutor",
    viewport: "width=device-width, initial-scale=1",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let action: ActionFunction = ({ request }) => {
  return Promise.all([
    cookie.getSession(request.headers.get("Cookie")),
    request.formData(),
  ]).then(([session, body]) => {
    const event = body.get("event");
    const token = body.get("token");

    if (event === "SIGNED_IN") {
      session.set("token", token);

      return cookie.commitSession(session).then((cookie) => {
        return redirect("/", {
          headers: {
            "Set-Cookie": cookie,
          },
        });
      });
    }

    return cookie.destroySession(session).then((cookie) =>
      redirect("/", {
        headers: {
          "Set-Cookie": cookie,
        },
      })
    );
  });
};

const handleLoad: AuthedLoaderFunction = ({ response }) => {
  return json({
    user: response.data.user,
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      CLIENT_HOST: process.env.CLIENT_HOST,
    },
  });
};

export let loader = withAuth(handleLoad);

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>{children}</Layout>
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout(props: { children: React.ReactNode }) {
  let data = useLoaderData();

  const { state } = useTransition();

  return (
    <main className="h-full flex flex-col">
      <Header user={data.user} />
      <Progress show={state === "loading"} />
      <div className="flex-1 relative">
        <section className="h-full w-full flex justify-center items-center absolute overflow-x-hidden overflow-y-scroll">
          {props.children}
        </section>
      </div>
      <Footer />
    </main>
  );
}

export default function Application() {
  let data = useLoaderData();

  useSupabaseAuth();

  return (
    <Document>
      <Outlet />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.env = ${JSON.stringify(data.env)}`,
        }}
      />
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 404:
      return (
        <Document title={`${caught.status} ${caught.statusText}`}>
          <h1>
            {caught.status} {caught.statusText}
          </h1>
        </Document>
      );

    default:
      throw new Error(
        `Unexpected caught response with status: ${caught.status}`
      );
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document title="Uh-oh!">
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <p>
        Replace this UI with what you want users to see when your app throws
        uncaught errors.
      </p>
    </Document>
  );
}
