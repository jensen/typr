import { createCookieSessionStorage } from "remix";

let cookieSessionKeyA = process.env.COOKIE_SESSION_KEY_A;
let cookieSessionKeyB = process.env.COOKIE_SESSION_KEY_B;

if (typeof cookieSessionKeyA !== "string") {
  throw new Error("Most provide COOKIE_SESSION_KEY_A");
}

if (typeof cookieSessionKeyB !== "string") {
  throw new Error("Most provide COOKIE_SESSION_KEY_B");
}

export default createCookieSessionStorage({
  cookie: {
    name: "auth",
    expires: new Date(Date.now() + 60480000),
    httpOnly: true,
    maxAge: 604800,
    path: "/",
    sameSite: "strict",
    secrets: [cookieSessionKeyA, cookieSessionKeyB],
    secure: true,
  },
});
