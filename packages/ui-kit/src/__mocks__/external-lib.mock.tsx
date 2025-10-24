import { vi } from "vitest";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}> {children} </div>,
    },
  };
});

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: any) => <>{children} </>,
}));

vi.mock("react-loader-spinner", () => ({
  ThreeDots: () => <div data-testid="dots-loader" />,
  Oval: ({ height, width, color, secondaryColor }: any) => (
    <div
      data-testid="mock-oval"
      data-height={height}
      data-width={width}
      data-color={color}
      data-secondary-color={secondaryColor}
    />
  ),
}));

vi.mock("react-blurhash", () => ({
  Blurhash: ({ hash, width, height, style }: any) => (
    <div
      data-testid="blurhash"
      data-hash={hash}
      data-width={width}
      data-height={height}
      style={style}
    />
  ),
}));

vi.mock("lucide-react", () => ({
  User: (props: any) => <div data-testid="icon-user" {...props} />,
  Mail: (props: any) => <div data-testid="icon-mail" {...props} />,
  Phone: (props: any) => <div data-testid="icon-phone" {...props} />,
  AlertCircle: ({ className, color }: any) => (
    <div data-testid="alert-circle" data-color={color} className={className} />
  ),
}));
