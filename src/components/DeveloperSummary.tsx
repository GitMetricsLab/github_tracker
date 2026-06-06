import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
} from "@mui/material";

interface DeveloperProfile {
  name: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  avatar_url: string;
}

interface Props {
  username: string;
  token?: string;
}

const DeveloperSummary: React.FC<Props> = ({ username, token }) => {
  const [profile, setProfile] =
    useState<DeveloperProfile | null>(null);

useEffect(() => {
  if (!username.trim()) {
    setProfile(null);
    return;
  }

  const controller = new AbortController();

  const timeout = setTimeout(async () => {
    try {
      setProfile(null);

      const response = await fetch(
        `https://api.github.com/users/${username}`,
        {
          signal: controller.signal,
          ...(token && {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        throw new Error(
          errorData?.message ||
            `GitHub request failed (${response.status})`
        );
      }

      const data = await response.json();

      setProfile(data);
    } catch (error) {
      if (
        error instanceof Error &&
        error.name !== "AbortError"
      ) {
        console.error(error);
        setProfile(null);
      }
    }
  }, 500);

  return () => {
    clearTimeout(timeout);
    controller.abort();
  };
}, [username, token]);

  if (!profile) return null;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <Avatar
          src={profile.avatar_url}
          sx={{ width: 64, height: 64 }}
        />

        <Box>
          <Typography variant="h6">
            {profile.name || username}
          </Typography>

          {profile.bio && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {profile.bio}
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Chip
          label={`${profile.public_repos} Repositories`}
        />
        <Chip
          label={`${profile.followers} Followers`}
        />
        <Chip
          label={`${profile.following} Following`}
        />
      </Box>

      <Typography>
        {profile.name || username} has{" "}
        {profile.public_repos} public repositories and{" "}
        {profile.followers} followers, showing active
        participation in the GitHub community.
      </Typography>
    </Paper>
  );
};

export default DeveloperSummary;