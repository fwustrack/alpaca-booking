# Alpaca Booking Project - Agent Steering Guide

## Project Overview

This is an **Alpaca Booking Platform** - a full-stack web application for booking alpaca farm events and experiences. The system consists of:

- **Backend**: Django REST API with PostgreSQL database
- **Frontend**: Angular 19 application with PrimeNG UI components
- **Infrastructure**: Docker-based development environment

## Architecture & Technology Stack

### Backend (Django)
- **Framework**: Django 5.1.6 with Django REST Framework
- **Database**: PostgreSQL (Docker container)
- **Authentication**: JWT tokens via `djangorestframework-simplejwt`
- **API Documentation**: DRF Spectacular (OpenAPI/Swagger)
- **Testing**: pytest with pytest-django
- **Package Management**: UV (Python package manager)

### Frontend (Angular)
- **Framework**: Angular 19.2
- **UI Library**: PrimeNG 19.1.3 with PrimeIcons
- **Icons**: FontAwesome
- **Styling**: SCSS with custom variables
- **Package Management**: npm

### Development Environment
- **Containerization**: Docker with docker-compose
- **Database**: PostgreSQL container
- **API Testing**: Bruno HTTP client (in `/bruno` directory)

## Core Domain Models

### Event Management
- **EventType**: Categories of events (e.g., "Alpaca Walk", "Wine Tasting")
- **Event**: Specific event instances with start times
- **TicketType**: Different ticket categories per event type with pricing
- **Booking**: Customer reservations with contact details and tickets

### Resource Management
- **ResourceType**: Types of resources needed for events
- **ResourceCapacity**: Available resources per event type
- **ResourceConsumption**: Resources consumed per ticket type

### Animal Management
- **Animal**: Individual alpacas with descriptions and sponsorship info

## Key Business Logic

### Booking System
- Events are instances of event types with specific start times
- Tickets are purchased as part of bookings
- Resource consumption is tracked to prevent overbooking
- Bookings include customer contact information and optional comments

### Permissions
- **Public**: Can create bookings and view events/animals
- **Authenticated**: Can view existing bookings (with proper permissions)
- **Staff**: Full administrative access

## Development Patterns & Standards

### Django Backend Patterns
```python
# Use natural keys for fixtures and data loading
def natural_key(self):
    return (self.name,)

# Implement proper managers for natural key lookups
class ResourceTypeManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)

# Use proper constraints for data integrity
class Meta:
    constraints = [
        models.UniqueConstraint(fields=['name', 'event_type'], name='unique_name_event_type')
    ]
```

### API Design
- RESTful endpoints using ViewSets
- Proper permission classes for different access levels
- Consistent serializer patterns
- JWT authentication for protected endpoints

### Frontend Patterns
- Component-based architecture with shared components
- Service layer for API communication
- Route guards for authentication
- Responsive design with SCSS variables

## File Structure Guidelines

### Project Root Structure
```
alpaca-booking/
├── scripts/            # Utility scripts for development
│   ├── README.md       # Script documentation
│   ├── setup-git-hooks.sh    # Git hook installation
│   └── format-code.sh         # Manual code formatting
├── fe/                 # Angular frontend application
├── alpacabooking/      # Django backend application
├── config/             # Django project configuration
├── bruno/              # API testing collections
├── env/                # Environment configuration files
└── docker-compose.yml  # Docker development setup
```

### Backend Structure
```
alpacabooking/           # Main Django app
├── models.py           # Domain models
├── views.py            # API viewsets
├── serializers.py      # DRF serializers
├── urls.py             # URL routing
├── admin.py            # Django admin config
├── migrations/         # Database migrations
├── fixtures/           # Test data (YAML format)
├── management/         # Custom Django commands
└── tests/              # Test files
```

### Frontend Structure
```
fe/src/app/
├── components/         # Reusable UI components
├── pages/             # Route components
├── services/          # API and business logic services
├── auth/              # Authentication logic
├── models/            # TypeScript interfaces
└── config/            # Configuration files
```

## Development Workflow

### Local Development Setup

