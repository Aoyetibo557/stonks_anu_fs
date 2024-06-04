"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreateNewChannel } from "../../components/channels/createchannel";
import { Empty, Spin } from "antd";
import { useChannel } from "../../hooks/useChannel";

const ChannelsFeed = () => {
  const [user, setUser] = useState("");
  const { getAllChannels } = useChannel();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const data = await getAllChannels();
        setChannels(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChannels();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (channels?.length === 0) {
    return (
      <div className={`p-5 `}>
        <h1 className="text-2xl font-bold mb-4">Channels</h1>

        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              No channels found. Complete your
              <a className="underline font-medium" href="/profile">
                {" "}
                Profile
              </a>{" "}
              and create your channel.
            </div>
          }
        />
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {channels?.map((channel) => (
          <div key={channel.id} className="border p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{channel?.name}</h2>
            <p className="text-gray-600 mb-4">{channel?.description}</p>
            <Link
              className="text-blue-600 hover:underline"
              href={`/channels/${channel?.id}`}>
              Visit Channel
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelsFeed;
