import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../components/Home/SearchBar';

test('renders Search Courses input', () => {
  const mockCourses = [];
  render(<SearchBar courses={mockCourses} />);
  const inputElement = screen.getByLabelText(/Search Courses/i);
  expect(inputElement).toBeInTheDocument();
});