#### Prerequisites
- Docker (via Colima on macOS - see global Kiro steering for setup)
- Node.js 18+ and npm
- UV Python package manager (installed in Docker container)

#### Starting the Project

1. **Environment Setup**
   ```bash
   # Create secrets file from sample
   cp env/secrets.sample.env env/secrets.dev.env
   # Edit env/secrets.dev.env with your values (default values work for development)
   ```

2. **Start Backend Services (Django + PostgreSQL)**
   ```bash
   # Start database and Django API in Docker
   docker-compose up app-dev
   ```
   
   This will:
   - Start PostgreSQL database container
   - Build and start Django application container
   - Run database migrations automatically
   - Create superuser (admin/admin123)
   - Load test data from fixtures
   - Start Django development server at http://localhost:8000

3. **Start Frontend (Angular)**
   ```bash
   cd fe
   npm install --legacy-peer-deps  # First time only
   npm start
   ```
   
   This starts the Angular development server at http://localhost:4200

#### Access Points
- **Frontend Application**: http://localhost:4200/
- **Django API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/ (admin/admin123)
- **API Documentation**: http://localhost:8000/swagger/
- **Database**: localhost:5432 (ab_django/ab_django/ab_django_dev)

#### Development Commands
```bash
# Backend (run inside Docker container)
docker-compose exec app-dev uv run python manage.py <command>

# Frontend
cd fe
npm run build          # Build for production
npm run test           # Run unit tests
npm run format         # Format code with Prettier
npm run format:check   # Check formatting without fixing

# Code Formatting
./scripts/setup-git-hooks.sh    # Install git hooks for automatic formatting
./scripts/format-code.sh        # Format all code files manually

# Python formatting (Docker environment)
docker-compose exec app-dev uv run ruff format .
docker-compose exec app-dev uv run ruff check --fix .

# Python formatting (local uv)
uv run ruff format .
uv run ruff check --fix .

# Database operations
docker-compose exec app-dev uv run python manage.py migrate
docker-compose exec app-dev uv run python manage.py loaddata base-data groups
docker-compose exec app-dev uv run python manage.py createsuperuser
```

#### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop just the frontend
# Ctrl+C in the npm start terminal
```

#### Troubleshooting
- **Docker issues**: Ensure Colima is running (`colima status`)
- **Port conflicts**: Make sure ports 8000, 4200, and 5432 are available
- **Angular build errors**: Try `rm -rf node_modules && npm install --legacy-peer-deps`
- **Database connection**: Check that PostgreSQL container is running with `docker-compose ps`

### Testing Strategy
- **Backend**: pytest with Django test database
- **Frontend**: Jasmine/Karma for unit tests
- **API Testing**: Bruno HTTP client collections
- **End-to-End**: Playwright for full user journey testing
- **Integration**: Docker-based full stack testing

### Data Management
- Use Django fixtures (YAML format) for test data
- Management commands for data initialization
- Natural keys for reliable fixture loading

## Common Development Tasks

### Adding New Models
1. Define model in `models.py` with proper constraints
2. Add natural key methods if needed
3. Create and run migrations
4. Add to admin interface
5. Create serializers and viewsets
6. Update URL routing
7. Add fixtures for test data

### Frontend Development
1. Generate components with Angular CLI
2. Follow existing component structure patterns
3. Use PrimeNG components for consistency
4. Implement proper error handling
5. Add responsive design considerations

### API Integration
1. Define TypeScript interfaces matching backend models
2. Create service methods for API calls
3. Handle authentication and error states
4. Update Bruno collections for testing

## Security Considerations

- JWT tokens with short expiration (15 minutes access, 1 day refresh)
- CORS configuration for frontend integration
- Proper permission classes on all viewsets
- Environment-based configuration for secrets
- CSRF protection enabled

## Performance Guidelines

- Use select_related/prefetch_related for database queries
- Implement proper pagination for large datasets
- Optimize Angular change detection strategies
- Use lazy loading for route modules
- Implement proper caching strategies

## Deployment Notes

- Docker-based deployment ready
- Environment variable configuration
- Static file handling configured
- Database migrations automated
- Health check endpoints available

## Troubleshooting Common Issues

### Backend Issues
- **Database Connection**: Check PostgreSQL container status
- **Migrations**: Run `python manage.py migrate`
- **Fixtures**: Use `python manage.py loaddata` for test data
- **Permissions**: Check user groups and permissions

### Frontend Issues
- **CORS Errors**: Verify backend CORS configuration
- **Authentication**: Check JWT token handling
- **Build Issues**: Clear node_modules and reinstall
- **Styling**: Check SCSS compilation and PrimeNG theme

## Code Quality Standards

### Automated Code Formatting

This project uses automated code formatting to maintain consistent code style across the entire codebase:

- **Frontend (fe/)**: Prettier for TypeScript, HTML, SCSS, and JSON files
- **Backend (Python)**: Ruff for formatting and linting

#### Code Formatting Configuration

**Prettier Configuration** (`.prettierrc` in `fe/` directory):
```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "bracketSameLine": true
}
```

**Ruff Configuration** (in `pyproject.toml`):
```toml
[tool.ruff]
line-length = 88
indent-width = 4
target-version = "py313"
exclude = ["fe", "migrations", "node_modules", ".venv"]

