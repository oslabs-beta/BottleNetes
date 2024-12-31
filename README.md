## How to set up haha

1. Download the docker desktop from [Docker Desktop](https://www.docker.com/products/docker-desktop), install and keep it running.
2. Clone this repository, cd into the project directory.
3. In the root directory of the repo, create a .env file with the following field:

- OPENAI_API_KEY
- SUPABASE_URI
- SUPABASE_PASSWORD
- SUPABASE_ANON_KEY
- SECRET_SESSION_KEY
- NODE_ENV
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- GITHUB_REDIRECT_URI
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI
- FRONTEND_URL

e.g.

```yaml
SUPABASE_PASSWORD=123456789
SUPABASE_URI=postgresql://postgres.abcdefg:1233456789@aws-0-us-west-1.pooler.supabase.com:6543/postgres
SUPABASE_ANON_KEY=abcdefg.abcedfg.abcdefg123456789

OPENAI_API_KEY=sk-proj-123456789-abcedfg-abcdefg-123456789

SECRET_SESSION_KEY=abcdefg123456789

NODE_ENV=development

GITHUB_CLIENT_ID=abcdefg123456789
GITHUB_CLIENT_SECRET=abcdefg123456789
GITHUB_REDIRECT_URI=http://localhost:3000/oauth/github/callback

GOOGLE_CLIENT_ID=abcdefg123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=abcdefg123456789
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth/google/callback

FRONTEND_URL=http://localhost:5173/
```

4. There is a script "QUICKSTART.sh" in the root directory of the project. Give it execute permission by running the following command in the terminal.

```bash
chmod +x QUICKSTART.sh
```

5. Run the script by running the following command in the terminal.

```bash
./QUICKSTART.sh
```

If you are running the script for the first time, select "n" to avoid skipping installing the required dependencies.

6. The script will handle the rest of the setup process. It will install all prerequisites, spin up a kubernetes cluster, deploy a demo application, and open the bottlenetes application in your default browser.

#### If you prefer to set up manually, please follow the instructions in

- [this page](readme/manual-setup-instruction.md)
- and [this page](readme/latency-prerequisite.md).
