//page
import MainPage from 'src/pages/MainPage';
import CalendarPage from 'src/pages/CalendarPage';

export const authorizedRoutes = {
  '/': MainPage,
  '/calendar': CalendarPage,
};

export const unauthorizedRoutes = {
  '/': MainPage,
};
