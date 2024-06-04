"use client";

import React, { useState, useEffect } from "react";
import { useChannel } from "../../../hooks/useChannel";
import { useChannelActions } from "../../../hooks/useChannelActions";
import { useFollow } from "../../../hooks/useFollow";
import { Avatar, Spin, message } from "antd";
import { StreamingControls } from "../../../components/channels/streamingControls";
import { useUser } from "../../../hooks/userUser";
import { useFollowStatus } from "../../../hooks/useFollowStatus";
import { useParams } from "next/navigation";
import { supabase } from "../../../utils/supabase";

const ViewChannel = () => {
  const { user } = useUser();
  const { id } = useParams();
  const {
    channel,
    loading,
    streamCount,
    fetchChannel,
    channelQuery,
    getChannelStreamCount,
  } = useChannel(id);
  const {
    startStreamingMutation,
    stopStreamingMutation,
    isStartingStreaming,
    isStoppingStreaming,
  } = useChannelActions();
  const { followMutation, unFollowMutation, isFollowLoading } = useFollow(
    user,
    channel?.id
  );
  const {
    isFollowing,
    followerCount,
    loading: followLoading,
  } = useFollowStatus(user?.id, channel?.id);

  const [isLoading, setIsLoading] = useState(false);

  const IS_CHANNEL_OWNER = user?.id === channel?.owner_id;

  const handleStartStreaming = () => {
    if (channel?.id) {
      startStreamingMutation.mutate(channel.id);
    }
  };

  const handleStopStreaming = () => {
    if (channel?.id) {
      stopStreamingMutation.mutate(channel.id);
    }
  };

  const handleFollowClick = () => {
    followMutation.mutate();
  };

  const handleUnfollowClick = () => {
    unFollowMutation.mutate();
  };

  if (channelQuery.isLoading) {
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
        <div className="flex flex-row">
          <div className="h-2/4 p-10 flex flex-row items-center gap-5">
            <Avatar
              size={180}
              shape="square"
              className="bg-gray-300 p-2"
              src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${channel?.name}`}
            />
            <div>
              <div className="font-medium text-lg">@{channel?.name}</div>
              <div className="font-normal mb-4 text-base">
                {channel?.description}
              </div>

              <StreamingControls
                channel={channel}
                startStream={handleStartStreaming}
                stopStream={handleStopStreaming}
                isStartingStreaming={isStartingStreaming}
                isStoppingStreaming={isStoppingStreaming}
              />

              <div className="flex flex-row  gap-5">
                {!IS_CHANNEL_OWNER && (
                  <>
                    {user && (
                      <button
                        type="button"
                        className="w-[110px] rounded-md text-white text-sm font-normal bg-blue-500 hover:bg-blue-700 hover:scale-105 hover:ease-in-out">
                        Chat
                      </button>
                    )}

                    {!isFollowing ? (
                      <button
                        type="button"
                        onClick={handleFollowClick}
                        className="w-[110px] rounded-md text-black text-base font-normal border-2 border-solid border-gray-700 hover:scale-105 hover:ease-in-out">
                        Follow
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleUnfollowClick}
                        className="w-[110px] rounded-md text-black text-base font-normal border-2 border-solid border-gray-700 hover:scale-105 hover:ease-in-out">
                        Unfollow
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {IS_CHANNEL_OWNER && (
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <span className={"text-xl font-bold"}>{streamCount}</span>
                <span className="font-normal text-base">streams</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className={"text-xl font-bold"}>{followerCount}</span>
                <span className="font-normal text-base">followers</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-10">
        {channel?.is_streaming && (
          <div>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/jfKfPfyJRdk"
              frameBorder="0"
              autoPlay
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewChannel;
