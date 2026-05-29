import React from "react";
import { Box, Paper, Typography, Stack, Chip, Alert, Divider } from "@mui/material";

interface DailyActivityStatusProps {
  commitCountToday: number;
  prOpenedToday: number;
  prMergedToday: number;
  issueActivityCountToday: number;
  streakCount: number;
  reminders: string[];
}

const DailyActivityStatus: React.FC<DailyActivityStatusProps> = ({
  commitCountToday,
  prOpenedToday,
  prMergedToday,
  issueActivityCountToday,
  streakCount,
  reminders,
}) => {
  const summaryItems = [
    {
      label: "Current streak",
      value: `${streakCount} day${streakCount === 1 ? "" : "s"}`,
      color: "primary",
    },
    {
      label: "Commits today",
      value: `${commitCountToday}`,
      color: commitCountToday > 0 ? "success" : "default",
    },
    {
      label: "PRs opened",
      value: `${prOpenedToday}`,
      color: prOpenedToday > 0 ? "success" : "default",
    },
    {
      label: "PRs merged",
      value: `${prMergedToday}`,
      color: prMergedToday > 0 ? "success" : "default",
    },
    {
      label: "Issue activity",
      value: `${issueActivityCountToday}`,
      color: issueActivityCountToday > 0 ? "success" : "default",
    },
  ];

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 4, backgroundColor: "background.paper" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Daily Activity Status
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {summaryItems.map((item) => (
          <Chip
            key={item.label}
            label={`${item.label}: ${item.value}`}
            color={item.color as "primary" | "success" | "default"}
            variant="outlined"
            sx={{ fontWeight: 500, textTransform: "none" }}
          />
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={1}>
        {reminders.length > 0 ? (
          reminders.map((message, index) => (
            <Alert
              key={message + index}
              severity={index === reminders.length - 1 ? "info" : "warning"}
              sx={{ px: 1.5, py: 1, fontSize: "0.95rem" }}
            >
              {message}
            </Alert>
          ))
        ) : (
          <Alert severity="success" sx={{ px: 1.5, py: 1, fontSize: "0.95rem" }}>
            Great work today! Keep your contribution streak alive.
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};

export default DailyActivityStatus;
