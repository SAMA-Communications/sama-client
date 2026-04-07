import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { Message } from "types/samaWssModels";

import { LastMessage } from "./LastMessage";

const defaultProps: ComponentProps<typeof LastMessage> = {
  isSelected: false,
  countOfUnreadMessages: 0,
  isShowUserName: false,
};

const renderComponent = (props: Partial<ComponentProps<typeof LastMessage>> = {}) =>
  render(<LastMessage {...defaultProps} {...props} />);

describe("LastMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render nothing when no message or draft", () => {
      const { container } = renderComponent({
        message: undefined,
        draft: undefined,
      });
      expect(container.firstChild).toBeNull();
    });

    it("should render draft line when draft text exists", () => {
      renderComponent({
        message: undefined,
        draft: { text: "Unsent" },
      });
      expect(screen.getByText(/Draft:/)).toBeVisible();
      expect(screen.getByText("Unsent")).toBeVisible();
    });

    it("should render message body for peer", () => {
      const message = {
        _id: "m-peer",
        organization_id: "org-1",
        cid: "c1",
        from: "u2",
        body: "Hey there",
        attachments: [] as Message["attachments"],
        t: 0,
        created_at: "",
        updated_at: "",
      } satisfies Message;
      renderComponent({
        message,
        draft: undefined,
      });
      expect(screen.getByText("Hey there")).toBeVisible();
    });
  });
});
