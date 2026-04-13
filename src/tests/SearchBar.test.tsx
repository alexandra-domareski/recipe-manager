import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/SearchBar";

describe("SearchBar Component", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("AAA: Should render with the correct placeholder and initial value", () => {
    // --- ARRANGE ---
    render(
      <SearchBar
        value="Pasta"
        onChange={mockOnChange}
        placeholder="Search for yum..."
      />,
    );

    // --- ACT ---
    const inputElement = screen.getByPlaceholderText(
      /Search for yum.../i,
    ) as HTMLInputElement;

    // --- ASSERT ---
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toBe("Pasta");
  });

  test("AAA: Should call onChange when the user types", () => {
    // --- ARRANGE ---
    render(
      <SearchBar value="" onChange={mockOnChange} placeholder="Search..." />,
    );
    const inputElement = screen.getByPlaceholderText(/Search.../i);

    // --- ACT ---
    fireEvent.change(inputElement, { target: { value: "Pizza" } });

    // --- ASSERT ---
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("Pizza");
  });
});
