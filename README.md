# Expense Tracker System with AI Recommendations

**This is NOT another LLM-api-dependent project.** It is a full system for tracking your expenses, switching between different financial modes and getting smart suggestions based on those modes and your expenses.


## Stack

This is the usual Nextjs TailwindCSS combo, AND the setup is simple enough to run on vercel for free. The free tier should be able to support approximately 7-8 people using the tracker simultaneously, enough for a demo.

- Nextjs (with typescript ofcourse, we hate js)
- TailwindCSS
- Browser local storage
- Algorithms for recommendations


### A few thoughts on this

The typescript, Nextjs, Tailwind selection is obvious. As for the local storage, we didn't want to bother setting up a database for a deadend lab. 

The states for the variables are tracked using hooks, which update the states in the localStorage as well. Utilities for handling localStorage are in `lib/storage/`.


## Development Setup

