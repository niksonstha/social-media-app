import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      // Global styles for the entire application
      body: {
        bg: "#F3D0D7",
        fontFamily: '"Poppins", sans-serif',
        color: "black",
      },
      "*::-webkit-scrollbar": {
        width: "10px",
      },

      "*::-webkit-scrollbar-track": {
        background: "transparent",
      },

      "*::-webkit-scrollbar-thumb": {
        backgroundColor: "#921A40",
        borderRadius: "6px",
      },
    },
  },
});

export default theme;
