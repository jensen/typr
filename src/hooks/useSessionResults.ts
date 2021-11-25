import { useLoaderData } from "remix";

export default function useSessionResults(session) {
  const { user } = useLoaderData<{
    user: any;
  }>();

  const attempts = session.attempts.map((attempt) => ({
    ...attempt,
    wpm: Math.round((attempt.words / attempt.seconds) * 60),
  }));

  const recent = [...attempts].sort(
    (l, r) =>
      new Date(r.created_at).getTime() - new Date(l.created_at).getTime()
  );
  const top = [...attempts]
    .sort((l, r) => r.wpm - l.wpm || l.missed - r.missed)
    .slice(0, 5);
  const mine = recent.find((attempt) => attempt.user_id === user?.id);

  return {
    top,
    mine,
  };
}
