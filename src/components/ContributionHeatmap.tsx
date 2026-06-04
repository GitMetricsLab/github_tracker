import React from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { Paper, Typography } from "@mui/material";

interface ContributionHeatmapProps {
  data: {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }[];
}

const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ data }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Contribution Activity
      </Typography>

      <ActivityCalendar data={data} theme={{light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],}} />
    </Paper>
  );
};

export default ContributionHeatmap;