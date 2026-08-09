# UAT Checklist - SAPUI5 ToDo App

## Scope
- Validate core ToDo flows on desktop Chrome.
- Validate behavior with local OData mock service.
- Confirm user-facing messages and filter behavior.

## Test Scenarios
- Create a task with title, due date, and priority.
- Mark an existing task as completed.
- Delete an existing task from the list.
- Filter tasks by `All`, `Open`, and `Done`.
- Search tasks by partial title text.
- Clear completed tasks and verify only open tasks remain.

## Acceptance Criteria
- No JavaScript errors in browser console during critical flows.
- Data updates are reflected immediately in list bindings.
- Busy states do not block normal user interaction after requests complete.
- Responsive layout works on common desktop viewport sizes.
- Unit (`QUnit`) and integration (`OPA5`) suites pass locally.

## Sign-off
- Tester name:
- Date:
- Result: Pass / Fail
- Notes:
