# Capital Typing

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Code Cleanup effort

So far, multiple developers have worked on the frontend without much coordination. You might see:

- divergent code organization strategies
- recreation of MUI components with simpler components, e.g. `<Chip />`
- oodles of inline styling
- color usage divergent from the Figma specs
- inconsistencies in the Figma itself

The code cleanup is an effort to ensure that:

- we use MUI components were possible
- style MUI components via the theme file
- avoid inline styling overrides unless a page does use a component in a non-standard way
- only create new common/shared components if there is no MUI equivalent or the component is superior to an existing MUI component or pattern
- only use MUI Icons
- shared components live in `src/components`
- page specific layout components live in `views/page-name`
- we use composition to reduce the size of pages and layout components, i.e. we do not create mega pages with hundreds of lines of code.

For an example, have a look at the File List page, i.e. `src/pages/admin/manage-files` and `src/views/files`.

## Local Development Setup

Clone repository, then install dependencies with: `yarn install`

Create a .env file in the root directory and add the following:

```bash
NEXT_PUBLIC_BASE_URL=http://deskvantage.com:8082
```

### Running the frontend locally

Run the Next.js development server with: `yarn dev`

Browse to http://localhost:3000 to see the frontend.

#### Test Users

Here are the names, emails, and passwords of test users you can use:

- Client Admin: Client Eastwood, client@eastwood.com, Fi$tful of D0llars
- Reseller Admin: Peter Resellers, pete@pinkpanther.com, Inspector_C!

### Code style and linting

Please ensure you use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for code formatting and linting.
Many IDEs offer a way to automatically format and lint on save, so your code will always look its best.

Note: The current code base is not yet enforcing code formatting and linting. We need to first clean up the neglected old code.
New code should however be formatted and linted before a PR is submitted for review.

### Project Folder Structure

- /components: Common components used throughout the app
- /context: Context provider
- /dummyData: test payloads for testing or local development
- /hooks: app-specific React hooks
- /layouts: don't use, will be moved to components
- /menu-icons: deprecated
- /pages Next.js page containers, compose views into fully rendered pages
- /services: backend API service
- /styles: Obsolete, use theme.js instead
- /theme: the app theme contains all styling, avoid inline styling
- /utils: helper functions, constants, etc.
- /views: compose MUI and custom components into building blocks for pages

### Branching Strategy

Create a work branch from the `dev` branch for every Trello ticket that you work on.
The new branch should have a similar title to the ticket.
Make sure to rebase your work branch regularly with changes from dev.
Once you have completed and tested you changes, create a PR and request review from the lead dev and any other team member you think might be interested in your changes.
The lead dev will merge and remove your work branch once the changes have been accepted.

## Deployment

Ask a team member for access to Jenkins.
Use Jenkins to build and deploy your work branch.
Leave the build "hanging" as it hosts the test environment for the work branch.

## Learn More

To learn more about Next.js: [Next.js Documentation](https://nextjs.org/docs)
