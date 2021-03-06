import cx from "classnames";

interface ILoading {
  show: boolean;
}

interface ISpinnerProps extends ILoading {}

export const Spinner = (props: ISpinnerProps) => {
  return (
    <div
      className={cx("flex justify-center items-center", {
        "opacity-0": props.show === false,
      })}
    >
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

interface IProgressProps extends ILoading {}

export const Progress = (props: IProgressProps) => {
  return (
    <div
      className={cx(
        "loading w-full bg-gradient-to-r from-green-600 to-green-400 h-1",
        {
          "opacity-0": props.show === false,
        }
      )}
    ></div>
  );
};
