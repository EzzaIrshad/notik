import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagInput from "../TagInput";

describe("TagInput", () => {
    const renderTagInput = (
        value: string[] = [],
        onChange = jest.fn()
    ) => {
        render(
            <TagInput
                value={value}
                onChange={onChange}
            />
        );

        return { onChange };
    };

    it("should render existing tags", () => {
        renderTagInput(["work", "important"]);

        expect(screen.getByText("work")).toBeInTheDocument();
        expect(screen.getByText("important")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Remove work" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Remove important" })
        ).toBeInTheDocument();
    });

    it("should add a tag when Enter is pressed", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        renderTagInput([], onChange);

        const input = screen.getByRole("textbox", {
            name: "Add a Tag",
        });

        await user.type(input, "work");
        await user.keyboard("{Enter}");

        expect(onChange).toHaveBeenCalledWith(["work"]);
    });

    it("should trim whitespace before adding a tag", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        renderTagInput([], onChange);

        const input = screen.getByRole("textbox", {
            name: "Add a Tag",
        });

        await user.type(input, "  work  ");
        await user.keyboard("{Enter}");

        expect(onChange).toHaveBeenCalledWith(["work"]);
    });

    it("should clear the input after successfully adding a tag", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        renderTagInput([], onChange);

        const input = screen.getByRole("textbox", {
            name: "Add a Tag",
        });

        await user.type(input, "work");
        await user.keyboard("{Enter}");

        expect(input).toHaveValue("");
    });

    it("should not add an empty tag", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        renderTagInput([], onChange);

        const input = screen.getByRole("textbox", {
            name: "Add a Tag",
        });
        await user.click(input);
        await user.keyboard("{Enter}");

        expect(onChange).not.toHaveBeenCalled();
    });

    it("should not add a whitespace-only tag", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        renderTagInput([], onChange);

        const input = screen.getByRole("textbox", {
            name: "Add a Tag",
        });

        await user.type(input, "   ");
        await user.keyboard("{Enter}");

        expect(onChange).not.toHaveBeenCalled();
    });

    it("should show an error when the tag exceeds 30 characters", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        renderTagInput([], onChange);

        const input = screen.getByRole("textbox", {
            name: "Add a Tag",
        });

        await user.type(input, "a".repeat(31));
        await user.keyboard("{Enter}");

        expect(
            screen.getByText("Tag cannot exceed 30 characters.")
        ).toBeInTheDocument();

        expect(onChange).not.toHaveBeenCalled();
    });

    it("should allow a tag with exactly 30 characters", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        renderTagInput([], onChange);

        const input = screen.getByRole("textbox", {
            name: "Add a Tag",
        });

        const tag = "a".repeat(30);

        await user.type(input, tag);
        await user.keyboard("{Enter}");

        expect(onChange).toHaveBeenCalledWith([tag]);
    });

    it("should show an error when adding a duplicate tag", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        renderTagInput(["work"], onChange);

        const input = screen.getByRole("textbox", {
            name: "Add a Tag",
        });

        await user.type(input, "work");
        await user.keyboard("{Enter}");

        expect(
            screen.getByText("This tag already exists.")
        ).toBeInTheDocument();

        expect(onChange).not.toHaveBeenCalled();
    });

    it("should show an error when more than 20 tags are added", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        const existingTags = Array.from(
            { length: 20 },
            (_, index) => `tag-${index}`
        );

        renderTagInput(existingTags, onChange);

        const input = screen.getByRole("textbox", {
            name: "Add a Tag",
        });

        await user.type(input, "new-tag");
        await user.keyboard("{Enter}");

        expect(
            screen.getByText("Maximum 20 tags are allowed.")
        ).toBeInTheDocument();

        expect(onChange).not.toHaveBeenCalled();
    });

    it("should remove a tag", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        renderTagInput(["work", "important"], onChange);

        await user.click(
            screen.getByRole("button", {
                name: "Remove work",
            })
        );

        expect(onChange).toHaveBeenCalledWith(["important"]);
    });

    it("should clear an error after successfully adding a tag", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        renderTagInput([], onChange);

        const input = screen.getByRole("textbox", {
            name: "Add a Tag",
        });

        await user.type(input, "a".repeat(31));
        await user.keyboard("{Enter}");

        expect(
            screen.getByText("Tag cannot exceed 30 characters.")
        ).toBeInTheDocument();

        await user.clear(input);
        await user.type(input, "valid-tag");
        await user.keyboard("{Enter}");

        expect(
            screen.queryByText("Tag cannot exceed 30 characters.")
        ).not.toBeInTheDocument();

        expect(onChange).toHaveBeenCalledWith(["valid-tag"]);
    });

    it("should clear an error when a tag is removed", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        renderTagInput(["work"], onChange);

        const input = screen.getByRole("textbox", {
            name: "Add a Tag",
        });

        await user.type(input, "work");
        await user.keyboard("{Enter}");

        expect(
            screen.getByText("This tag already exists.")
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {
                name: "Remove work",
            })
        );

        expect(
            screen.queryByText("This tag already exists.")
        ).not.toBeInTheDocument();

        expect(onChange).toHaveBeenCalledWith([]);
    });
});