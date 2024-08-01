/* eslint-disable react/prop-types */
import { Box } from "@chakra-ui/react";

const Backdrop = ({ children, onClose }) => {
  return (
    <Box
      pos="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgColor="rgba(0, 0, 0, 0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1}
      onClick={onClose}
    >
      {children}
    </Box>
  );
};

export default Backdrop;
