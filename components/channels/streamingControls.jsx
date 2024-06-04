import React from "react";
import { CreateNewChannel } from "../channels/createchannel";
import { Spin } from "antd";
import { useUser } from "../../hooks/userUser";

export const StreamingControls = ({
  channel,
  startStream,
  stopStream,
  isStartingStreaming,
  isStoppingStreaming,
}) => {
  const { user } = useUser();
  const IS_OWNER = user?.id === channel?.owner_id;
  return (
    <>
      {IS_OWNER && (
        <>
          {channel?.is_streaming ? (
            <button
              type="button"
              onClick={stopStream}
              disabled={isStoppingStreaming}
              className="p-1 w-[110px] rounded-md text-black border-2 border-solid border-black text-sm font-normal hover:scale-105 hover:ease-in-out ">
              {isStoppingStreaming ? <Spin size="small" /> : "Stop stream"}
            </button>
          ) : (
            <button
              type="button"
              onClick={startStream}
              disabled={isStartingStreaming}
              className="p-1 w-[110px] rounded-md text-black border-2
              border-solid border-black text-sm font-normal hover:scale-105
              hover:ease-in-out ">
              {isStartingStreaming ? <Spin /> : "Start stream"}
            </button>
          )}
        </>
      )}
    </>
  );
};
