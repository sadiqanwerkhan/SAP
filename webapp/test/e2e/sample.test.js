const { wdi5 } = require("wdio-ui5-service")

describe("todo app", () => {
    it("creates a todo item", async () => {
        const logger = wdi5.getLogger()
        logger.log("Creating todo item via UI5 controls")

        const input = await browser.asControl({
            selector: {
                id: "newTodoInput",
                viewName: "ui5.app.view.Main"
            }
        })
        await input.setValue("Validate UAT scenario")

        const addButton = await browser.asControl({
            selector: {
                id: "addTodoButton",
                viewName: "ui5.app.view.Main"
            }
        })
        await addButton.firePress()

        const list = await browser.asControl({
            selector: {
                id: "todoList",
                viewName: "ui5.app.view.Main"
            }
        })
        const items = await list.getItems()
        expect(items.length).toBeGreaterThan(0)
    })
})
