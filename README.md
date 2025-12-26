# Fuel Consumption Tracker

A comprehensive application for tracking and managing vehicle fuel consumption, expenses, and maintenance records.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Overview

Fuel Consumption Tracker is a full-featured application designed to help vehicle owners monitor their fuel consumption patterns, track expenses, and maintain detailed records of their vehicle maintenance. The application provides analytics and insights into fuel efficiency and spending trends.

### Key Benefits

- **Real-time Fuel Tracking**: Log fuel purchases and monitor consumption patterns
- **Expense Management**: Track fuel costs and identify spending trends
- **Vehicle Health Monitoring**: Keep records of maintenance activities
- **Analytics & Reporting**: Generate detailed reports on fuel efficiency and expenses
- **Multi-Vehicle Support**: Manage multiple vehicles in a single account

## Features

### Core Features

- 🚗 **Vehicle Management**
  - Add and manage multiple vehicles
  - Track vehicle information (make, model, year, registration)
  - Monitor vehicle maintenance history

- ⛽ **Fuel Consumption Tracking**
  - Log fuel purchases with date, amount, and cost
  - Calculate fuel efficiency (MPG/km/L)
  - Identify consumption trends and anomalies

- 💰 **Expense Tracking**
  - Detailed cost analysis per vehicle
  - Monthly and yearly spending summaries
  - Cost per mile/kilometer calculations

- 📊 **Analytics & Reporting**
  - Visual charts and graphs
  - Detailed consumption reports
  - Export reports in CSV/PDF format
  - Performance trends and predictions

- 🔧 **Maintenance Logging**
  - Schedule and track maintenance tasks
  - Record repair history and costs
  - Maintenance reminders and alerts

- 👤 **User Management**
  - Secure user authentication
  - Profile management
  - Multi-user support

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free disk space
- **Browser** (for web version): Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Software Requirements

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **Database**: PostgreSQL 12+ or MongoDB 4.4+
- **Python**: v3.8+ (if using data analysis features)

## Installation

### Prerequisites

Before installing, ensure you have the following installed on your system:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check git version
git --version
```

### Step 1: Clone the Repository

```bash
git clone https://github.com/himosoft2013/fuel-consumption-tracker.git
cd fuel-consumption-tracker
```

### Step 2: Install Dependencies

```bash
# Install npm packages
npm install

# If you're using yarn instead
yarn install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Application
NODE_ENV=development
PORT=3000
APP_NAME=Fuel Consumption Tracker
APP_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fuel_tracker
DB_USER=postgres
DB_PASSWORD=your_password
DATABASE_URL=postgresql://user:password@localhost:5432/fuel_tracker

# JWT Authentication
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# API Configuration
API_KEY=your_api_key_here
API_TIMEOUT=30000

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### Step 4: Database Setup

#### For PostgreSQL:

```bash
# Create database
createdb fuel_tracker

# Run migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

#### For MongoDB:

```bash
# MongoDB connection string in .env
MONGODB_URI=mongodb://localhost:27017/fuel_tracker

# Run migrations
npm run migrate:mongo
```

### Step 5: Start the Application

#### Development Mode:

```bash
npm run dev
```

#### Production Mode:

```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

### Step 6: Docker Installation (Optional)

If you prefer to use Docker:

```bash
# Build the Docker image
docker build -t fuel-consumption-tracker .

# Run the container
docker run -p 3000:3000 --env-file .env fuel-consumption-tracker

# Using Docker Compose
docker-compose up
```

## Configuration

### Application Settings

#### Email Configuration

To enable email notifications, configure your SMTP settings in `.env`:

```env
SMTP_HOST=your_smtp_server
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password
SMTP_FROM=noreply@fueltracker.com
```

#### Authentication

- Default JWT expiration: 7 days
- Password requirements: Minimum 8 characters, including uppercase, lowercase, and numbers
- Two-factor authentication: Available in settings

#### File Upload

- Maximum file size: 10MB
- Allowed formats: PDF, CSV, Excel
- Storage location: `./uploads`

## Usage

### Getting Started

#### 1. Create an Account

Navigate to the registration page and create your account:

```
URL: http://localhost:3000/auth/register
```

#### 2. Add Your First Vehicle

1. Go to Dashboard → Vehicle Management
2. Click "Add New Vehicle"
3. Fill in vehicle details (make, model, year, registration number)
4. Click "Save"

#### 3. Log Your First Fuel Purchase

1. Click "Log Fuel Purchase"
2. Enter fuel details:
   - Date of purchase
   - Amount of fuel (gallons/liters)
   - Cost
   - Odometer reading
3. Click "Save"

#### 4. View Analytics

1. Navigate to Analytics Dashboard
2. Select time period (weekly, monthly, yearly)
3. View charts and metrics

### Common Tasks

#### Adding Multiple Vehicles

```
Dashboard → Vehicles → Add Vehicle → Fill Details → Save
```

#### Exporting Reports

```
Reports → Select Period → Select Format (PDF/CSV) → Download
```

#### Setting Maintenance Reminders

```
Maintenance → Add Reminder → Set Schedule → Save
```

## API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

All API requests require a Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3000/api/v1/vehicles
```

### Endpoints

#### Vehicles

```bash
# Get all vehicles
GET /vehicles

# Get vehicle by ID
GET /vehicles/:id

# Create vehicle
POST /vehicles
Content-Type: application/json

{
  "make": "Toyota",
  "model": "Camry",
  "year": 2022,
  "registration": "ABC123"
}

# Update vehicle
PUT /vehicles/:id

# Delete vehicle
DELETE /vehicles/:id
```

#### Fuel Logs

```bash
# Get fuel logs for vehicle
GET /vehicles/:vehicleId/fuel-logs

# Add fuel log
POST /vehicles/:vehicleId/fuel-logs
Content-Type: application/json

{
  "date": "2025-12-26",
  "amount": 50,
  "cost": 75.50,
  "odometer": 45000
}

# Update fuel log
PUT /fuel-logs/:id

# Delete fuel log
DELETE /fuel-logs/:id
```

#### Analytics

```bash
# Get fuel efficiency
GET /analytics/efficiency?vehicleId=:id&period=monthly

# Get expense summary
GET /analytics/expenses?vehicleId=:id&startDate=2025-01-01&endDate=2025-12-31

# Get consumption trends
GET /analytics/trends?vehicleId=:id
```

### Error Responses

```json
{
  "status": "error",
  "code": 400,
  "message": "Invalid request parameters",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Vehicles Table

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER,
  registration VARCHAR(50) UNIQUE,
  color VARCHAR(50),
  fuel_type VARCHAR(20),
  transmission VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Fuel Logs Table

```sql
CREATE TABLE fuel_logs (
  id UUID PRIMARY KEY,
  vehicle_id UUID NOT NULL,
  date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  odometer INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
```

### Maintenance Records Table

```sql
CREATE TABLE maintenance_records (
  id UUID PRIMARY KEY,
  vehicle_id UUID NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  description TEXT,
  cost DECIMAL(10, 2),
  service_date DATE,
  next_due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
```

## Development

### Project Structure

```
fuel-consumption-tracker/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── config/
├── tests/
│   ├── unit/
│   └── integration/
├── migrations/
├── public/
├── views/
├── .env.example
├── package.json
├── README.md
└── docker-compose.yml
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/unit/auth.test.js

# Watch mode
npm run test:watch
```

### Building for Production

```bash
# Build the project
npm run build

# Start production server
npm start

# Generate documentation
npm run docs
```

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/fuel-consumption-tracker.git
   cd fuel-consumption-tracker
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add tests for new features

4. **Commit Your Changes**
   ```bash
   git commit -m "Add: Brief description of changes"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Ensure all tests pass

### Code Style Guidelines

- Use ESLint for JavaScript linting
- Follow the existing naming conventions
- Write meaningful commit messages
- Add comments for complex logic
- Maintain code coverage above 80%

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

### Getting Help

- **Documentation**: Check the [Wiki](https://github.com/himosoft2013/fuel-consumption-tracker/wiki)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/himosoft2013/fuel-consumption-tracker/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/himosoft2013/fuel-consumption-tracker/discussions)

### FAQ

**Q: Can I use this for fleet management?**
A: The current version supports single and multiple personal vehicles. Fleet management features are planned for future releases.

**Q: What's the data retention policy?**
A: Your data is retained indefinitely unless you request account deletion. We recommend regular backups.

**Q: Is my data secure?**
A: Yes, we use industry-standard encryption (AES-256) for sensitive data and SSL/TLS for all communications.

**Q: Can I export my data?**
A: Yes, you can export your data in CSV or JSON format from the settings page.

### Contact

- **Email**: support@fueltracker.com
- **Issues**: [GitHub Issues](https://github.com/himosoft2013/fuel-consumption-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/himosoft2013/fuel-consumption-tracker/discussions)

---

**Last Updated**: December 26, 2025

**Maintainer**: [himosoft2013](https://github.com/himosoft2013)

**Project Status**: Active Development ✨
