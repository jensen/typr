import { useState } from "react";
import { ActionFunction, LoaderFunction, useActionData } from "remix";
import { json, redirect, Form, useTransition } from "remix";
import {
  withAuth,
  AuthedActionFunction,
  AuthedLoaderFunction,
} from "~/utils/auth";

import { Button } from "~/components/common/Button";

const validateData = (data) => {
  const title = data.get("title");
  const lines = data.getAll("line");

  const errors: any = new Set();

  if (title.length < 3) {
    errors.add("Title must be at least 3 characters");
  }

  if (lines.length === 0 || (lines.length === 1 && lines[0] === "")) {
    errors.add("Must includes at least 1 line");
  }

  for (const line of lines) {
    if (line.length < 5 || line.split(" ").length < 3) {
      errors.add("Lines must have at least 3 words");
    }
  }

  return { data, errors: errors.size > 0 ? Array.from(errors) : null };
};

const handleAction: AuthedActionFunction = ({ request, supabase }) => {
  return request
    .formData()
    .then(validateData)
    .then(({ data, errors }) => {
      if (errors && Object.keys(errors).length) {
        return json(errors, { status: 422 });
      }

      return supabase
        .from("sessions")
        .insert([{ lines: data.getAll("line") }])
        .then(({ data, error }) => {
          const [session] = data || [];

          if (session) {
            return redirect(`/sessions/${session.id}`);
          }

          return redirect("/sessions");
        });
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
  onDelete: (() => void) | null;
}

const LineInput = (props: ILineInputProps) => {
  return (
    <div className="w-full flex">
      <input
        className="flex-1 border-l-4 border-green-400 bg-gray-100 px-2 py-1 text-lg"
        placeholder={props.placeholder}
        name="line"
      />
      {props.onDelete && (
        <div
          className="px-2 bg-red-400 flex items-center"
          onClick={props.onDelete}
        >
          <svg
            className="h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 352 512"
            fill="white"
          >
            <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default function CreateSession() {
  const errors = useActionData();
  const { state } = useTransition();
  const [lines, setLines] = useState([""]);

  console.log(errors);
  return (
    <div className="w-96">
      <Form method="post" className="flex flex-col space-y-2">
        <input
          name="title"
          className="text-2xl border-green-400 border-4 px-4 py-2"
          placeholder="Title"
        />
        {lines.map((line, index) => (
          <LineInput
            key={index}
            index={index}
            onDelete={
              index > 0
                ? () => setLines((prev) => prev.filter((_, i) => i !== index))
                : null
            }
          />
        ))}
        <br />
        <Button
          intent="secondary"
          type="button"
          disabled={lines.length === 6 || state !== "idle"}
          onClick={() => setLines((prev) => [...prev, ""])}
        >
          Add Line
        </Button>
        <Button intent="primary" busy={state !== "idle"} type="submit">
          Create Session
        </Button>
        {errors && (
          <div className="text-red-400">
            <div className="font-bold uppercase">Errors</div>
            {errors.map((error) => (
              <div className="text-sm">{error}</div>
            ))}
          </div>
        )}
      </Form>
    </div>
  );
}
