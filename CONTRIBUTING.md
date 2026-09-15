# 🤝 Contributing to MediFlow AI

Thank you for contributing to MediFlow AI! To maintain a clean, high-quality, and robust codebase, all contributors must adhere to the following workflow and commit policies.

---

## 🔒 Branch & Merge Policy

1. **Target Branch**: All feature branches and bug fixes must target the **`dev`** branch.
   - **`main`** is strictly reserved for production releases and can **only** be updated or merged by repository owner **@Dilshan-Pasindu**.
   - Direct PRs to `main` are automatically rejected and closed.
2. **Branch Naming Conventions**:
   - Features: `feature/<member-number>-<feature-name>` (e.g. `feature/member3-e-prescription-medicine-ordering`)
   - Bug Fixes: `fix/<issue-description>`
   - Chores: `chore/<description>`

---

## ⚡ Commit Minimization Policy

> **Crucial Rule**: Contributors must submit pull requests with **MINIMUM COMMITS** (maximum **3 atomic commits** per PR, ideally 1–2 squashed commits).
>
> **Exemption**: Repository owner **@Dilshan-Pasindu** is exempt from commit limit policies.

Our CI pipeline (`Security & Governance Guard`) automatically inspects the commit count of incoming pull requests. PRs containing **more than 3 commits** will fail CI validation and cannot be merged.

### 🛠️ How to Squash Your Commits Before Submitting

If you accumulated multiple commits during development, squash them before opening or updating your pull request:

```bash
# 1. Fetch the latest integration branch
git fetch origin dev

# 2. Soft-reset your commits to dev while keeping all code changes in your workspace
git reset --soft origin/dev

# 3. Create a single, clean, semantic commit
git add .
git commit -m "feat(scope): concise description of feature"

# 4. Force push your squashed branch with lease
git push --force-with-lease
```

Alternatively, you can use interactive rebase:
```bash
git rebase -i HEAD~<number_of_commits>
# Mark the first commit as 'pick' and all subsequent commits as 'squash' or 's'
```

---

## 🧪 Local Testing & Verification

Before submitting a PR, verify that all builds and tests succeed locally:

```bash
# Backend (.NET 8)
dotnet build MediFlow.sln
dotnet test tests/MediFlow.Tests/MediFlow.Tests.csproj

# Web Client (React / Vite)
cd web/mediflow-web
npm run build

# Mobile Client (Flutter)
cd mobile/mediflow_mobile
flutter test
```

---

## 📋 PR Checklist

Before requesting review from code owners:
- [x] Commits are squashed to $\le 3$ atomic commits.
- [x] PR targets `dev`.
- [x] All unit tests pass and build succeeds.
- [x] No secrets, passwords, or API keys are committed.
