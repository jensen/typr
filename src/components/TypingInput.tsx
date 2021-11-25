import React, { useEffect } from "react";
import cx from "classnames";
import useEditable from "~/hooks/useEditable";

interface ITypingInputProps {
  position: number;
  line: string;
  input: string;
  onInput: any;
}

const TypingInput = (props: ITypingInputProps) => {
  const editorRef = React.useRef<HTMLDivElement>(null);

  const onEditableChange = (input, { position }) => {
    props.onInput(input.slice(0), position);
  };

  useEditable(editorRef, onEditableChange, { onReturn: () => null });

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  return (
    <div
      className="relative border-l-4 border-green-400 px-2 select-none"
      onClick={() => editorRef.current?.focus()}
    >
      <div
        className="absolute text-white"
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        ref={editorRef}
      >
        {props.input}
      </div>
      {/* <div className="absolute z-10 bg-black">
        {props.input.split("").map((char, index) => (
          <span
            key={index}
            className={cx({
              "text-white bg-red-400": props.line[index] !== props.input[index],
              "text-white bg-black": props.line[index] === props.input[index],
            })}
          >
            {char}
          </span>
        ))}
      </div> */}
      <div>
        {props.line.split("").map((char, index) => (
          <span
            key={index}
            className={cx("transition-opacity duration-300", {
              "text-white bg-red-400":
                index < props.position &&
                props.line[index] !== props.input[index],
              "text-white bg-black":
                index < props.position &&
                props.line[index] === props.input[index],
            })}
          >
            <span
              className={cx("transition-opacity duration-300", {
                "opacity-0": index < props.position,
                "opacity-70": index >= props.position,
              })}
            >
              {char}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TypingInput;
