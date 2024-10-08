/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Text,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { updateProfile } from "../../api/user";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import {
  sendFriendRequest,
  getFriendDetail,
  acceptFriendRequest,
  declineFriendRequest,
} from "../../api/friend";

const ProfileModal = ({ name, email }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeclineOpen,
    onOpen: onDeclineOpen,
    onClose: onDeclineClose,
  } = useDisclosure();
  const {
    isOpen: isUnfriendOpen,
    onOpen: onUnfriendOpen,
    onClose: onUnfriendClose,
  } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [fullName, setFullName] = useState(name);
  const [emailAddress, setEmailAddress] = useState(email);
  const [profilePicture, setProfilePicture] = useState(null);
  const [friendRequestStatus, setFriendRequestStatus] = useState(null);
  const [isSender, setIsSender] = useState(false);
  const [isReceiver, setIsReceiver] = useState(false);

  const token = Cookies.get("uid");
  let profile_info = {};
  if (token) {
    profile_info = jwtDecode(token);
  }

  const userId = useLocation();
  const profileId = userId.pathname.split("/")[2];
  let checkCurrentUser = false;

  if (profileId === profile_info._id) {
    checkCurrentUser = true;
  }

  const fetchFriendRequestStatus = async () => {
    try {
      const data = await getFriendDetail(profile_info._id, profileId);
      setFriendRequestStatus(data.data.data.status || null);
      setIsSender(data.data.isSender);
      setIsReceiver(data.data.isReceiver);
    } catch (error) {
      setIsSender(false);
      setIsReceiver(false);
      setFriendRequestStatus(null);
    }
  };

  const sendRequest = async () => {
    const data = await sendFriendRequest(profile_info._id, profileId);
    setFriendRequestStatus(data.data[0]?.status);
    fetchFriendRequestStatus();
  };

  const handleSave = async () => {
    await updateProfile(
      profile_info._id,
      fullName,
      emailAddress,
      profilePicture
    );
    onClose();
  };

  const handleAcceptFriend = async () => {
    const res = await acceptFriendRequest(profile_info._id, profileId);
    setFriendRequestStatus(res.data.friendRequest.status);
  };

  const handleDeleteFriend = async () => {
    let res = await declineFriendRequest(
      profile_info._id,
      profileId,
      "decline"
    );
    console.log(res);
    fetchFriendRequestStatus();
    onDeclineClose();
  };

  const handleUnfriend = async () => {
    let res = await declineFriendRequest(
      profile_info._id,
      profileId,
      "unfriend"
    );
    console.log(res);
    fetchFriendRequestStatus();
    onUnfriendClose();
  };

  useEffect(() => {
    if (!checkCurrentUser) {
      fetchFriendRequestStatus();
    }
  }, [checkCurrentUser, userId]);

  return (
    <div>
      {checkCurrentUser ? (
        <Button onClick={onOpen} colorScheme="pink">
          Edit Profile
        </Button>
      ) : !isSender && !isReceiver ? (
        <Button
          colorScheme="blue"
          onClick={sendRequest}
          isDisabled={friendRequestStatus === "pending" || null}
        >
          Add Friend
        </Button>
      ) : (
        <Box>
          {friendRequestStatus === "accepted" ? (
            <Button onClick={onUnfriendOpen}>Friends</Button>
          ) : isSender ? (
            <Button isDisabled>Friend request sent</Button>
          ) : (
            <Box display={"flex"} gap={3}>
              <Button colorScheme="blue" onClick={handleAcceptFriend}>
                Accept
              </Button>
              <Button colorScheme="red" onClick={onDeclineOpen}>
                Decline
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Your Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Profile Picture</FormLabel>
              <Input
                name="profileImage"
                type="file"
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Decline Confirmation Modal */}
      <Modal isOpen={isDeclineOpen} onClose={onDeclineClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Decline</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to decline this friend request?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteFriend}>
              Decline
            </Button>
            <Button onClick={onDeclineClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Unfriend Confirmation Modal */}
      <Modal isOpen={isUnfriendOpen} onClose={onUnfriendClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Unfriend</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to unfriend this user?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleUnfriend}>
              Unfriend
            </Button>
            <Button onClick={onUnfriendClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
