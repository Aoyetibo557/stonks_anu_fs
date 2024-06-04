import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../utils/supabase";
import { useQuery, useMutation, useQueryClient } from "react-query";

export const useProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [hasChannel, setHasChannel] = useState(false);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      const { data: channelData, error: channelError } = await supabase
        .from("channels")
        .select("*")
        .eq("owner_id", id)
        .single();

      setHasChannel(true);
      setChannel(channelData);
    }

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  const updateProfile = async ({ username, notificationPreference }) => {
    const { data, error } = await supabase
      .from("users")
      .update({ username, notification_preferences: notificationPreference })
      .eq("id", id)
      .select("*");
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  const profileQuery = useQuery(["profile", id], fetchProfile, {
    onSuccess: setProfile,
  });

  const profileMutation = useMutation(updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", id]);
    },
  });

  useEffect(() => {
    setLoading(true);
    const channel = supabase
      .channel("channels")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "channels",
        },
        (payload) => {
          if (payload.errors === null) {
            fetchProfile();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      setLoading(false);
    };
  }, [supabase]);

  return {
    profile,
    loading,
    hasChannel,
    userChannel: channel,
    profileQuery,
    profileMutation,
  };
};
