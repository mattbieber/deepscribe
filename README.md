This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

For running locally:

Install dependencies:

`npm install | yarn install | pnpm install`

Then:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

I'd love the chance to discuss this with your dev team! Thanks

## Challenge Details

My approach to this challenge was to employ [Next.js 16](https://nextjs.org/) for server rendering, obviously [React](https://react.dev/) comes with that, it makes use of a [Neon Postgres][https://neon.com/] database, [Drizzle ORM](https://orm.drizzle.team/) for database manipulations,  and Vercel's [AI SDK](https://ai-sdk.dev/) for LLM interfacing.

The "pages" are React Server Components (rendered on the server) and logic is mostly Next.js Server Actions.  There is no direct querying, API calls, or interfacing with the database done on the client.

There's a small frontend that allows for convo files (TXT) to be uploaded.  The workflow is that 

1. A text file is uploaded via a Server Action
2. Initial values are written to the Neon Db (including the full convo text)
3. It then calls a second Server Action that makes the LLM call
   1. When that returns - takes a minute, see Caveats - an update to the Database is made with the results from the LLM
4. The UI is then refreshed with the new Patient (faker supplied name)
5. A click on the name will invoke a Details page where you can see the Patient data the LLM found, see the transcript and the results of the Clinical Trials API call

#### Convo Files

I've provided 3 sample patient-doctor conversations that I found [on Kaggle](https://www.kaggle.com/datasets/azmayensabil/doctor-patient-conversation-large).  Feel free to try copying other samples - I can't vouch for those on forms other than this at the link above.

### AI Use and Callouts

I lightly used AI to construct the initial Drizzle schema but even most of tha I re-worked. Most of this was done old- school.  I think places I'd call out are the use of the Vercel AI SDK - han't really used that before (it's very cool) and the next.js architecture pattern  of heavily being server-based.

### Caveats

Do to the time constraints there are a few things I'd like to call out as *would have done if*:

-  It's pretty light on the error handling - which would need to really be much more solid since you sometimes get strange things back from LLM calls.
- The UX is awkward and I'd definitely put indicators, spinners, user-feedback around a lot of this.  It takes a minute for the llm call (especially long with some models) and right now there'a no feedback. 





