//page
import MainPage from 'src/pages/MainPage';
import CalendarPage from 'src/pages/CalendarPage';
import ChartPage from 'src/pages/ChartPage';
import SignInPage from 'src/pages/SignInPage';
import SignUpPage from 'src/pages/SignUpPage';

export const authorizedRoutes = {
  '/': MainPage,
  '/calendar': CalendarPage,
  '/chart': ChartPage,
};

export const unauthorizedRoutes = {
  '/': SignInPage,
  '/signup': SignUpPage,
};
