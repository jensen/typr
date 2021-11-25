import { Spinner } from "~/components/common/Loading";

export default function Auth() {
  return (
    <div className="px-8 py-2 rounded-full flex justify-center items-center bg-green-400 space-x-4">
      <Spinner show />
      <span className="text-white">Authenticating</span>
    </div>
  );
}