[tool.ruff.lint]
select = ["E4", "E7", "E9", "F", "I"]
fixable = ["ALL"]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

#### Git Hooks for Automatic Formatting

The project includes a pre-commit git hook that automatically formats code before each commit:

**Setup Git Hooks:**
```bash
./scripts/setup-git-hooks.sh
```

**What the hook does:**
- Automatically formats staged frontend files with Prettier
- Automatically formats staged Python files with Ruff
- Runs linting and auto-fixes issues where possible
- Prevents commits if there are unfixable linting issues
- Provides clear feedback with colored output

**Manual Formatting:**
```bash
# Format all files in the project
./scripts/format-code.sh

# Format only frontend files
cd fe && npm run format

# Format only Python files (Docker environment)
docker-compose exec app-dev uv run ruff format .
docker-compose exec app-dev uv run ruff check --fix .

# Format only Python files (local uv)
uv run ruff format .
uv run ruff check --fix .
```

#### Agent Guidelines for Code Formatting

**CRITICAL: Always format code when making changes**

1. **Before making any code changes**: Ensure the git hook is installed by running `./scripts/setup-git-hooks.sh`

2. **When writing new code**: Follow the established formatting patterns, but don't worry about perfect formatting - the tools will handle it

3. **After making changes**: The pre-commit hook will automatically format your code, but you can also run manual formatting:
   - For quick formatting of all files: `./scripts/format-code.sh`
   - For frontend only: `cd fe && npm run format`
   - For Python only: Use appropriate Ruff commands based on environment

4. **When reviewing code**: If you notice formatting issues, run the formatters rather than manually fixing spacing/style

5. **For large refactoring**: Run `./scripts/format-code.sh` before starting to ensure a clean baseline

#### Formatting Tool Integration

**Docker Environment:**
- Ruff is available inside the Docker container via `uv run ruff`
- Use `docker-compose exec app-dev uv run ruff format .` for formatting
- Use `docker-compose exec app-dev uv run ruff check --fix .` for linting

**Local Development:**
- Frontend: Prettier via npm scripts in `fe/` directory
- Backend: Ruff via `uv run ruff` if uv is installed locally

**IDE Integration:**
- Configure your IDE to use Prettier for frontend files
- Configure your IDE to use Ruff for Python files
- Enable format-on-save for automatic formatting

#### Bypassing Formatting (Use Sparingly)

If you need to commit without running formatting checks:
```bash
git commit --no-verify
```

**Note**: Only use `--no-verify` in exceptional circumstances. The formatting tools are designed to maintain code quality and consistency.

### Python (Backend)
- Follow PEP 8 style guidelines (enforced by Ruff)
- Use type hints where appropriate
- Write comprehensive docstrings
- Implement proper error handling
- Use Django best practices for models and views
- Line length: 88 characters (Black-compatible)
- Use double quotes for strings
- Import sorting handled automatically by Ruff

### TypeScript (Frontend)
- Use strict TypeScript configuration
- Implement proper interfaces for all data structures
- Follow Angular style guide
- Use Prettier for code formatting (configured automatically)
- Implement proper component lifecycle management
- Line length: 100 characters
- Use single quotes for strings
- Trailing commas in multi-line structures

