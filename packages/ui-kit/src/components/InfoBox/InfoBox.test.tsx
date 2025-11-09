import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InfoBox } from "./InfoBox";

describe("InfoBox", () => {
  it("renders title and value", () => {
    render(<InfoBox title="Username" value="JohnDoe" />);
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("JohnDoe")).toBeInTheDocument();
  });

  it("renders placeholder when value is empty", () => {
    render(<InfoBox title="Email" placeholder="Enter email" value="" />);
    expect(screen.getByText("Enter email")).toBeInTheDocument();
  });

  it("renders correct icon based on iconType", () => {
    render(<InfoBox title="Phone" value="12345" iconType="mobile" />);
    expect(screen.getByTestId("icon-phone")).toBeInTheDocument();

    render(<InfoBox title="Email" value="a@b.com" iconType="email" />);
    expect(screen.getByTestId("icon-mail")).toBeInTheDocument();

    render(<InfoBox title="Login" value="user123" iconType="login" />);
    expect(screen.getByTestId("icon-user")).toBeInTheDocument();
  });

  it("does not render when hideIfNull is true and value is empty", () => {
    const { container } = render(
      <InfoBox title="Secret" value="" hideIfNull />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("calls onClickFunc when clicked", () => {
    const onClick = vi.fn();
    render(<InfoBox title="ClickMe" value="Test" onClickFunc={onClick} />);
    fireEvent.click(screen.getByText("ClickMe"));
    expect(onClick).toHaveBeenCalled();
  });

  it("applies modifier className", () => {
    render(<InfoBox title="Mod" value="Val" modifier="custom-mod" />);
    const outerDiv = screen.getByText("Mod").parentElement?.parentElement;
    expect(outerDiv).toHaveClass("custom-mod");
  });
});
