import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useUser } from "./userUser";
import { useQuery } from "react-query";

export const useChannel = (channelId) => {
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channel, setChannel] = useState(null);
  const [streamCount, setStreamCount] = useState(0);

  useEffect(() => {
    if (!userLoading) {
      setLoading(false);
    }
  }, [userLoading]);

  const userHasChannel = async () => {
    if (!user) return false;

    const { data, error } = await supabase
      .from("channels")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      setError(error);
      return false;
    }

    return data ? true : false;
  };

  const createNewChannel = async (channelName) => {
    if (!user) return;

    // Check if the channel name already exists
    const { data: existingChannel, error: checkError } = await supabase
      .from("channels")
      .select("id")
      .eq("name", channelName)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      setError(checkError);
      return { success: false, message: "Error checking channel name" };
    }

    if (existingChannel) {
      return { success: false, message: "Channel name already exists" };
    }

    const { data, error } = await supabase
      .from("channels")
      .insert([{ name: channelName, owner_id: user.id }]);

    if (error) {
      setError(error);
      return { success: false, message: "Error creating channel" };
    }

    return { success: true, data };
  };

  const getAllChannels = async () => {
    const { data, error } = await supabase.from("channels").select("*");
    if (error) {
      setError(error);
      return [];
    }
    return data;
  };

  const getChannelStreamCount = async () => {
    const { data, error } = await supabase
      .from("streams")
      .select("channel_id", { count: "exact" });

    // count how many strems with channel_id matches your channelId
    const stCount = data.filter(
      (stream) => stream.channel_id === channelId
    ).length;
    setStreamCount(stCount);

    if (error) {
      throw new Error(error);
    }
  };

  const fetchChannel = async (id) => {
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      setError(error);
      return null;
    }
    return data;
  };

  const channelQuery = useQuery(
    ["channel", channelId],
    () => fetchChannel(channelId),
    {
      enabled: !!channelId,
    }
  );

  useEffect(() => {
    if (channelQuery.data) {
      setChannel(channelQuery.data);
      getChannelStreamCount(channel?.id);
    }
  }, [channelQuery.data]);

  return {
    getAllChannels,
    createNewChannel,
    userHasChannel,
    streamCount,
    loading,
    error,
    channel,
    channelQuery,
    fetchChannel,
    getChannelStreamCount,
  };
};
