"use client";
import { useAppSelector } from "@/store";
import { Avatar } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";

export default function UserImage() {
  const { user } = useAppSelector((state) => state.auth);
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    setImageUrl(user?.avatar);
  }, [user]);
  return (
    <Avatar>
      {!imageUrl ? (
        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center border-2 border-blue-400">
          <span className="text-xl font-semibold text-white">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </span>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt="User"
          className="w-14 h-14 rounded-full object-cover border-2 border-blue-400"
        />
      )}
    </Avatar>
  );
}
