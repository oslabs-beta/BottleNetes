<div  align="center">

<img  src="./src/assets/logo.png"  alt="bottlenetes logo"  width="200"/>

<h1>Bottlenetes</h1>

<p>

<strong>A user friendly platform to monitor, identify bottlenecks, and interact with your Kubernetes clusters.</strong>

</p>

</div>

---

<div  align="center">

Tech Stack 🛠️

<!-- Tech Stack Logos -->

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

![TypeScript](https://img.shields.io/badge/typescript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

![Vite](https://img.shields.io/badge/vite-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

![Tailwind CSS](https://img.shields.io/badge/tailwind_css-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Kubernetes](https://img.shields.io/badge/kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)

![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

![Minikube](https://img.shields.io/badge/minikube-F7931E?style=for-the-badge&logo=kubernetes&logoColor=white)

![Istio](https://img.shields.io/badge/istio-466BB0?style=for-the-badge&logo=istio&logoColor=white)

![AWS EKS](https://img.shields.io/badge/aws_eks-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)

![Prometheus](https://img.shields.io/badge/prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)

![PromQL](https://img.shields.io/badge/promql-F57600?style=for-the-badge&logo=prometheus&logoColor=white)

![Express.js](https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white)

![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=node-dot-js&logoColor=white)

![Jest](https://img.shields.io/badge/jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

![PostgreSQL](https://img.shields.io/badge/postgresql-316192?style=for-the-badge&logo=postgresql&logoColor=white)

![Sequelize](https://img.shields.io/badge/sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)

![Supabase](https://img.shields.io/badge/supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

![Shell Script](https://img.shields.io/badge/shell_script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

![GitHubActions](https://img.shields.io/badge/github_actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

![JWT](https://img.shields.io/badge/jwt-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

![OpenAI GPT API](https://img.shields.io/badge/OpenAI_GPT_API-412991?style=for-the-badge&logo=openai&logoColor=white)

![OAuth (GitHub & Google)](https://img.shields.io/badge/OAuth-GitHub%20%26%20Google-black?style=for-the-badge&logo=github&logoColor=white)

![Trello](https://img.shields.io/badge/trello-0079BF?style=for-the-badge&logo=trello&logoColor=white)

![VSCode](https://img.shields.io/badge/vscode-0078D4?style=for-the-badge&logo=visual-studio-code&logoColor=white)

</div>

---

## Table of Contents 📚

- [About the Project](#about-the-project)

- [Demo](#demo)

- [Features](#features)

- [Getting Started](#getting-started)

- [Prerequisites](#prerequisites)

- [Project Setup](#project-setup)

- [Environment Variables](#environment-variables)

- [Manual Setup](#manual-setup)

- [Roadmap](#roadmap)

- [Contribution Guidelines](#contribution-guidelines)

- [Contributors](#contributors)

- [License](#license)

- [Connect with Us](#connect-with-us)

---

## About the Project

**Bottlenetes** is a productivity tool that helps you monitor, identify bottlenecks, and manage your Kubernetes clusters. It provides:

- A user-friendly interface to visualize the realtime and historical status of pods and services on your cluster.

- An intuitive web UI to interact with pods directly from your browser, including restarting a pod, displaying pod logs, adjust pod replicas, configuring resource request and limits of a pod.

- Seamless integration with Docker, Minikube, AWS EKS, and more.

**Why Bottlenetes?**

Managing Kubernetes can be challenging and often requires multiple tools. Bottlenetes simplifies this by offering a single UI to monitor cluster health, resources, logs, and much more.

---

## Demo

<!--

gif link template:

![Bottlenetes Demo](https://user-images.githubusercontent.com/xxx/bottlenetes-demo.gif)

-->

---

## Features

- **Real-time Metrics**: Monitor the CPU and memory usage of each pod.

- **K8s Resource Management**: Debug, manage, scale, and remove workloads from a convenient UI.

- **Bottlenecks Identification**: Latency tracking empowered by service mesh.

- **Security & Permissions**: Manage user access for your dashboard.

- **AI Integration**: Automatic resource allocation recommendations based on historical data, empowerd by LLM.

- **And More**: Continuously adding new features based on community feedback.

---

## Getting Started 🚀

### Prerequisites

1.  **Docker Desktop**

- [Download Docker Desktop](https://www.docker.com/products/docker-desktop) and install.
- Make sure it is running in the background.

2.  **Node.js**

- Make sure you have Node.js installed.

### Project Setup

1.  **Clone this repository**: 📦

```bash
git clone https://github.com/oslabs-beta/BottleNetes.git
cd bottlenetes
```

2. **Create .env.prod in the root directory** 📝

```
# Example fields (please update with your real values for each one)
OPENAI_API_KEY=sk-proj-123456789-...
SUPABASE_URI=postgresql://postgres.abcdefg:1233456789@aws-0-us-west-1.pooler.supabase.com:6543/postgres
SUPABASE_PASSWORD=123456789
SUPABASE_ANON_KEY=abcdefg.abcedfg.abcdefg123456789

SECRET_SESSION_KEY=abcdefg123456789

NODE_ENV=production

GITHUB_CLIENT_ID=abcdefg123456789
GITHUB_CLIENT_SECRET=abcdefg123456789
GITHUB_REDIRECT_URI=http://localhost:3000/oauth/github/callback

GOOGLE_CLIENT_ID=abcdefg123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=abcdefg123456789
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth/google/callback

FRONTEND_URL=http://localhost:4173/
```

3. **Run the Quickstart script** 🚀

A quickstart script is provided for your convenience, to automate the setup process.

- Make the script executable:

```bash
chmod +x QUICKSTART.sh
```

- Execute the script:

```bash
./QUICKSTART.sh
```

If you are running this script for the first time, if prompted, choose "n" to avoid skipping any dependency installations.

Towards the end of the script, you will be prompted to generate some fake traffic to test the latency of the demo application running on the kubernetes cluster. You can choose "y" to generate the traffic or "n" to skip it.

4. **Access Bottlenetes** 🚀

The quickstart script will automatically install dependencies, spin up a local Kubernetes cluster, deploy a demo app, open that demo app, and open Bottlenetes in your default browser.

If not opened automatically, you can access Bottlenetes at [http://localhost:4173/](http://localhost:4173/).

### Environment Variables 🌐

Below is a brief explanation of each field in the .env.prod file:

- OPENAI_API_KEY
  Used if your cluster logic integrates with GPT-based services.
- SUPABASE_URI
  A PostgreSQL connection string provided by Supabase.
- SUPABASE_PASSWORD
  The database password for your Supabase PostgreSQL instance.
- SUPABASE_ANON_KEY
  The anon/public key from Supabase for client-side APIs.
- SECRET_SESSION_KEY
  A secret key used to secure session data (cookies, tokens, etc.).
- NODE_ENV
  The environment mode. Please use "production".
- GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET
  OAuth credentials for GitHub login.
- GITHUB_REDIRECT_URI
  URL that GitHub will redirect to after successful auth.
- GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
  OAuth credentials for Google login.
- GOOGLE_REDIRECT_URI
  URL that Google will redirect to after successful auth.
- FRONTEND_URL
  The URL where your frontend is hosted. Please use http://localhost:4173/.

## Manual Setup 🛠️

If you prefer a manual setup or want to customize each step, please follow:

- [this page](readme/manual-setup-instruction.md)
- and [this page](readme/latency-prerequisite.md).

## Roadmap Ahead 🚀

Here are some planned upcoming enhancements:

- Auto-scaling intelligence based on historical resource usage data.
- AI agent to provide and implement customized recommendations for resource allocation.
- Deeper integration with AWS EKS with Istio enabled.
- Implementing Emphemeral pod creation and deletion for better debugging capabilities.
- UI/UX improvement for the dashboards.

## Contribution Guidelines 📝

Your contributions to Bottlenetes are always welcome! Here's how you can get started:

1. Fork the Repo
   Click the "Fork" button at the top-right corner of this page.
2. Create a Feature Branch
   bash ```
   git checkout -b feature/yourNewFeatureName
   ```

   ```
3. Implement Your Feature
   Add your code, tests, or documentation.
4. Commit Your Changes
   ```bash
   git commit -m "Added [your-new-feature-description]"
   ```
5. Push to Your Branch
   ```bash
   git push origin feature/yourNewFeatureName
   ```
6. Create a Pull Request
   Open a Pull Request to push to the `dev` branch in this repository. Our team will review and approve changes.

## Contributors

- Funan Wang: [GitHub](https://github.com/random-letter-generator/) | [LinkedIn](https://www.linkedin.com/in/funan-wang/)
- Julie Hoagland-Sorensen: [GitHub](https://github.com/JulieHoaglandSorensen/) | [LinkedIn](https://www.linkedin.com/in/juliehoaglandsorensen/)
- Mark (Kiet) Nghiem: [GitHub](https://github.com/MarkNghiem/) | [LinkedIn](https://www.linkedin.com/in/kiet-nghiem/)
- Quin Kirsten: [GitHub](http://github.com/quinkirsten) | [LinkedIn](https://www.linkedin.com/in/quin-kirsten-081b66132/)
- Zoe Xu: [GitHub](https://github.com/zx-999) | [LinkedIn](https://www.linkedin.com/in/zxu3756/)

## License

Distributed under the MIT License. Please see `LICENSE` for more information.
