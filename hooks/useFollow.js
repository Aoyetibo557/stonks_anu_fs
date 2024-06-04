import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";
import { useState, useEffect } from "react";

export const useFollow = (user, channelId) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);

  const followChannel = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("follows")
      .insert([{ user_id: user?.id, channel_id: channelId }])
      .select("*");

    if (error) throw new Error(error.message);

    return data;
  };

  const unfollowChannel = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("follows")
      .delete()
      .eq("user_id", user?.id)
      .eq("channel_id", channelId);
    if (error) throw new Error(error.message);
  };

  const followMutation = useMutation(followChannel, {
    onSuccess: () => {
      queryClient.invalidateQueries(["followers", channelId]);
    },
  });

  const unFollowMutation = useMutation(unfollowChannel, {
    onSuccess: () => {
      queryClient.invalidateQueries(["followers", channelId]);
    },
  });

  return {
    followMutation,
    unFollowMutation,
    isFollowLoading: followMutation.isLoading,
  };
};
