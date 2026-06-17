import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { participantsMock } from "../../../__mocks__/participants.mock";
import { UserSelectorBlock } from "./UserSelectorBlock";

const slotProps = {
  searchInputSlot: <div>Search slot</div>,
  searchResultsSlot: <div>Results slot</div>,
};

const defaultProps: ComponentProps<typeof UserSelectorBlock> = {
  selectedUsers: [participantsMock.u2],
  onAddUser: vi.fn(),
  onRemoveUser: vi.fn(),
  onClose: vi.fn(),
  onCreate: vi.fn().mockResolvedValue(undefined),
  ...slotProps,
};

const renderComponent = (props: Partial<ComponentProps<typeof UserSelectorBlock>> = {}) =>
  render(<UserSelectorBlock {...defaultProps} {...props} />);

describe("UserSelectorBlock", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render header copy, counter, and injected slots", () => {
      renderComponent();
      expect(screen.getByText("Add participants")).toBeVisible();
      expect(screen.getByText(/2\/50/)).toBeVisible();
      expect(screen.getByText("Search slot")).toBeVisible();
      expect(screen.getByText("Results slot")).toBeVisible();
    });

    it("should use Add as the primary label when initSelectedUsers is provided", () => {
      renderComponent({
        initSelectedUsers: [participantsMock.u1],
        selectedUsers: [participantsMock.u2],
      });
      expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    });

    it("should show the empty hint when no users are selected after filtering", () => {
      renderComponent({
        selectedUsers: [],
        initSelectedUsers: [participantsMock.u2],
      });
      expect(screen.getByText("Select users to add...")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should call onCreate with the current selection", async () => {
      const onCreate = vi.fn().mockResolvedValue(undefined);
      renderComponent({ onCreate });
      await user.click(screen.getByRole("button", { name: "Create" }));
      expect(onCreate).toHaveBeenCalledWith([participantsMock.u2]);
    });

    it("should call onClose from the cancel control", async () => {
      const onClose = vi.fn();
      renderComponent({ onClose });
      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("should respect submitLabel when it overrides the default Create label", () => {
      renderComponent({ submitLabel: "Add" });
      expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    });
  });
});
