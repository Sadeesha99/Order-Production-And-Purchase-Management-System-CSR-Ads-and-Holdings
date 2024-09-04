# CRM And SCM System of CSR Ads and Holdings Pvt Ltd

This is a web application built using Spring Boot for the backend and HTML, CSS, JavaScript, and Bootstrap for the frontend. The application is designed to run on a Tomcat server and uses MySQL as its database.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- User authentication and authorization
- CRUD operations for managing entities
- Responsive design with Bootstrap
- RESTful API endpoints

## Technologies Used

### Backend

- **Java 17+**
- **Spring Boot**: Microservices framework
- **JPA Repository**: Data persistence
- **MySQL**: Relational database

### Frontend

- **HTML5**: Markup language
- **CSS3**: Styling
- **JavaScript**: Interactivity
- **Bootstrap 5**: Responsive design framework

### Build Tool

- **Gradle**: Dependency management and build tool

### Server

- **Apache Tomcat 9+**: Application server

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Java 17+**: Ensure Java Development Kit (JDK) is installed.
- **MySQL 8+**: MySQL server should be running.
- **Gradle 7+**: Install Gradle for building the project.
- **Apache Tomcat 9+**: Tomcat server for deploying the application.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sadeesha99/Order-Production-And-Purchase-Management-System-CSR-Ads-and-Holdings.git
   cd Order-Production-And-Purchase-Management-System-CSR-Ads-and-Holdings
   ```


## Configuration

After setting up your environment and dependencies, you'll need to configure the application to connect to your MySQL database and specify the server settings.

### MySQL Configuration

1. **Create a MySQL Database**
   - Open your MySQL command line or a MySQL client (like phpMyAdmin).
   - Create a new database by running:
     ```sql
     CREATE DATABASE csroverall;
     ```
   - Replace `csroverall` with the desired name of your database.

2. **Update `application.properties`**
   - Navigate to `src/main/resources/application.properties`.
   - Update the following properties with your MySQL database details:

     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/yourdbname

     # Database credentials
     spring.datasource.username = dbusername
     spring.datasource.password = dbpassword

     # JPA configuration
     spring.jpa.hibernate.ddl-auto=update
     spring.jpa.show-sql=true
     spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
     ```

   - Replace `dbusername` and `dbpassword` with your actual MySQL username and password.

3. **Test Database Connection**
   - Ensure that the application can connect to the database by running the application using Gradle:
     ```bash
     gradle bootRun
     ```
   - The application should start without errors, and the tables should be created automatically in your MySQL database.

### Server Configuration

1. **Tomcat Server**
   - By default, the application runs on port `8080` when deployed on Tomcat.
   - You can change the default port by updating the `server.port` property in `application.properties`:

     ```properties
     server.port=8080
     ```

   - If you're deploying multiple applications on the same Tomcat instance, ensure each application has a unique context path. Set the context path in `application.properties`:

     ```properties
     server.servlet.context-path=/com.csr
     ```

2. **Logging Configuration**
   - You can customize the logging level and output format by modifying the following properties in `application.properties`:

     ```properties
     logging.level.org.springframework=INFO
     logging.level.com.yourpackage=DEBUG
     logging.file.name=logs/spring-boot-app.log
     ```

   - This will create a log file named `spring-boot-app.log` in the `logs` directory of your project.

### Additional Configuration Options

- **Session Timeout**
  - Configure session timeout (in seconds) in `application.properties`:

    ```properties
    server.servlet.session.timeout=1800
    ```

- **Security Settings**
  - For basic security configurations, such as enabling HTTPS, you can update the properties file or implement a custom security configuration in your Spring Boot application.

    ```properties
    server.ssl.key-store=classpath:keystore.p12
    server.ssl.key-store-password=yourpassword
    server.ssl.keyStoreType=PKCS12
    server.ssl.keyAlias=tomcat
    ```

  - Replace `yourpassword` with your keystore password.

---

This configuration should prepare your project to be deployed on a Tomcat server with MySQL as the backend. Ensure to replace placeholders with actual values specific to your environment.


## Usage

After the application is up and running, you can:

Register a new user: Access the registration page.
Log in: Use the login page to access protected resources.
Perform CRUD operations: Use the provided UI to create, read, update, and delete records.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

