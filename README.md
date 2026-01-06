<div align="center">

# 🚀 Career Flow

### 💼 A data‑driven job platform built for the CodeYourFuture community

[![GitHub Stars](https://img.shields.io/github/stars/gai93003/Jobs-from-the-board-project?style=social)](https://github.com/gai93003/Jobs-from-the-board-project)
[![Contributors](https://img.shields.io/github/contributors/gai93003/Jobs-from-the-board-project)](https://github.com/gai93003/Jobs-from-the-board-project/graphs/contributors)

</div>

---

Career Flow is a full‑stack application that centralises, organises, and surfaces high‑quality job opportunities for CodeYourFuture trainees, mentors, staff, and admins.

The project is structured as a monorepo with separate backend and frontend codebases.

---

## 📖 Overview

Career Flow helps CodeYourFuture trainees discover curated roles while giving mentors and staff a simple way to manage and share opportunities.

The project lives in this repo as two main folders: **`backend`** (server and data layer) and **`frontend`** (user interface).

### 🎯 Key goals

- 🎓 **Reduce noise** from generic job boards by focusing on roles relevant to CYF trainees
- 🛠️ **Provide a maintainable, extensible** full‑stack codebase for learning and collaboration
- 👥 **Enable different user types** (trainees, mentors, staff, admins) to interact with the same source of truth for opportunities

---

## ✨ Features

- **📋 Centralised job board**: Aggregated job listings stored and served by the backend and displayed via a dedicated frontend application

- **🔄 Deduplicated listings**: The frontend includes logic to deduplicate jobs by `job_id`, preventing repeated postings of the same role

- **🏗️ Full‑stack architecture**: Clear separation of concerns with `Jobs-board-backend` for APIs/data and `Jobs-board-frontend` for UI and client‑side logic

- **🔐 Input validation and auth‑ready**: The codebase includes regex‑based login and password validation work, laying the groundwork for secure authentication flows

- **🤝 Collaborative workflow**: Multiple contributors work via branches and pull requests, making it a realistic learning project for production‑style development

---

## 🔧 Tech Stack

<details open>
<summary><b>🎨 Frontend (Jobs-board-frontend)</b></summary>
<br>

| Technology | Purpose | Details |
|:-----------|:--------|:--------|
| **⚛️ React** | UI Framework | Component-based architecture for building interactive user interfaces with reusable components |
| **⚡ Vite** | Build Tool | Fast development server with Hot Module Replacement (HMR) for rapid development |
| **🟨 JavaScript (ES6+)** | Programming Language | Modern JavaScript features including async/await, destructuring, and arrow functions |
| **🎨 CSS3** | Styling | Responsive design and modern layout techniques (23.1% of codebase) |
| **📄 HTML5** | Markup | Semantic HTML structure (0.2% of codebase) |

</details>

<details open>
<summary><b>⚙️ Backend (Jobs-board-backend)</b></summary>
<br>

| Technology | Purpose | Details |
|:-----------|:--------|:--------|
| **🟢 Node.js** | Runtime Environment | JavaScript runtime built on Chrome's V8 engine for server-side execution |
| **🚂 Express.js** | Web Framework | Minimalist web framework for building RESTful APIs and handling HTTP requests |
| **🐘 PostgreSQL** | Database | Relational database for persistent storage of job listings, user data, and application state |
| **📦 npm** | Package Manager | Dependency management and script running for both frontend and backend |

</details>

<details open>
<summary><b>🛠️ Development Tools</b></summary>
<br>

| Tool | Purpose |
|:-----|:--------|
| **🔀 Git/GitHub** | Version control and collaboration with branching strategy for feature development |
| **💻 VS Code** | Primary IDE with extensions for JavaScript, React, and PostgreSQL |
| **🔧 Postman** | API testing and development for backend endpoints |
| **✅ ESLint** | Code quality and style enforcement |

</details>

---

### 🏗️ Architecture Highlights

- **🗄️ Database**: PostgreSQL provides robust relational data storage with ACID compliance, perfect for job listings, user accounts, and application tracking

- **🔌 API Design**: RESTful API architecture with Express.js handling routes, middleware, and business logic

- **⚛️ Component Structure**: React components organized for reusability and maintainability

- **📦 Package Management**: npm manages dependencies across both frontend and backend, with separate `package.json` files for each

- **🔄 Data Flow**: Backend serves data via API endpoints; frontend consumes and displays data through React components

---

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/RihannaP">
        <img src="https://github.com/RihannaP.png" width="100px;" alt="RihannaP"/>
        <br />
        <sub><b>Rihanna P</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/gai93003">
        <img src="https://github.com/gai93003.png" width="100px;" alt="gai93003"/>
        <br />
        <sub><b>Gabriel Deng</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/donarbl">
        <img src="https://github.com/donarbl.png" width="100px;" alt="donarbl"/>
        <br />
        <sub><b>Donara Blanc</b></sub>
      </a>
    </td>
  </tr>
</table>

<div align="center">

**Career Flow is built and maintained by the amazing contributors above** 🙌

</div>

---

## 🤝 Contributing

> [!NOTE]
> Career Flow is an actively developed collaborative project with multiple contributors. Contributions that improve functionality, UX, documentation, and test coverage are welcome!


## Code of Conduct

Please be respectful and collaborative; this project is part of a learning environment for CodeYourFuture developers, mentors, and staff. 💙

---

<div align="center">

### 🌟 Star this repo if you find it helpful!

📫 **For questions or suggestions, please [open an issue](https://github.com/gai93003/Jobs-from-the-board-project/issues) or reach out to the contributors.**

**Built with ❤️ by the CodeYourFuture community**

[⬆ Back to Top](#-career-flow)

</div>
