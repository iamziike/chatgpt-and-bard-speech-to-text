import { render } from "solid-js/web";
import App from "./App";

const container = document.createElement("div");
document.body.append(container);
render(() => <App />, container);
