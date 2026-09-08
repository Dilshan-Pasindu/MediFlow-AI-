# Git & Branch Protection Rules

## STRICT POLICY: Protected Branches

1. **NEVER Push to `main`, `master`, or `dev`**:
   - The agent MUST NEVER execute `git push origin main`, `git push origin master`, or `git push origin dev`.
   - The agent MUST NEVER checkout `main` or `dev` to apply code changes or merge branches into them directly.

2. **Feature Branches Only**:
   - All code development, bug fixes, and modifications must take place exclusively on dedicated feature branches (e.g. `feature/*`).

3. **Explicit Consent Required for Remote Operations**:
   - Before executing ANY `git push` command, the agent MUST explicitly ask the user for permission and describe what is being pushed.

4. **Pull Requests Only**:
   - Changes can only be integrated into `dev` and `main` through Pull Requests approved and merged by @Dilshan-Pasindu.
