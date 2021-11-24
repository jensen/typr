import ReactDOM from "react-dom";
import { RemixBrowser } from "remix";

import { inspect } from "@xstate/inspect";

/*
inspect({
  // options
  // url: 'https://statecharts.io/inspect', // (default)
  iframe: false, // open in new window
});
*/

ReactDOM.hydrate(<RemixBrowser />, document);
