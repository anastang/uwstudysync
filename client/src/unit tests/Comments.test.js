import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Post from '../components/Post'; // Adjust the path as needed

test('renders comment input and submit button', () => {
  render(<Post />);
  const commentInput = screen.getByLabelText(/Leave a comment/i);
  const submitButton = screen.getByRole('button', { name: /Submit Comment/i });

  expect(commentInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('submits comment when submit button is clicked', async () => {
  // Mock fetch requests
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ comments: [{ comment: 'Test comment' }] }), // Mock response data
    })
  );

  render(<Post />);

  const commentInput = screen.getByLabelText(/Leave a comment/i);
  const submitButton = screen.getByRole('button', { name: /Submit Comment/i });

  fireEvent.change(commentInput, { target: { value: 'This is a test comment' } });
  fireEvent.click(submitButton);

  // Wait for the comment to be submitted and response to be received
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(2); // One for submitting comment, one for loading comments
    expect(screen.getByText('Comment submitted successfully!')).toBeInTheDocument();
    expect(screen.getByText('Test comment')).toBeInTheDocument(); // Submitted comment displayed
  });
});
