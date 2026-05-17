# ToDo List Application: Architecture Overview

This project is a modern, full-stack ToDo List application built with a focus on clean architecture, scalability, and observability. It features a unique **Neo-Brutalist** design and a robust technical stack.

## 1. Backend Architecture (.NET 9.0)

The backend follows **Clean Architecture (N-Layer)** principles and the **CQRS (Command Query Responsibility Segregation)** pattern.

### **Projects & Layers**
*   **TodoList.Domain**: The core layer containing enterprise logic, entities (`TodoItem`), and enums (`TodoStatus`, `TodoPriority`). It has no dependencies on other layers or external libraries.
*   **TodoList.Application**: The orchestration layer. 
    *   **CQRS**: Uses **MediatR** to separate read operations (Queries) and write operations (Commands).
    *   **Validation**: Uses **FluentValidation** integrated via a MediatR Pipeline Behavior to automatically validate requests before they reach handlers.
    *   **Mapping**: Uses **AutoMapper 16.1.1** to transform entities into DTOs.
*   **TodoList.Infrastructure**: Implementation of external concerns.
    *   **Persistence**: **Entity Framework Core 9.0** with **MSSQL Server**.
    *   **Migrations**: Automated schema management via EF Core Migrations.
*   **TodoList.Api**: The entry point.
    *   **Controllers**: Thin controllers that delegate all work to MediatR.
    *   **Global Exception Handling**: Implements `IExceptionHandler` to catch all errors and return **Problem Details (RFC 7807)** JSON responses.
    *   **CORS**: Configured to allow communication with the React frontend.

### **Observability**
*   **OpenTelemetry**: Fully instrumented to capture traces and metrics from ASP.NET Core, HttpClient, and **SQL Queries** (EF Core).
*   **Exporter**: Data is sent via OTLP to a local collector.

---

## 2. Frontend Architecture (React 19)

The frontend is a single-page application (SPA) designed for a high-impact visual experience and seamless data synchronization.

### **State Management**
*   **Redux Toolkit (RTK)**: Centralized state management.
*   **RTK Query**: Handles all API interactions. It provides automated caching, loading states, and **Tag-based cache invalidation** (e.g., creating a task automatically refreshes the list).

### **UI & Styling**
*   **MUI (Material UI) v6/v9**: Globally customized with a **Neo-Brutalist** theme (bold 2px borders, sharp 0px corners, and solid 8px black shadows).
*   **Responsive Views**:
    1.  **List View**: Traditional list with expandable task details (slide-down animation).
    2.  **Calendar View**: Visual grid showing tasks by their deadlines for the next 14 days.
    3.  **Kanban Board**: Drag-and-drop board using `@hello-pangea/dnd` for status management.
*   **Localization**: Integrated with `dayjs` and MUI X Date Pickers for deadline management.

### **Observability**
*   **OpenTelemetry Web SDK**: Captures user interactions (clicks), page load performance, and correlates frontend fetches with backend traces using header propagation.

---

## 3. Infrastructure & DevOps

*   **Docker Compose**: Orchestrates the environment:
    *   `mssql`: Microsoft SQL Server 2022.
    *   `otel-collector`: Receives telemetry from both the React app and .NET API, exporting raw data to logs for real-time debugging.
*   **Database Setup**: A dedicated `clickhouse-setup` helper ensures the observability schema is initialized correctly.

---

## 4. Testing Strategy

### **Backend (xUnit)**
*   **Unit Tests**: Validate Domain logic and entity defaults.
*   **Integration Tests**: Use `Microsoft.EntityFrameworkCore.InMemory` to test MediatR handlers and database interactions in isolation.

### **Frontend (Jest)**
*   **Component Tests**: Use **React Testing Library**.
*   **Mocking**: Utilizes a custom `test-utils.tsx` that provides a fresh Redux store and MUI theme for every test, with global `fetch` mocking for predictable API testing.

---

## 5. Development Workflow

1.  **Start Infrastructure**: `docker compose up -d`
2.  **Update Database**: `dotnet ef database update`
3.  **Run API**: `dotnet run`
4.  **Run Client**: `npm run dev`
5.  **Live Telemetry**: `docker logs -f otel-collector`
