import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Post from '../components/Post'; // Adjust the path as needed

test('renders rating input and submit button', () => {
  render(<Post />);
  const ratingInput = screen.getByLabelText(/Rate this post/i);
  const submitButton = screen.getByRole('button', { name: /Submit Rating/i });

  expect(ratingInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('submits rating when submit button is clicked', async () => {
  // Mock fetch requests
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ average: 4.5 }), // Mock response data
    })
  );

  render(<Post />);

  const ratingInput = screen.getByLabelText(/Rate this post/i);
  const submitButton = screen.getByRole('button', { name: /Submit Rating/i });

  fireEvent.change(ratingInput, { target: { value: 4 } });
  fireEvent.click(submitButton);

  // Wait for the rating to be submitted and response to be received
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(2); // One for submitting rating, one for loading average rating
    expect(screen.getByText('Rating submitted successfully!')).toBeInTheDocument();
    expect(screen.getByText('(4.5)')).toBeInTheDocument(); // Average rating updated
  });
});
