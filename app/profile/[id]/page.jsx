"use client";

import React, { useState } from "react";
import { useProfile } from "../../../hooks/useProfile";
import { useChannel } from "../../../hooks/useChannel";
import { useChannelActions } from "../../../hooks/useChannelActions";
import { useFollow } from "../../../hooks/useFollow";
import { Avatar, Spin, Modal, Divider, message } from "antd";
import { ProfileAvatar } from "../../../components/profile/profileAvatar";
import { StreamingControls } from "../../../components/profile/StreamingControls";
import { useUser } from "../../../hooks/userUser";
import { useFollowStatus } from "../../../hooks/useFollowStatus";

const ViewProfile = () => {
  const { user } = useUser();
  const {
    profile,
    loading,
    hasChannel,
    userChannel,
    channelCount,
    profileQuery,
    profileMutation,
  } = useProfile();
  const {
    startStreamingMutation,
    stopStreamingMutation,
    isStartingStreaming,
    isStoppingStreaming,
  } = useChannelActions();
  const { followMutation } = useFollow(user, profile?.id);
  const {
    isFollowing,
    followerCount,
    loading: followLoading,
  } = useFollowStatus(user?.id, userChannel?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [notificationPreference, setNotificationPreference] = useState("");

  const handleStartStreaming = () => {
    if (profile?.id) {
      startStreamingMutation.mutate(profile.id);
    }
  };

  const handleStopStreaming = () => {
    if (profile?.id) {
      stopStreamingMutation.mutate(profile.id);
    }
  };

  const handleFollowClick = () => {
    followMutation.mutate();
  };

  const handleOk = () => {
    profileMutation.mutate({
      username,
      notificationPreference,
    });
    setIsModalOpen(false);
  };

  if (profileQuery.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="flex flex-col">
        <div className="flex flex-row items-center">
          <ProfileAvatar
            profile={profile}
            onEditClick={() => setIsModalOpen(true)}
          />
          <div className=" flex flex-col items-center p-5 gap-2">
            <span className="font-bold text-xl">{channelCount}</span>
            <span className="font-normal text-base">channels</span>
          </div>
        </div>
      </div>
      <Divider />

      <div>
        <Modal
          title="Complete Your Profile"
          open={isModalOpen}
          onOk={handleOk}
          centered
          onCancel={() => setIsModalOpen(!isModalOpen)}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                placeholder="username30"
                value={username}
                className="p-2 w-full border-2 border-gray-500 focus:outline-none focus:border-blue-600 rounded-md"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-5">
              <label htmlFor="notificationPreference">
                Notification Preference
              </label>
              <input
                type="text"
                placeholder="Email/SMS"
                value={notificationPreference}
                className="p-2 w-full border-2 border-gray-500 focus:outline-none focus:border-blue-600 rounded-md"
                onChange={(e) => setNotificationPreference(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ViewProfile;
