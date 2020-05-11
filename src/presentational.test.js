import React from "react";
import Presentational from "./presentational";
import { render, fireEvent } from "@testing-library/react";

test("renders img with src set to '/puppy.png' when it is passed that as a prop", () => {
    // container is the DOM
    const { container } = render(<Presentational imageUrl="/puppy.png" />);
    expect(container.querySelector("img").getAttribute("src")).toBe(
        "/puppy.png"
    );
});

test("renders img with src set to /default.jpg when no url prop is present", () => {
    const { container } = render(<Presentational />);
    expect(container.querySelector("img").getAttribute("src")).toBe(
        "/default.jpg"
    );
});
