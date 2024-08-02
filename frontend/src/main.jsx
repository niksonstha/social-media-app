import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./chakraTheme/theme.js";
import { BrowserRouter } from "react-router-dom";
import { PostsProvider } from "./store/PostsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <PostsProvider>
        <App />
      </PostsProvider>
    </ChakraProvider>
  </BrowserRouter>
);
