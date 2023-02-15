import * as React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen } from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import SignIn from "../components/SignIn";

const server = setupServer(
  rest.post("/login", async (req, res, ctx) => {
    const { username, password } = await req.json();

    if (username === "testuser" && password === "testpassword") {
      return res(
        ctx.json({
          authToken: "abc-123",
        })
      );
    }

    return res(ctx.status(401));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loads and displays login screen", async () => {
  render(<SignIn />);

  const elem = screen.getByTestId("sign-in-card");

  expect(elem).toBeInTheDocument();
});

test("should have correct copyright text", async () => {
  render(<SignIn />);

  expect(screen.getByText("Copyright © CO2 Tracker 2022.")).toBeInTheDocument();
});

test("should have both username and password field", async () => {
  render(<SignIn />);

  expect(screen.getByTestId("username-input")).toBeInTheDocument();
  expect(screen.getByTestId("password-input")).toBeInTheDocument();
});

test("should call login endpoint with correct data", async () => {
  server.use(
    rest.post("/login", async (req, res, ctx) => {
      const { username, password } = await req.json();

      if (username === "testuser" && password === "testpassword") {
        return res(
          ctx.json({
            authToken: "abc-123",
          })
        );
      }

      return res(ctx.status(401));
    })
  );

  render(<SignIn />);

  userEvent.type(screen.getByTestId("username-input"), "testuser");
  userEvent.type(screen.getByTestId("password-input"), "testpassword");

  userEvent.click(screen.getByTestId("submit-button"));
});

test("should show error if inputs are empty", async () => {
  server.use(
    rest.post("/login", async (req, res, ctx) => {
      const { username, password } = await req.json();

      if (username === "testuser" && password === "testpassword") {
        return res(
          ctx.json({
            authToken: "abc-123",
          })
        );
      }

      return res(ctx.status(401));
    })
  );

  render(<SignIn />);

  userEvent.click(screen.getByTestId("submit-button"));

  expect(screen.getByText("Fields can't be empty")).toBeInTheDocument();
  expect(screen.getByTestId("error-message")).toBeInTheDocument();
});
