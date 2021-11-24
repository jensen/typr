interface IStatPillProps {
  label: string;
  value: string | number;
}

export function StatPill(props: IStatPillProps) {
  return (
    <div className="w-full h-12 p-2 flex rounded-full bg-green-400 justify-between">
      <div className="p-4 flex items-center text-white font-bold">
        {props.label}
      </div>
      <div className="p-4 w-8 h-8 rounded-full flex bg-white justify-center items-center">
        {props.value}
      </div>
    </div>
  );
}
