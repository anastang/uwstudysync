import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Upload from '../components/Home/Upload'; 

const mockCourses = [];

describe('Upload Component', () => {
  test('renders title and input boxes', async () => {
    render(<Upload courses={mockCourses} />);
    const addButton = screen.getByRole('button');
    userEvent.click(addButton);
    const title = await screen.findByText('Upload Course Content');
    expect(title).toBeInTheDocument();
  });
  test('allows typing in title and description text boxes', async () => {
    render(<Upload courses={mockCourses} />);
  
    const addButton = screen.getByRole('button');
    userEvent.click(addButton);
    
    const textboxes = await screen.findAllByRole('textbox');
    const titleInput = textboxes[0];
    const descriptionInput = textboxes[1];
    
    await userEvent.type(titleInput, 'Test Title');
    await userEvent.type(descriptionInput, 'Test Description');
  
    await waitFor(() => expect(titleInput).toHaveValue('Test Title'));
    await waitFor(() => expect(descriptionInput).toHaveValue('Test Description'));
  });
});

