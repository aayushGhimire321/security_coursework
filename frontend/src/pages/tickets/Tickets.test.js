import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Tickets from "./Tickets";
import { getBookingsByUserApi } from "../../apis/Api";
import "@testing-library/jest-dom";

// Mock API call
jest.mock("../../apis/Api", () => ({
  getBookingsByUserApi: jest.fn(),
}));

describe("Tickets Component", () => {
  // Test case 1
  it('displays "No tickets available" message when there are no tickets', async () => {
    // Mock empty ticket data
    getBookingsByUserApi.mockResolvedValue({ data: { tickets: [] } });

    render(<Tickets />);

    // Ensure that "No tickets available" message is displayed
    expect(screen.getByText("No tickets available")).toBeInTheDocument();
  });

  // Test case 2
  it("displays tickets when there are tickets", async () => {
    // Mock ticket data
    const tickets = [
      {
        _id: "1",
        show: {
          movieId: { movieName: "Movie 1" },
          showDate: "2024-01-01",
          showTime: "19:00",
        },
        seats: [
          { _id: "seat1", seatNo: "A1" },
          { _id: "seat2", seatNo: "B2" },
        ],
        user: {
          username: "User 1",
          email: "user1@example.com",
          phoneNumber: "1234567890",
        },
        price: 100,
        createdAt: "2024-01-01T10:00:00Z",
      },
      {
        _id: "2",
        show: {
          movieId: { movieName: "Movie 2" },
          showDate: "2024-01-02",
          showTime: "20:00",
        },
        seats: [
          { _id: "seat3", seatNo: "C3" },
          { _id: "seat4", seatNo: "D4" },
        ],
        user: {
          username: "User 2",
          email: "user2@example.com",
          phoneNumber: "0987654321",
        },
        price: 200,
        createdAt: "2024-01-02T11:00:00Z",
      },
    ];

    getBookingsByUserApi.mockResolvedValue({ data: { tickets } });

    render(<Tickets />);

    // Ensure that tickets are displayed
    await waitFor(() => {
      tickets.forEach((ticket) => {
        expect(
          screen.getByText(ticket.show.movieId.movieName)
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            `${new Date(ticket.show.showDate).toLocaleDateString()} at ${
              ticket.show.showTime
            }`
          )
        ).toBeInTheDocument();
        ticket.seats.forEach((seat) => {
          expect(
            screen.getByText(`Seat Number: ${seat.seatNo}`)
          ).toBeInTheDocument();
        });
        expect(
          screen.getByText(`Username: ${ticket.user.username}`)
        ).toBeInTheDocument();
        expect(
          screen.getByText(`Price: Rs.${ticket.price}`)
        ).toBeInTheDocument();
      });
    });
  });
});
