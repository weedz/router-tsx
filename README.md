# router-tsx

[![npm](https://img.shields.io/npm/v/@weedzcokie/router-tsx?style=flat-square)](https://www.npmjs.com/package/@weedzcokie/router-tsx)

## Example

Paths are handled by [router](https://github.com/weedz/router).

```jsx
import { RouterComponent as Router } from "@weedzcokie/router-tsx";
import Home from "./Home";
import About from "./About";
import Todo from "./Todo";
<Router>
    <Home path="/" />
    <About path="/about" />
    <Todo path="/todos" />
    <Todo path="/todos/:todo" /> {/* props = { todo: 1, url: "/todos/1" } */}
</Router>
```
