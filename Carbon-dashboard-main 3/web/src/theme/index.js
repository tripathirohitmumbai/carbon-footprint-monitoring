import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#fff', contrastText: '#000' },
    secondary: { main: '#000', contrastText: '#fff' },
  },
});

export default theme;
