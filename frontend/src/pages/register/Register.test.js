// importing
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Register from "./Register";
import { registerUserApi } from "../../apis/Api";
import { toast } from "react-toastify";
import { BrowserRouter as Router } from "react-router-dom";

// mocking
jest.mock("../../apis/Api");

// test cases
describe("Register Component Test", () => {
  // clear all the mock data
  afterEach(() => {
    jest.clearAllMocks();
  });

  // test case 1: should navigate to login page when clicked login button
  it("should navigate to login page when clicked login button", async () => {
    // rendering Register Components
    render(
      <Router>
        <Register />
      </Router>
    );

    // Testing real UI components
    const loginBtn = screen.getByText("Login Now");
    fireEvent.click(loginBtn);
    expect(window.location.pathname).toBe("/login");
  });
});

// test case 2: should register succesfully
it("should register succesfully", async () => {
  // rendering Register Components
  render(
    <Router>
      <Register />
    </Router>
  );

  // Mocking register success response
  const mockResponse = {
    data: {
      success: true,
      message: "User registered successfully",
    },
  };

  // config mock resolved value
  registerUserApi.mockResolvedValue(mockResponse);

  // Testing real UI components
  const username = await screen.getByPlaceholderText("Enter your username");
  const phoneNumber = await screen.getByPlaceholderText(
    "Enter your phone number"
  );
  const email = await screen.getByPlaceholderText("Enter your email");
  const password = await screen.getByPlaceholderText("Enter your password");
  const confirmPassword = await screen.getByPlaceholderText(
    "Confirm your password"
  );
  const registerBtn = screen.getByText("Register");
  fireEvent.change(username, { target: { value: "testuser" } });
  fireEvent.change(phoneNumber, { target: { value: "1234567890" } });
  fireEvent.change(email, { target: { value: "test@example.com" } });
  fireEvent.change(password, { target: { value: "test123" } });
  fireEvent.change(confirmPassword, { target: { value: "test123" } });
  fireEvent.click(registerBtn);
  await waitFor(() => {
    expect(registerUserApi).toHaveBeenCalledWith({
      username: "testuser",
      phoneNumber: "1234567890",
      email: "test@example.com",
      password: "test123",
    });
  });
});
