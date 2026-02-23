import { Card, CardContent, Typography, Box } from "@mui/material";

const StatsCard = ({ title, value }) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        p: 1,
      }}
    >
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          mt={1}
          sx={{ textAlign: "center" }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
