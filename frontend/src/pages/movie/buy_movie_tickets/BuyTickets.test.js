import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BuyTickets from "./BuyTickets";
import { getSingleMovieApi } from "../../../apis/Api";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";

// Mock API call
jest.mock("../../../apis/Api", () => ({
  getSingleMovieApi: jest.fn(),
}));

describe("BuyTickets Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case 1: Fetch movie details
  it("should fetch movie details", async () => {
    // Mock API response
    getSingleMovieApi.mockResolvedValue({
      data: {
        movie: {
          id: 1,
          name: "Test Movie",
          description: "Test Description",
          duration: 120,
          genre: "Test Genre",
          rating: "PG",
          image: "https://example.com/test-movie.jpg",
        },
      },
    });

    render(
      <Router>
        <BuyTickets />
      </Router>
    );

    // Check if the API call was made
    await waitFor(() => {
      expect(getSingleMovieApi).toHaveBeenCalled();
    });
  });

  // Test case 2:  Fetch show details
  it("should fetch show details", async () => {
    // Mock API response
    getSingleMovieApi.mockResolvedValue({
      data: {
        movie: {
          id: "1",
          name: "Test Movie",
          description: "Test Description",
          duration: 120,
          genre: "Test Genre",
          rating: "PG",
          image: "https://example.com/test-movie.jpg",
        },
        show: {
          id: "1",
          showDate: "2024-01-01",
          showTime: "19:00",
        },
      },
    });
    render(
      <Router>
        <BuyTickets />
      </Router>
    );
    // Check if the API call was made
    await waitFor(() => {
      expect(getSingleMovieApi).toHaveBeenCalled();
    });
  });
});
