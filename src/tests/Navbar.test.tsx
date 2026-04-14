import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("AAA: Should show Login button when user is NOT authenticated", () => {
    // --- ARRANGE ---
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    // --- ACT ---
    const loginButton = screen.getByText(/Login/i);

    // --- ASSERT ---
    expect(loginButton).toBeInTheDocument();
  });

  test("AAA: Should show 'Add Recipe' and user name when authenticated", () => {
    // --- ARRANGE ---
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { name: "Alex" },
      logout: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>,
    );

    // --- ASSERT ---
    expect(screen.getByText(/Alex/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Recipe/i)).toBeInTheDocument();
  });
});
