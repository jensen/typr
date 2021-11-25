## Purpose

This project was completed as part of a group learning exercise. The primary goal for this project is exposure to the [Remix](https://remix.run/) full stack framework which was just released publicly. The challenge of these tends to be how to integrate the various dependencies. Using [supabase](https://supabase.com/) for authentication and peristant storage allowed for some interesting exploration into Remix.

I was able to get some code examples from @fergus on the Remix discord server which helped me get it working quickly. The Supabase JavaScript client is browser only currently.

## Demo

https://user-images.githubusercontent.com/14803/143400503-9fc6a3f2-8019-4cae-9c16-216cb0613b0c.mp4

[https://typr-group-learn.netlify.app/](https://typr-group-learn.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/7ebd59d9-9d26-458b-99e4-69c1c8a26a34/deploy-status)](https://app.netlify.com/sites/typr-group-learn/deploys)

## Project Features

### User Stories

1. ✅ User can click a 'Start Practice' button to start the practice session.
2. ✅ When a practice session starts, the timer starts increasing

These stories are handled by a few options where the user can create their own sessions, or participate in other sessions. There is no visible timer, but the session is timed to allow for the words per minute calculation.

3. ✅ User is shown a word
4. ✅ User can type the word in a text input box
5. ✅ If a user enters an incorrect letter, the text input box is cleared
6. ✅ If a user enters all letters correctly, then the text input box is cleared and a new word is shown

The user is shown a bunch of words all at once, up to six lines. Each line should have a least three words. The user cannot proceed untilt they correct any mistakes in a line. When they finish a line, the cursor moves to the next line automatically.

7. ✅ User can click "End Practice" button to end the session.
8. ✅ When the session ends, the typing speed is shown (words per minute)

The session is ended automatically when all characters are typed correctly.

### Bonus features

1. ✅ Text box is not cleared when a wrong letter is typed instead as the user is writing the word, the correct letters are marked as green and the incorrect letters are marked as red

The incorrect letters are marked as red. The correct letters have a black background with white text.

2. ✅ User can see their statistics across multiple sessions

The results are stored after each completed session.

3. ✅ Users can login and see how their score compared with others (leaderboard)

If a user is logged in, their session is stored. In the results view for each session there is a "Top 5" leaderboard.

4. ✅ Users can compete with others

Leaderboard.

## Technical Specifications

The main difference between this application and the previous submissions lies in the framework that is used. Remix is a framework that embraces server rendering.

The previous submissions were architected as single page applications with cached server state.

### Dependencies

- remix-run
- supabase/js
- xstate
- tailwindcss
- postgres

### Remix

As with all first attempts at a framework, mistakes were made. The situation I faced was one where I would read documentation telling me not to do the thing I just did. This is what I meant when I claimed I was able to explore Remix. I now have a good baseline for refactoring, it can be more idiomatic to Remix.

> It should be noted that I customized the folder structure slightly. I switched `app` to `src` as an example. No major changes, but leaping head first into convention is hard.

### Typing Interface

The typing interface uses xstate to manage the data model for the typing input. The results are calculated from various values that are recorded as the user types.

![image](https://user-images.githubusercontent.com/14803/143401906-de59d765-4adc-4bff-9ee0-e490f5dc530a.png)

The user can idle until they press space or click the start button. This action sends the the `START` event to the state machine causing a transition to the `started` state. On entry to the `started` state the context will be updated with the current time as `timeStarted`.

As the user types it will keep track of their input by sending an `INPUT` event as the input string grows. The `INPUT` event is the most complicated one in the machine.

First if we have reached the end of the last line, we can transition directly to the `results` state.

```javascript
{
  target: "results",
  cond: "isEndOfLastLine",
}
```

If that doesn't happen, then we can update the context in the machine to reflect our cursor pointing to the beginning of the next line. This only happens if the line is complete, including fully valid.

```javascript
{
  actions: assign((context, event) => ({
    currentLine: context.currentLine + 1,
    currentPosition: 0,
  })),
  cond: "isLineComplete",
}
```

And in the most common case we need to keep track of the mistakes as the user types.

```javascript
{
  actions: assign((context, event) => {
    /* long way to get the two characters we need to compare */
    const current =
      context.lines[context.currentLine][context.currentPosition];
    const newest = event.input[context.currentPosition];

    /* add one to the mistake count if they aren't the same */
    return {
      mistakeCount:
        context.mistakeCount +
        (newest && current !== newest ? 1 : 0),
      typed: context.typed.map((line, index) =>
        index === context.currentLine ? event.input : line
      ),
      currentPosition: event.position,
    };
  }),
}
```

Completing the last line will transition to the `results` state where the timestamp for the end of the session is recorded on entry. An action is triggered that results in the submission of the form to the `/results` endpoint for the session.

### Async/Await

The Remix documentation uses async/await heavily. I don't really have a preference either way. I do like to provide public examples using the Promise API directly.

### Auth

The backend is hosted by supabase. I chose to use discord as a provider since the group is discord based. The user can view sessions and try the typing input without logging in. If the user wants to compete with others then they must login.

The process for handling this login with the browser based library
