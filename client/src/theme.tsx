import { createTheme } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: blue[700],
      light: blue[400],
      dark: blue[900],
    },
    background: {
      default: blue[50],
      paper: grey[400],
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: blue[50],
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: blue[700],
          color: '#ffffff',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: blue[700],
          borderRight: 'none',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          '& .MuiListItemIcon-root': {
            color: '#ffffff',
            minWidth: 40,
          },
          '& .MuiListItemText-primary': {
            color: '#ffffff',
            fontWeight: 500,
          },
          '& .MuiListItemButton-root': {
            margin: '0 8px',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: blue[600],
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: grey[400],
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          border: `1px solid ${grey[500]}`,
          '& .MuiTableHead-root': {
            backgroundColor: grey[500],
            '& .MuiTableCell-root': {
              color: '#ffffff',
              fontWeight: 600,
            },
          },
          '& .MuiTableBody-root .MuiTableRow-root:hover': {
            backgroundColor: grey[300],
          },
          '& .MuiTableBody-root .MuiTableCell-root': {
            color: '#ffffff',
          }
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: grey[500],
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});
