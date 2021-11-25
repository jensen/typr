import { useState } from "react";
import type { ActionFunction, LoaderFunction } from "remix";
import { json, redirect, Form, useTransition } from "remix";
import {
  withAuth,
  AuthedActionFunction,
  AuthedLoaderFunction,
} from "~/utils/auth";

import { Button } from "~/components/common/Button";

const handleAction: AuthedActionFunction = ({ request, supabase }) => {
  return request
    .formData()
    .then((data) =>
      supabase.from("sessions").insert([{ lines: data.getAll("line") }])
    )
    .then(({ data, error }) => {
      const [session] = data || [];

      if (session) {
        return redirect(`/sessions/${session.id}`);
      }

      return redirect("/sessions");
    });
};

export let action: ActionFunction = withAuth(handleAction);

const handleLoad: AuthedLoaderFunction = ({
  supabase,
  response: { data, headers },
}) => {
  return supabase
    .from("sessions")
    .select()
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

interface ILineInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  index: number;
}

const LineInput = (props: ILineInputProps) => {
  return (
    <input
      className="rounded border-green-400 border-2 px-4 py-2"
      placeholder={props.placeholder}
      name={`line`}
    />
  );
};

export default function CreateSession() {
  const { state } = useTransition();
  const [lines, setLines] = useState(["", "", "", "", "", ""]);

  return (
    <div className="w-96">
      <Form method="post" className="flex flex-col space-y-2">
        <input name="title" />
        {lines.map((line, index) => (
          <LineInput key={index} index={index} />
        ))}
        <Button intent="primary" busy={state !== "idle"} type="submit">
          Create Session
        </Button>
      </Form>
    </div>
  );
}
