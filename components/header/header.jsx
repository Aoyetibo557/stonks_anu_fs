"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Dropdown, Space } from "antd";
import { useUser } from "../../hooks/userUser";
import { supabase } from "../../utils/supabase";
import { Spin } from "antd";

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [loading]);
  const handleLogOut = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  const items = [
    {
      key: "1",
      label: <Link href={`/profile/${user?.id}`}>Profile</Link>,
    },
    {
      key: "2",
      label: <button onClick={handleLogOut}>Logout</button>,
    },
  ];

  if (loading) {
    return (
      <div>
        <Spin size="small" />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-row items-center justify-between text-white bg-gray-800 p-6`}>
      <div className="font-bold text-2xl">Stonks Full Stack</div>
      <nav className="flex flex-row items-center gap-5">
        <Link className="text-white font-medium" href="/channels">
          Channels
        </Link>

        {user ? (
          <Dropdown
            menu={{
              items,
            }}
            className="bg-gray-400 p-2 rounded-full truncate cursor-pointer">
            <a onClick={(e) => e.preventDefault()}>
              <Space>{user?.email}</Space>
            </a>
          </Dropdown>
        ) : (
          <Link className="text-white font-medium" href="/login">
            Login
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Header;
