import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Assuming you're using React Router
import MyProfile from '../components/MyProfile';

test('renders My Posts button', () => {
  // Render the MyProfile component within a Router
  render(
    <Router>
      <MyProfile />
    </Router>
  );

  // Check if the "My Posts" button is rendered
  const myPostsButton = screen.getByRole('button', { name: /My Posts/i });
  expect(myPostsButton).toBeInTheDocument();
});
