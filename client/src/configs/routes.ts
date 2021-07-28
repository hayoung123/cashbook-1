//page
import MainPage from 'src/pages/MainPage';
import CalendarPage from 'src/pages/CalendarPage';
import ChartPage from 'src/pages/ChartPage';

export const authorizedRoutes = {
  '/': MainPage,
  '/calendar': CalendarPage,
  '/chart': ChartPage,
};

export const unauthorizedRoutes = {
  '/': MainPage,
};
