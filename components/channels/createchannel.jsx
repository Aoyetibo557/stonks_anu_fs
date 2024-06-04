import React, { useState } from "react";
import { Avatar, Modal, message } from "antd";
import { useUser } from "../../hooks/userUser";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";

export const CreateNewChannel = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const router = useRouter();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCreateChannel = async () => {
    if (!user) {
      message.error("You need to be logged in to create a channel!", 1.5);
    }

    // Check if a channel with the same name already exists
    const { data: existingChannel, error: checkError } = await supabase
      .from("channels")
      .select("id")
      .ilike("name", newChannel) // Case-insensitive check
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // Ignore "No rows found" error
      message.error(`Error checking for existing channel: ${checkError}`, 3.5);
      return;
    }
    if (existingChannel) {
      message.info(
        "A channel with this name already exists. Please choose a different name."
      );
      return;
    }

    const { data, error } = await supabase
      .from("channels")
      .insert([{ name: newChannel, description, owner_id: user.id }])
      .select("*");

    if (error) {
      message.error("Error creating channel:", 1.5);
    } else {
      message.success(`New channel created!`, 1.5);
      router.push(`/channels/${data[0].id}`);
    }
  };

  return (
    user && (
      <div>
        {contextHolder}

        <div title="create-new-channel" aria-label="create new channel">
          <button
            type="button"
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="p-2  rounded-md text-white text-sm font-normal bg-blue-500 hover:bg-blue-700 hover:scale-105  hover:ease-in-out ">
            Create Channel
          </button>
        </div>
        <Modal
          title="Create New Channel"
          open={isModalOpen}
          onOk={handleCreateChannel}
          onCancel={handleCancel}>
          <input
            name="newchannel"
            placeholder="My Channel"
            className="mb-4 w-full p-3 rounded-md border-2 border-gray-500 text-black placeholder-gray-500 focus:outline-none focus:border-blue-500"
            value={newChannel}
            onChange={(e) => setNewChannel(e.target.value)}
          />

          <input
            name="description"
            placeholder="For streaming games, tech..."
            className="mb-4 w-full p-3 rounded-md border-2 border-gray-500 text-black placeholder-gray-500 focus:outline-none focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Modal>
      </div>
    )
  );
};
