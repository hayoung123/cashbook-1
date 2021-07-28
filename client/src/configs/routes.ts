//page
import MainPage from '../pages/MainPage';
import CalendarPage from '../pages/CalendarPage';

export const authorizedRoutes = {
  '/': MainPage,
  '/calendar': CalendarPage,
};

export const unauthorizedRoutes = {
  '/': MainPage,
};
