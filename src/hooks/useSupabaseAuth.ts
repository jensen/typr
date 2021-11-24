import { useEffect } from "react";
import { useSubmit } from "remix";
import supabase from "~/services";

export default function useSupabaseAuth() {
  const submit = useSubmit();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const body = { event, token: session?.access_token ?? "" };

        submit(body, { method: "post" });
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);
}
