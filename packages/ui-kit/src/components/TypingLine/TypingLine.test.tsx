import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TypingLine } from "./TypingLine";
import { participantsMock } from "../../__mocks__/participants.mock";

describe("TypingLine", () => {
  it("renders dots loader and text", () => {
    render(<TypingLine userIds={["u1"]} participants={participantsMock} />);
    expect(screen.getByText(/typing/i)).toBeInTheDocument();
  });

  it("displays single user name when displayUserNames = true", () => {
    render(
      <TypingLine
        userIds={["u1"]}
        displayUserNames
        participants={participantsMock}
      />
    );
    expect(screen.getByText(/UserTest1 typing/i)).toBeInTheDocument();
  });

  it("displays two user names correctly", () => {
    render(
      <TypingLine
        userIds={["u1", "u2"]}
        displayUserNames
        participants={participantsMock}
      />
    );
    expect(
      screen.getByText(/UserTest1, UserTest2 typing/i)
    ).toBeInTheDocument();
  });

  it("displays 'and X more' when more than two users typing", () => {
    render(
      <TypingLine
        userIds={["u1", "u2", "u3", "u4"]}
        displayUserNames
        participants={participantsMock}
      />
    );
    expect(
      screen.getByText(/UserTest1 and 3 more typing/i)
    ).toBeInTheDocument();
  });

  it("does not display background by default", () => {
    const { container } = render(
      <TypingLine userIds={["u1"]} participants={participantsMock} />
    );
    expect(container.firstChild).not.toHaveClass("bg-accent-dark/10");
  });

  it("adds background class when displayBackground = true", () => {
    const { container } = render(
      <TypingLine
        userIds={["u1"]}
        participants={participantsMock}
        displayBackground
      />
    );
    expect(container.firstChild).toHaveClass("bg-accent-dark/10");
  });

  it("uses custom text color", () => {
    render(
      <TypingLine
        userIds={["u1"]}
        participants={participantsMock}
        textColor="red"
      />
    );
    const text = screen.getByText(/typing/i);
    expect(text).toHaveStyle("color: rgb(255, 0, 0)");
  });

  it("renders gracefully with empty userIds", () => {
    render(<TypingLine userIds={[]} participants={participantsMock} />);
    expect(screen.getByText(/typing/i)).toBeInTheDocument();
  });
});
