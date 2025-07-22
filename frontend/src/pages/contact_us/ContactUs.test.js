// importing
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getSingleProfileApi } from '../../apis/Api';
import ContactUs from './ContactUs';

// mocking
jest.mock('../../apis/Api');

// test cases
describe('ContactUs Component Test', () => {
  // clear all the mock data
  afterEach(() => {
    jest.clearAllMocks();
  });

  // test case 1: Contact form pre-fills user data
  it('Should pre-fill user data from API', async () => {
    // Mocking getSingleProfileApi response
    const mockProfileResponse = {
      data: {
        user: {
          username: 'John Doe',
          email: 'johndoe@example.com',
        },
      },
    };

    getSingleProfileApi.mockResolvedValue(mockProfileResponse);

    // rendering ContactUs Component
    render(
      <MemoryRouter>
        <ContactUs />
      </MemoryRouter>
    );

    // Testing pre-filled data
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Your Name').value).toBe('John Doe');
      expect(screen.getByPlaceholderText('Your Email').value).toBe(
        'johndoe@example.com'
      );
    });
  });
});
