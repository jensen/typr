import React from "react";
import { Link } from "remix";
import cx from "classnames";
import { Spinner } from "~/components/common/Loading";

interface IButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  intent: "primary" | "secondary" | "danger";
  busy?: boolean;
  sm?: boolean;
}

interface ILinkButtonProps extends IButtonProps {
  to: string;
}

export function LinkButton(props: ILinkButtonProps) {
  if (props.to && !props.disabled) {
    return (
      <Link to={props.to} className="w-full">
        <Button {...props}>{props.children}</Button>
      </Link>
    );
  }
  return <Button {...props}>{props.children}</Button>;
}

export function Button({
  className,
  intent,
  busy = false,
  sm = false,
  ...props
}: IButtonProps) {
  return (
    <button
      className={cx(
        "w-full",
        "flex justify-center rounded-full",
        "uppercase font-bold",
        "disabled:opacity-50 disabled:hover:bg-none",
        {
          "px-8 py-2": sm === false,
          "px-4 py-2 text-sm": sm === true,
        },
        {
          "bg-green-400 text-white hover:bg-green-600": intent === "primary",
          "bg-gray-800 text-white hover:bg-gray-600": intent === "secondary",
          "bg-red-400 text-white hover:bg-red-600": intent === "danger",
        },
        className
      )}
      onClick={props.onClick}
      disabled={props.disabled || busy}
      type={props.type}
    >
      {busy ? <Spinner show /> : props.children}
    </button>
  );
}
