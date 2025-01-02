<div  align="center">

<img  src="./src/assets/logo.png"  alt="bottlenetes logo"  width="200"/>

<h1>Bottlenetes</h1>

<p>

<strong>A user friendly platform to monitor, identify bottlenecks, and interact with your Kubernetes clusters.</strong>

</p>

</div>

---

<div  align="center">

### ✨🛠️✨ Tech Stack ✨🛠️✨

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

# 📚 Table of Contents 📚

- [About the Project](#about-the-project)
- [Demo](#demo)
- [Features](#features)
- [Getting Started 🚀](#getting-started-)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Environment Variables 🌐](#environment-variables-)
- [Manual Setup 🛠️](#manual-setup-️)
- [AWS integration ☁️](#aws-integration-️)
- [Roadmap Ahead 🌟](#roadmap-ahead-)
- [Contribution Guidelines 📝](#contribution-guidelines-)
- [Contributors 🎉](#contributors-)
- [License 📄](#license-)
- [Connect with Us 🤝](#connect-with-us-)

---

## 📖 About this Project 📖

**Bottlenetes** is a productivity tool that helps you monitor, identify bottlenecks, and manage your Kubernetes clusters. It provides:

- **Realtime & Historical Monitoring**: View the current and past status of pods and services on your cluster.

- **Intuitive Web UI**: Restart pods, view logs, adjust replicas, and configure resource requests/limits—all from your browser!

- **Latency tracking**: Integrated service mesh to track latency and help identify bottlenecks in your cluster.

**Why Bottlenetes?**

Managing Kubernetes can be time-consuming and often requires a suite of different tools. Bottlenetes consolidates these needs into a single UI, letting you manage cluster health, resources, logs, and performance data all under one roof. Say goodbye to the days of juggling multiple dashboards! ✨

---

## 🎥 Demo 🎥

<!--

gif link template:

![Bottlenetes Demo](https://user-images.githubusercontent.com/xxx/bottlenetes-demo.gif)

-->

---

## Features

- **Real-time Metrics** ⏱️: Monitor the CPU and memory usage of each pod in real time.
- **K8s Resource Management** 🤖: Debug, manage, scale, and remove workloads from a convenient UI.
- **Bottlenecks Identification** ⚠️: Track latency and service mesh metrics to quickly detect inefficiencies.
- **Security & Permissions** 🔒: Manage user access for your dashboard.
- **AI Integration** 🤖: Enjoy automatic resource allocation recommendations powered by LLMs based on historical data.
- **And More** 🌱: Our feature set grows continuously based on community feedback.

---

## 🚀 Getting Started 🚀

### 📦 Prerequisites 📦

1.  **Docker Desktop**

- [Download Docker Desktop](https://www.docker.com/products/docker-desktop) and install.
- Ensure it’s running in the background.

2.  **Node.js**

- Install the latest LTS version of Node.js.

### Project Setup

1.  **Clone this repository**

```bash
git clone https://github.com/oslabs-beta/BottleNetes.git
cd bottlenetes
```

2. **Create .env.prod in the root directory**

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

3. **Run the Quickstart script**

A quickstart script is provided for your convenience, automating much of the setup process:

- Make the script executable:

```bash
chmod +x QUICKSTART.sh
```

- Execute the script:

```bash
./QUICKSTART.sh
```

If you are running this script for the first time, select "n" when prompted about skipping dependency installations, so everything is installed correctly.

Towards the end, you’ll be asked if you want to generate fake traffic to test latency for the demo app. Choose "y" if you want traffic logs, or "n" to skip.

4. **Access Bottlenetes**

Once the script finishes, it will:

- Install needed dependencies.
- Spin up a local Kubernetes cluster.
- Deploy a demo application.
- Launch your default browser to open both the demo app and the Bottlenetes UI.

If your browser doesn’t open automatically, navigate to http://localhost:4173/ to begin using Bottlenetes!

### 🌐 Environment Variables 🌐

A quick overview of the fields in your .env.prod file:

- OPENAI_API_KEY
  For GPT-based services, if you leverage AI integrations.

- SUPABASE_URI
  A PostgreSQL connection string provided by Supabase.

- SUPABASE_PASSWORD
  The database password for your Supabase PostgreSQL instance.

- SUPABASE_ANON_KEY
  The anon/public key from Supabase for client-side APIs.

- SECRET_SESSION_KEY
  A secret key used to secure session data, cookies, tokens, etc.

- NODE_ENV
  Typically set to "production" for a deployed environment.

- GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
  OAuth credentials for GitHub login and callbacks.

- GITHUB_REDIRECT_URI
  URL to redirect to after successful GitHub authentication.

- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
  OAuth credentials for Google login.

- GOOGLE_REDIRECT_URI
  URL to redirect to after successful Google authentication.

- FRONTEND_URL
  The URL hosting your frontend, e.g., http://localhost:4173/.

## 🛠️Manual Setup🛠️

If you prefer a manual setup or want to customize each step, please follow:

- [this page](readme/manual-setup-instruction.md) for the initial manual setup.
- and [this page](readme/latency-prerequisite.md) for installing service mesh for latency tracking.

## AWS integration ☁️

If you want to make Bottlenetes work with your AWS EKS cluster, please follow the instructions in [this page](readme/aws-integration-instruction.md).

## 🌟 Roadmap Ahead 🌟

We’re continuously evolving Bottlenetes. Some upcoming items on our to-do list include:

- **AI-Driven Auto-scaling**:
  Leverage historical resource usage to scale clusters automatically.
- **AI Agent Automation**:
  AI agent to implement customized recommendations for resource allocation.
- **Deeper EKS & Istio Integration**:
  Enhance multi-cloud and service mesh functionalities.
- **Ephemeral Pods**:
  Create and inspect ephemeral pods on-the-fly for enhanced debugging.
- **UI/UX Refresh**:
  Redesign dashboards for better clarity and aesthetics.

## 📝 Contribution Guidelines 📝

We ❤️ contributions from the community! Here’s how to get involved:

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
   Open a PR to the dev branch (unless otherwise specified). Our team will review and, once approved, merge it in!

## 🤝 Contributors 🤝

- Funan Wang: [GitHub](https://github.com/random-letter-generator/) | [LinkedIn](https://www.linkedin.com/in/funan-wang/)
- Julie Hoagland-Sorensen: [GitHub](https://github.com/JulieHoaglandSorensen/) | [LinkedIn](https://www.linkedin.com/in/juliehoaglandsorensen/)
- Mark (Kiet) Nghiem: [GitHub](https://github.com/MarkNghiem/) | [LinkedIn](https://www.linkedin.com/in/kiet-nghiem/)
- Quin Kirsten: [GitHub](http://github.com/quinkirsten) | [LinkedIn](https://www.linkedin.com/in/quin-kirsten-081b66132/)
- Zoe Xu: [GitHub](https://github.com/zx-999) | [LinkedIn](https://www.linkedin.com/in/zxu3756/)

A huge thank you to all our contributors—past, present, and future! 🌻

## 📄 License 📄

Distributed under the MIT License. Please see `LICENSE` for more information.

If you enjoy Bottlenetes, please drop us a ⭐ on GitHub, share with your dev circle, and help our community grow! 🙌
