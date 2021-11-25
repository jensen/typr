import React from "react";

export default function SessionTitle(props: React.PropsWithChildren<unknown>) {
  return (
    <h3 className="text-2xl font-bold uppercase">
      <span className="bg-gradient-to-r from-gray-700 to-green-400 text-transparent bg-clip-text">
        {props.children}
      </span>
    </h3>
  );
}
