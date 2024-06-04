import { useMutation, useQueryClient } from "react-query";
import { supabase } from "../utils/supabase";
import { useState, useEffect } from "react";

export const useChannelActions = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const startStreaming = async (id) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("channels")
        .update({ is_streaming: true })
        .eq("id", id);

      if (error) throw new Error(error.message);

      await supabase
        .from("streams")
        .insert([{ channel_id: id, is_live: true }]);

      return data;
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stopStreaming = async (id) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("channels")
        .update({ is_streaming: false })
        .eq("id", id);

      if (error) throw new Error(error.message);

      await supabase
        .from("streams")
        .update({ is_live: false })
        .eq("channel_id", id);

      return data;
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startStreamingMutation = useMutation(startStreaming, {
    onSuccess: () => queryClient.invalidateQueries("channel"),
  });

  const stopStreamingMutation = useMutation(stopStreaming, {
    onSuccess: () => queryClient.invalidateQueries("channel"),
  });

  return {
    startStreamingMutation,
    stopStreamingMutation,
    isStartingStreaming: loading || startStreamingMutation.isLoading,
    isStoppingStreaming: loading || stopStreamingMutation.isLoading,
  };
};
