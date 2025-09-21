# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Alumni Relation Application

This is a web-based **Alumni Relation Application** built using **Spring Boot**, **Thymeleaf**, **Hibernate**, and **MySQL**. It is designed to help colleges and universities manage alumni data, facilitate communication, and strengthen the bond between the institution and its alumni network.

## ✨ Features

- ✅ Alumni registration and login  
- ✅ Admin dashboard to manage users and content  
- ✅ Event creation and management  
- ✅ Posting and managing job opportunities  
- ✅ Internal messaging and announcements  
- ✅ Profile management for users  
- ✅ Authentication and authorization  

## 💻 Tech Stack

| Technology       | Description                  |
|------------------|------------------------------|
| Java             | Programming Language         |
| Spring Boot      | Backend Framework            |
| Spring Security  | Authentication & Authorization |
| Thymeleaf        | Template Engine (Frontend)   |
| Hibernate (JPA)  | ORM for Database Interaction |
| MySQL            | Relational Database          |
| Maven            | Dependency Management        |
| Bootstrap/CSS    | Frontend Styling             |

## 📁 Project Structure

```
src
├── main
│   ├── java
│   │   └── com.alumni.app
│   │       ├── controller
│   │       ├── entity
│   │       ├── repository
│   │       ├── service
│   │       └── config
│   └── resources
│       ├── static
│       ├── templates
│       └── application.properties
└── test
```

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven
- MySQL
- IDE (e.g., IntelliJ IDEA, Eclipse)

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/vashist171/Alumini-Relation-Application.git
cd Alumini-Relation-Application
```

2. **Create a MySQL Database**

```sql
CREATE DATABASE alumni_db;
```

3. **Update `application.properties`**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/alumni_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

4. **Build and Run the Project**

```bash
mvn spring-boot:run
```

5. **Open in Browser**

Visit: `http://localhost:8080`

## 🔐 Admin Login

Use the following credentials (if not yet modified):

```
Username: admin
Password: admin123
```

> You can update admin credentials in the database or seed it via the application initializer.

## 🧑‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.



## 📬 Contact

Created by **[Abdul Basith]([https://github.com/Abdulbasith0512])**  
Feel free to reach out for collaboration or feedback..!
