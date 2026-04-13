// src/tests-private/RegisterPage.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import { useAuth } from "../context/AuthContext";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const getInputs = () => ({
  name: document.querySelector('input[type="text"]') as HTMLElement,
  email: document.querySelector('input[type="email"]') as HTMLElement,
  password: document.querySelectorAll(
    'input[type="password"]',
  )[0] as HTMLElement,
  confirmPassword: document.querySelectorAll(
    'input[type="password"]',
  )[1] as HTMLElement,
});

const renderRegisterPage = () =>
  render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  );

describe("RegisterPage", () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ register: mockRegister });
  });

  describe("Rendering", () => {
    test("Should render all form fields and the register button", () => {
      renderRegisterPage();
      const { name, email, password, confirmPassword } = getInputs();

      expect(name).toBeInTheDocument();
      expect(email).toBeInTheDocument();
      expect(password).toBeInTheDocument();
      expect(confirmPassword).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /register/i }),
      ).toBeInTheDocument();
    });

    test("Should render a link to the login page", () => {
      renderRegisterPage();

      const loginLink = screen.getByRole("link", { name: /login/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute("href", "/login");
    });
  });

  describe("Validation", () => {
    test("AAA: Should show error when passwords do not match", async () => {
      // --- ARRANGE ---
      renderRegisterPage();
      const { email, password, confirmPassword } = getInputs();

      // --- ACT ---
      fireEvent.change(email, { target: { value: "test@test.com" } });
      fireEvent.change(password, { target: { value: "password123" } });
      fireEvent.change(confirmPassword, {
        target: { value: "differentpassword" },
      });
      fireEvent.click(screen.getByRole("button", { name: /register/i }));

      // --- ASSERT ---
      expect(
        await screen.findByText(/passwords do not match/i),
      ).toBeInTheDocument();
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  describe("Successful registration", () => {
    test("AAA: Should call register and navigate to /login on success", async () => {
      // --- ARRANGE ---
      mockRegister.mockResolvedValue(undefined);
      renderRegisterPage();
      const { name, email, password, confirmPassword } = getInputs();

      // --- ACT ---
      fireEvent.change(name, { target: { value: "Alex" } });
      fireEvent.change(email, { target: { value: "alex@test.com" } });
      fireEvent.change(password, { target: { value: "password123" } });
      fireEvent.change(confirmPassword, { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /register/i }));

      // --- ASSERT ---
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          "alex@test.com",
          "password123",
          "Alex",
        );
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
    });

    test("AAA: Should call register without name when name field is blank", async () => {
      // --- ARRANGE ---
      mockRegister.mockResolvedValue(undefined);
      renderRegisterPage();
      const { email, password, confirmPassword } = getInputs(); // ✅ name intentionally left empty

      // --- ACT ---
      fireEvent.change(email, { target: { value: "alex@test.com" } });
      fireEvent.change(password, { target: { value: "password123" } });
      fireEvent.change(confirmPassword, { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /register/i }));

      // --- ASSERT ---
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          "alex@test.com",
          "password123",
          undefined,
        );
      });
    });
  });

  describe("Failed registration", () => {
    test("AAA: Should show error message when register throws", async () => {
      // --- ARRANGE ---
      mockRegister.mockRejectedValue(new Error("Server error"));
      renderRegisterPage();
      const { email, password, confirmPassword } = getInputs();

      // --- ACT ---
      fireEvent.change(email, { target: { value: "alex@test.com" } });
      fireEvent.change(password, { target: { value: "password123" } });
      fireEvent.change(confirmPassword, { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /register/i }));

      // --- ASSERT ---
      expect(
        await screen.findByText(/registration failed. please try again./i),
      ).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Loading state", () => {
    test("AAA: Should disable button and show loading text while submitting", async () => {
      // --- ARRANGE ---
      mockRegister.mockReturnValue(new Promise(() => {})); // never resolves
      renderRegisterPage();
      const { email, password, confirmPassword } = getInputs();

      // --- ACT ---
      fireEvent.change(email, { target: { value: "alex@test.com" } });
      fireEvent.change(password, { target: { value: "password123" } });
      fireEvent.change(confirmPassword, { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /register/i }));

      // --- ASSERT ---
      await waitFor(() => {
        const button = screen.getByRole("button", {
          name: /creating account/i,
        });
        expect(button).toBeDisabled();
      });
    });
  });
});
