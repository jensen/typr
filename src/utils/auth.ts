import { SupabaseClient } from "@supabase/supabase-js";
import type { LoaderFunction, ActionFunction } from "remix";
import type { DataFunctionArgs } from "@remix-run/server-runtime/routeModules";
import supabase, { supabase as supabaseAuthed } from "~/services";
import cookie from "~/services/cookie.server";

export interface AuthedArgs {
  supabase: SupabaseClient;
  response: {
    data: {
      user: any;
      error: any;
    };
    headers: {
      "Set-Cookie": string;
    };
  };
}

export type AuthedActionFunction = (
  args: DataFunctionArgs & AuthedArgs
) => Promise<Response> | Response;

export type AuthedLoaderFunction = (
  args: DataFunctionArgs & AuthedArgs
) => Promise<Response> | Response;

export function withAuth(
  fn: AuthedLoaderFunction | AuthedActionFunction
): LoaderFunction | ActionFunction {
  return (args) =>
    cookie.getSession(args.request.headers.get("Cookie")).then((session) => {
      const token = session.get("token");

      return supabase.auth.api.getUser(token).then((data) => {
        const supabase = supabaseAuthed(token);

        const response = (cookie: string) => {
          return fn({
            ...args,
            supabase,
            response: {
              data: { user: data.user, error: data.error },
              headers: {
                "Set-Cookie": cookie,
              },
            },
          });
        };

        if (data.error) {
          return cookie.destroySession(session).then(response);
        }

        return cookie.commitSession(session).then(response);
      });
    });
}
