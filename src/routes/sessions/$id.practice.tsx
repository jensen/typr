import { useLocation } from "react-router-dom";
import { DiscordLoginButton } from "~/components/DiscordLoginButton";
import { calculateWordsPerMinute } from "~/utils/calculations";

export default function SessionPractice(props) {
  const { search } = useLocation();

  const params = new URLSearchParams(search);

  const wpm = calculateWordsPerMinute(
    Number(params.get("seconds")),
    Number(params.get("words"))
  );

  return (
    <div className="w-96 p-4 space-y-4 ">
      <div className="text-white border rounded-lg p-4 bg-gradient-to-r from-green-600 to-green-300 flex justify-between">
        <div className="flex justify-center items-center bg-white rounded-lg p-2">
          <div className="shadow-sm font-bold text-8xl bg-gradient-to-r from-green-600 to-green-300 text-transparent bg-clip-text">
            {wpm}
          </div>
        </div>
        <div className="flex-1 pl-4 flex justify-center items-center font-black text-4xl uppercase">
          Words Per Minute
        </div>
      </div>
      <h2 className="text-green-400 leading-xtight text-4xl font-black">
        That was good practice.
      </h2>
      <h4 className="text-gray-800 leading-tight text-2xl font-light">
        Unfortunately we cannot record your score unless you login.
      </h4>
      <DiscordLoginButton />
    </div>
  );
}
