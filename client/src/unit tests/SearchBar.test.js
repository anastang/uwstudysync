import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../components/Home/SearchBar';

test('renders Search Courses input', () => {
  const mockCourses = [];
  const label = "Search Courses"
  render(<SearchBar courses={mockCourses} label={label} />);
  const inputElement = screen.getByRole('combobox');
  expect(inputElement).toBeInTheDocument();
  const labelElement = screen.getByLabelText(/Search Courses/i);
  expect(labelElement).toBeInTheDocument();
});
