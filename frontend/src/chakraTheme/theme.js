import { extendTheme } from "@chakra-ui/react";

const breakpoints = {
  sm: "320px", // Small screen (mobile)
  md: "768px", // Medium screen (tablet)
  lg: "992px", // Large screen (small laptops)
  xl: "1920px", // Extra large screen (desktops)
  "2xl": "2440px", // 2X large screen (larger desktops)
};

const theme = extendTheme({
  breakpoints, // Adding custom breakpoints
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
