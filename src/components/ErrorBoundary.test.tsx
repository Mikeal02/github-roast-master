import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorBoundary from "./ErrorBoundary";

function Boom({ explode }: { explode: boolean }) {
  if (explode) throw new Error("kaboom");
  return <div>safe content</div>;
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <Boom explode={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("safe content")).toBeInTheDocument();
  });

  it("renders fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <Boom explode />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText("kaboom")).toBeInTheDocument();
  });

  it("supports a custom fallback renderer", () => {
    render(
      <ErrorBoundary fallback={(e) => <div>custom: {e.message}</div>}>
        <Boom explode />
      </ErrorBoundary>,
    );
    expect(screen.getByText("custom: kaboom")).toBeInTheDocument();
  });

  it("recovers after reset when the child stops throwing", async () => {
    const user = userEvent.setup();
    function Wrapper() {
      return (
        <ErrorBoundary
          fallback={(_e, reset) => (
            <button onClick={reset}>retry</button>
          )}
        >
          <Boom explode={false} />
        </ErrorBoundary>
      );
    }
    // First render throws, then we recover.
    const { rerender } = render(
      <ErrorBoundary
        fallback={(_e, reset) => <button onClick={reset}>retry</button>}
      >
        <Boom explode />
      </ErrorBoundary>,
    );
    expect(screen.getByText("retry")).toBeInTheDocument();
    await user.click(screen.getByText("retry"));
    rerender(<Wrapper />);
    expect(screen.getByText("safe content")).toBeInTheDocument();
  });
});
