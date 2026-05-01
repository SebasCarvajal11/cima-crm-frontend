import { Typography, Box } from '@mui/material';

export function EmptyState({ message, icon, ...props }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        ...props.sx,
      }}
    >
      {icon && (
        <div className="mb-3 text-gray-400">
          {icon}
        </div>
      )}
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
