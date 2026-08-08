"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Website {
  id: string;
  url: string;
  ticks: {
    id: string;
    createdAt: string;
    status: string;
    latency: number;
  }[];
}

function useWebsite() {
  const { data: session } = useSession();
  const [websites, setWebsites] = useState<Website[] | null>(null);

  const token = session?.accessToken as string | undefined;

  const refreshWebsite = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/website`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setWebsites(response.data);
    } catch (err) {
      console.error("Failed to fetch websites:", err);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const timeout = setTimeout(() => {
      refreshWebsite();
    }, 0);

    const interval = setInterval(() => {
      refreshWebsite();
    }, 1000 * 60);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [token, refreshWebsite]);

  return {
    websites,
    refreshWebsite,
  };
}

export default useWebsite;
