import React from "react";
import supabase from "~/services";

type Provider = "discord";

export default function useSupabaseLogin(provider: Provider) {
  return React.useCallback(
    () =>
      supabase.auth.signIn(
        {
          provider,
        },
        { redirectTo: `${(window as WindowWithEnvironment).env.CLIENT_HOST}/` }
      ),
    []
  );
}