## Testing Guidelines

### Backend Testing
- Write unit tests for all business logic
- Use Django test client for API testing
- Mock external dependencies
- Test permission and authentication logic
- Maintain high test coverage

### Frontend Testing
- Unit test components and services
- Mock HTTP calls in tests
- Test user interactions and form validation
- Use Angular testing utilities
- Test responsive behavior

### End-to-End Testing with Playwright

#### Setup and Configuration
```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: [
    {
      command: 'npm run start',
      cwd: './fe',
      port: 4200,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'python manage.py runserver',
      port: 8000,
      reuseExistingServer: !process.env.CI,
    }
  ],
});
```

#### Test Structure
```
e2e/
├── fixtures/           # Test data and setup helpers
├── pages/             # Page Object Model classes
├── tests/             # Test specifications
│   ├── booking/       # Booking flow tests
│   ├── events/        # Event management tests
│   ├── auth/          # Authentication tests
│   └── animals/       # Animal page tests
└── utils/             # Shared utilities and helpers
```

#### Page Object Model Pattern
```javascript
// e2e/pages/booking-page.js
export class BookingPage {
  constructor(page) {
    this.page = page;
    this.eventSelect = page.locator('[data-testid="event-select"]');
    this.ticketQuantity = page.locator('[data-testid="ticket-quantity"]');
    this.customerForm = page.locator('[data-testid="customer-form"]');
    this.submitButton = page.locator('[data-testid="submit-booking"]');
  }

  async selectEvent(eventName) {
    await this.eventSelect.click();
    await this.page.locator(`text=${eventName}`).click();
  }

  async fillCustomerDetails(customer) {
    await this.page.fill('[data-testid="firstname"]', customer.firstname);
    await this.page.fill('[data-testid="lastname"]', customer.lastname);
    await this.page.fill('[data-testid="email"]', customer.email);
    await this.page.fill('[data-testid="phone"]', customer.phone);
  }

  async submitBooking() {
    await this.submitButton.click();
  }
}
```

#### Core Test Scenarios

**Booking Flow Tests**
```javascript
// e2e/tests/booking/complete-booking.spec.js
import { test, expect } from '@playwright/test';
import { BookingPage } from '../../pages/booking-page.js';

test.describe('Complete Booking Flow', () => {
  test('should complete a full booking journey', async ({ page }) => {
    const bookingPage = new BookingPage(page);
    
    // Navigate to booking page
    await page.goto('/events');
    await page.click('text=Book Now');
    
    // Select event and tickets
    await bookingPage.selectEvent('Alpaca Walk');
    await page.fill('[data-testid="adult-tickets"]', '2');
    
    // Fill customer details
    await bookingPage.fillCustomerDetails({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      phone: '+49123456789'
    });
    
    // Submit booking
    await bookingPage.submitBooking();
    
    // Verify success
    await expect(page.locator('text=Booking Confirmed')).toBeVisible();
    await expect(page.locator('[data-testid="booking-reference"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    const bookingPage = new BookingPage(page);
    
    await page.goto('/booking');
    await bookingPage.submitBooking();
    
    // Check validation messages
    await expect(page.locator('text=Event is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });
});
```

**Authentication Tests**
```javascript
// e2e/tests/auth/login.spec.js
test.describe('Authentication', () => {
  test('admin login and booking management', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin');
    await page.fill('[data-testid="password"]', process.env.ADMIN_PASSWORD);
    await page.click('[data-testid="login-button"]');
    
    // Navigate to bookings
    await page.goto('/admin/bookings');
    
    // Verify admin can see all bookings
    await expect(page.locator('[data-testid="bookings-table"]')).toBeVisible();
    await expect(page.locator('text=All Bookings')).toBeVisible();
  });
});
```

