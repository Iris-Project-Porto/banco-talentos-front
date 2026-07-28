import { describe, expect, it } from "vitest";
import { formatEmail } from "./formatEmail";

describe("formatEmail", () => {
    it("remove espaços e força minúsculas", () => {
        expect(formatEmail(" User.Name@Vilt-Group.COM ")).toBe("user.name@vilt-group.com");
    });

    it("remove caracteres inválidos", () => {
        expect(formatEmail("user!name@vilt.com#")).toBe("username@vilt.com");
    });
});
