# Calva CLJS Testbed

This repo serves as a testbed for getting Calva into a state in which the extension is built with shadow-cljs, so that hot reloading of the TypeScript works and so that we can start porting the extension to ClojureScript incrementally.

The main branch aligns with the current state of the Calva `dev` branch as of commit `bdfcd416d2494cb165c01c02d45b26b2e64c2ee2`. This branch should be left as-is, and efforts to set up Calva for being built by shadow-cljs should be done in separate branches, which could each represent a different approach.

The readme in each branch that represents an approach should describe issues that arose and how they were resolved so that we can track decisions and assumptions.