**Resource Management Tests**
```javascript
// e2e/tests/booking/resource-limits.spec.js
test.describe('Resource Management', () => {
  test('should prevent overbooking when capacity is reached', async ({ page }) => {
    // Setup: Create event with limited capacity via API
    await page.request.post('/api/events/', {
      data: {
        event_type: 1,
        start_time: '2024-12-25T10:00:00Z'
      }
    });
    
    // Try to book more tickets than available
    await page.goto('/booking');
    await page.selectOption('[data-testid="event-select"]', 'Limited Event');
    await page.fill('[data-testid="ticket-quantity"]', '999');
    
    // Should show capacity error
    await expect(page.locator('text=Insufficient capacity')).toBeVisible();
  });
});
```

#### Test Data Management
```javascript
// e2e/fixtures/test-data.js
export const testEvents = {
  alpacaWalk: {
    name: 'Alpaca Walk',
    description: 'Walk with our friendly alpacas',
    capacity: 10
  },
  wineWalk: {
    name: 'Wine Walk',
    description: 'Wine tasting with alpaca companions',
    capacity: 8
  }
};

export const testCustomers = {
  validCustomer: {
    firstname: 'Test',
    lastname: 'Customer',
    email: 'test@example.com',
    phone: '+49123456789',
    street: 'Test Street 1',
    city: 'Test City',
    plz: '12345'
  }
};
```

#### API Testing Integration
```javascript
// e2e/utils/api-helpers.js
export class ApiHelpers {
  constructor(request) {
    this.request = request;
    this.baseURL = 'http://localhost:8000/api';
  }

  async createEvent(eventData) {
    return await this.request.post(`${this.baseURL}/events/`, {
      data: eventData
    });
  }

  async getBookings() {
    return await this.request.get(`${this.baseURL}/bookings/`);
  }

  async cleanupTestData() {
    // Clean up test bookings and events
    const bookings = await this.getBookings();
    for (const booking of bookings.data) {
      if (booking.email.includes('test')) {
        await this.request.delete(`${this.baseURL}/bookings/${booking.id}/`);
      }
    }
  }
}
```

#### Visual Regression Testing
```javascript
// e2e/tests/visual/homepage.spec.js
test.describe('Visual Regression', () => {
  test('homepage layout', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('booking form layout', async ({ page }) => {
    await page.goto('/booking');
    await expect(page.locator('[data-testid="booking-form"]')).toHaveScreenshot('booking-form.png');
  });
});
```

#### Performance Testing
```javascript
// e2e/tests/performance/load-times.spec.js
test.describe('Performance', () => {
  test('page load times', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // 3 second max load time
  });
});
```

#### Mobile Testing
```javascript
// e2e/tests/mobile/responsive.spec.js
test.describe('Mobile Experience', () => {
  test('booking flow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await page.goto('/booking');
    
    // Verify mobile-friendly layout
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="booking-form"]')).toBeVisible();
  });
});
```

#### CI/CD Integration
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm ci
          cd fe && npm ci
          pip install -r requirements.txt
      
      - name: Setup test database
        run: |
          docker-compose up -d db
          python manage.py migrate
          python manage.py loaddata fixtures/test-data.yaml
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npx playwright test
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

#### Best Practices for E2E Testing

**Test Organization**
- Group tests by user journey or feature area
- Use descriptive test names that explain the scenario
- Keep tests independent and able to run in any order
- Use setup/teardown hooks for data preparation

**Selectors and Locators**
- Use `data-testid` attributes for reliable element selection
- Avoid CSS selectors that might change with styling updates
- Use semantic locators when possible (role, text content)
- Create reusable locator constants

**Test Data Management**
- Use fixtures for consistent test data
- Clean up test data after each test run
- Use unique identifiers to avoid conflicts
- Separate test data from production data

**Error Handling and Debugging**
- Use screenshots and videos for failed tests
- Implement retry logic for flaky tests
- Add detailed logging for complex scenarios
- Use Playwright's trace viewer for debugging

**Performance Considerations**
- Run tests in parallel when possible
- Use headless mode for CI/CD
- Implement smart waiting strategies
- Cache dependencies and build artifacts

This comprehensive E2E testing strategy ensures full coverage of user journeys while maintaining reliability and performance in the Alpaca Booking platform.

This steering document should guide all development work on the Alpaca Booking platform, ensuring consistency and quality across the full-stack application.