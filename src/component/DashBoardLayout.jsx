import  React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { CheckBox, Payment, People, Person } from '@mui/icons-material';
import Home from '../pages/Home';
import EmployeeDetails from '../pages/EmployeeDetails';
import AttendanceTable from '../pages/AttendanceTable';
import Payroll from '../pages/PayrollData';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import MonthlyAttendanceReport from '../pages/MonthlyAttendanceReport';
import EmployeeData from '../pages/EmployeeData';

const NAVIGATION = [
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'employeedetails', title: 'Employee Details', icon: <People /> },
  { segment: 'attendance', title: 'Mark Attendance', icon: <CheckBox /> },
  { segment: 'payroll', title: 'Payroll', icon: <Payment /> },
  { segment: 'monthlyattendance', title: 'Monthly Attendance', icon: <Payment /> },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});



function DemoPageContent({ pathname }) {
  const location = useLocation();
  const { employeeId } = useParams();

  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get("date");
    
  let content;
  switch (pathname) {
    case '/dashboard':
      content = <Home />;
      break; 
    case '/attendance':
      content = <AttendanceTable selectedDate= {date}/>;
      break;
    case '/payroll':
      content = <Payroll />;
      break;
    case '/employeedetails':
      content = <EmployeeDetails />;
      break;
    case '/monthlyattendance':
      content = <MonthlyAttendanceReport />;
      break;
    case `/employee/${employeeId}`:
      content = <EmployeeData employeeId={employeeId} />;
      break;
    default:
      content = <Home />;
  }

  return (
    <Box
      sx={{
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {content}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutAccount(props) {
  const { window } = props;

  const [session, setSession] = React.useState({
    user: {
      name: 'Ashoka Paper Converts',
      email: 'ashokapaper@gmail.com',
      image: 'https://avatars.githubusercontent.com/u/19550456',
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      await dispatch(logout()).unwrap();
      setSession(null);
      navigate('/login');
      console.log('User successfully logged out');
    } catch (err) {
      console.error(err);
    }
  };

  const authentication = React.useMemo(
    () => ({
      signIn: () => {
        setSession({
          user: {
            name: 'Ashoka Paper Converts',
            email: 'ashokapaper@gmail.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
          },
        });
      },
      signOut: handleLogOut,
    }),
    [handleLogOut]
  );

  const router = useDemoRouter('/home');
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
       title="AshokaTracker"
       branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="AshokaTracker logo" />,
        title: 'AshokaTracker',
        homeUrl: '/',
      }}
    >
      <Box sx={{ m: 0, p: 0, width: '100%', mx: 'auto' }}>
        <DashboardLayout   sx={{
    '& .MuiTypography-root MuiTypography-h6 css-14tatqh-MuiTypography-root': {
      content: '"AshokaTracker"',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#000', // Optional customization
    },
  }} >
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </Box>
    </AppProvider>
  );
}

DashboardLayoutAccount.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutAccount;
