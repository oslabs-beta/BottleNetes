## How to set up

1. Download the docker desktop from [Docker Desktop](https://www.docker.com/products/docker-desktop), install and keep it running.
2. Clone this repository, cd into the project directory.
3. In the root directory of the repo, create a .env file with the following content:

- OPENAI_API_KEY
- SUPABASE_URI
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- GITHUB_REDIRECT_URI
  e.g.

```yaml
some_example_env_file_content: "some_value"
```

4. There is a script "DEMO.sh" in the root directory of the project. Give it execute permission by running the following command in the terminal.

```bash
chmod +x DEMO.sh
```

5. Run the script by running the following command in the terminal.

```bash
./DEMO.sh
```

If you are running the script for the first time, select "n" to avoid skipping installing the required dependencies. 6. The script will handle the rest of the setup process. It will install all prerequisites, spin up a kubernetes cluster, deploy a demo application, and open the bottlenetes application in your default browser.

#### If you prefer to set up manually, please follow the instructions in [this page](readme/manual-setup-instruction.md) and [this page](readme/latency-prerequisite.md).
