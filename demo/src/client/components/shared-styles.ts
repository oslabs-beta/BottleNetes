import { SxProps } from '@mui/material';

export const componentStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center',
    minWidth: 250,
    flex: 1,
  },
  input: {
    '& .MuiInputBase-input': {
      borderRadius: 1,
      position: 'relative',
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 12px',
      transition: 'border-color 0.15s ease-in-out',
      '&:focus': {
        borderColor: '#2196f3',
      },
    },
  },
  results: {
    width: '100%',
    mt: 2,
    p: 2,
    borderRadius: 1,
    backgroundColor: '#f8f9fa',
  },
} as const;
