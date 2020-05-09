import React from "react";
import axios from "./axios";
import BioEditor from "./bioeditor";
import { render, waitForElement, fireEvent } from "@testing-library/react";

jest.mock("./axios");

test("when no bio in state and textArea is not visible, render div with class 'no-bio'", () => {
    const { container } = render(<BioEditor bio="" textAreaVisible={false} />);

    expect(container.querySelector("div").firstChild.getAttribute("id")).toBe(
        "addbio"
    );
});
