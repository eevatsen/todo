# ToDo List Implementation Plan

## Objective
Implement a full-stack ToDo List application with React/Redux Toolkit (Frontend) and .NET 9.0 MediatR/CQRS (Backend). The implementation will include MUI for the UI, AutoMapper, Docker for local setup, and OpenTelemetry for observability. Serilog is excluded and documented as a future improvement.

## Background & Motivation
The user requires a system to create, edit, delete, and track tasks (status and deadlines) using a specific modern stack. 

## Scope & Impact
*   **Backend**: Modifying `TodoList.Api`, `TodoList.Domain`, `TodoList.Application`, and `TodoList.Infrastructure`.
*   **Frontend**: Building out `client/src` with MUI components and Redux.
*   **Infrastructure**: Adding a `docker-compose.yml` for MSSQL and SigNoz (OTLP exporter).

## Architecture & Data Flow
1.  **Client**: React UI -> Redux (RTK Query) -> API calls.
2.  **API**: .NET Controllers -> MediatR Commands/Queries -> Application Layer.
3.  **Application**: Validation, AutoMapper (Entity <-> DTO) -> Infrastructure.
4.  **Infrastructure**: EF Core -> MSSQL database.

## Phase 1: Infrastructure & Backend Core
1.  **Docker Setup**: Create `docker-compose.yml` for MSSQL Database and SigNoz (for OpenTelemetry).
2.  **Domain**: Create `TodoItem` entity and `TodoStatus` enum in `TodoList.Domain`.
3.  **Infrastructure**: 
    *   Add EF Core packages (SqlServer, Tools).
    *   Create `AppDbContext` and migrations.
4.  **Application (CQRS)**:
    *   Add MediatR and AutoMapper packages.
    *   Create DTOs (`TodoItemDto`, `CreateTodoItemCommand`, etc.).
    *   Implement Command/Query Handlers.
5.  **API**:
    *   Configure OpenTelemetry (Tracing & Metrics) targeting SigNoz.
    *   Create `TodoController`.

## Phase 2: Backend Testing
1.  Implement xUnit tests for MediatR Handlers in `TodoList.Application.Tests`.
2.  Implement unit tests for Domain logic (if any).

## Phase 3: Frontend Setup & State
1.  **Dependencies**: Install MUI (`@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/x-date-pickers`, `dayjs`), OpenTelemetry for web.
2.  **State Management**: Create `apiSlice` using RTK Query for CRUD operations on tasks.
3.  **OpenTelemetry**: Setup frontend tracing to send data to the OpenTelemetry collector.

## Phase 4: Frontend UI Components
1.  **Layout**: Main container and navigation (List View vs. Calendar View).
2.  **TaskList**: Table or Grid showing tasks with Status and Edit/Delete buttons.
3.  **TaskForm**: Dialog/Modal for Creating and Editing tasks.
4.  **TaskCalendar**: Utilizing MUI Date Pickers or a custom calendar view to show tasks by deadline.

## Phase 5: Frontend Testing
1.  Implement Jest + React Testing Library tests for main components (TaskList, TaskForm).

## Verification
*   Run `docker-compose up` to start dependencies.
*   Run backend API and ensure Swagger UI is accessible.
*   Run frontend and verify end-to-end functionality (Create, Read, Update, Delete, Status Change, Calendar View).
*   Verify traces appear in SigNoz.

## Future Improvements
*   **Serilog Integration**: Currently using default logging. Future iterations can integrate Serilog for structured logging to sinks like Elasticsearch or Seq.
