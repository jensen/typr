import { createClient } from "@supabase/supabase-js";
export type {
  Session as ISupabaseSession,
  User as ISupabaseUser,
  PostgrestResponse as ISupabasePostgrestResponse,
} from "@supabase/supabase-js";

let supabaseUrl;
let supabaseAnonKey;

try {
  supabaseUrl = process.env.SUPABASE_URL;
  supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
} catch {
  supabaseUrl = (window as WindowWithEnvironment).env.SUPABASE_URL;
  supabaseAnonKey = (window as WindowWithEnvironment).env.SUPABASE_ANON_KEY;
}

if (typeof supabaseUrl !== "string") {
  throw new Error("Most provide SUPABASE_URL");
}

if (typeof supabaseAnonKey !== "string") {
  throw new Error("Most provide SUPABASE_ANON_KEY");
}

const client = createClient(supabaseUrl, supabaseAnonKey);

export const supabase = (jwt: string) => {
  client.auth.setAuth(jwt);
  return client;
};

export default client;
