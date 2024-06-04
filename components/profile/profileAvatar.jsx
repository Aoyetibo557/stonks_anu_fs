import React from "react";
import { Avatar } from "antd";
import { CreateNewChannel } from "../channels/createchannel";

export const ProfileAvatar = ({ profile, onEditClick }) => {
  return (
    <div className="h-2/4 p-10 flex flex-row items-center gap-5">
      <Avatar
        size={180}
        shape="square"
        className="bg-gray-300 p-2"
        src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${profile?.username}`}
      />
      <div className="flex flex-col ">
        <div className="">
          {profile?.username ? (
            <div className="font-medium text-lg">@{profile?.username}</div>
          ) : (
            <div onClick={onEditClick}>Complete your Profile</div>
          )}
        </div>

        <div className="mt-3">{profile && <CreateNewChannel />}</div>
      </div>
    </div>
  );
};
