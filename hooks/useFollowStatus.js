import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export const useFollowStatus = (userId, channelId) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasUpdate, setHasUpdate] = useState(false);

  const checkFollowStatus = async () => {
    if (!userId || !channelId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("follows")
      .select("*")
      .eq("user_id", userId)
      .eq("channel_id", channelId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking follow status:", error);
    } else {
      setIsFollowing(!!data);
    }

    setLoading(false);
  };

  const fetchFollowerCount = async () => {
    if (!channelId) return;

    const { data, error } = await supabase
      .from("follows")
      .select("user_id", { count: "exact" })
      .eq("channel_id", channelId);

    if (error) {
      console.error("Error fetching follower count:", error);
    } else {
      setFollowerCount(data.length);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("follows_change")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "follows",
        },
        (payload) => {
          if (payload.errors === null) {
            setHasUpdate(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      setHasUpdate(false);
    };
  }, [supabase]);

  useEffect(() => {
    checkFollowStatus();
    fetchFollowerCount();
  }, [userId, channelId, hasUpdate]);

  return {
    isFollowing,
    followerCount,
    loading,
    checkFollowStatus,
    fetchFollowerCount,
  };
};
