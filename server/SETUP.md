# Server Setup Guide - PostgreSQL Connection

This guide will help you set up the server to connect with your PostgreSQL database.

## Prerequisites

- PostgreSQL installed and running
- Node.js and pnpm installed
- Database already created in PostgreSQL

## Step 1: Install Dependencies

```bash
cd server
pnpm install
```

## Step 2: Configure Database Connection

Create a `.env` file in the `server` directory with your PostgreSQL connection string:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration (for authentication)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

### DATABASE_URL Format

The `DATABASE_URL` follows this format:
```
postgresql://[username]:[password]@[host]:[port]/[database_name]
```

Example:
```
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/stageTrack
```

## Step 3: Verify Database Connection

The server will automatically:
1. Connect to PostgreSQL when it starts
2. Sync all models with the database (creates/updates tables)
3. Set up all relationships and associations

## Step 4: Start the Server

### Development Mode (with auto-reload):
```bash
pnpm run dev
```

### Production Mode:
```bash
pnpm start
```

## What Happens on Startup

1. **Database Connection**: The server connects to PostgreSQL using the `DATABASE_URL`
2. **Model Synchronization**: All Sequelize models are synchronized with the database:
   - Creates tables if they don't exist
   - Alters tables to match model definitions (in development)
   - Sets up foreign keys and relationships

## Database Models

The following models are automatically set up:

- **users** - User accounts
- **roles** - User roles
- **user_roles** - Many-to-many relationship between users and roles
- **saccos** - SACCO organizations
- **stages** - Stage locations

## Troubleshooting

### Connection Errors

If you see connection errors:

1. **Check PostgreSQL is running**:
   ```bash
   sudo systemctl status postgresql
   # or
   psql --version
   ```

2. **Verify DATABASE_URL**:
   - Check username, password, host, port, and database name
   - Ensure the database exists: `psql -l` to list databases

3. **Test connection manually**:
   ```bash
   psql postgresql://username:password@localhost:5432/database_name
   ```

### Model Sync Issues

- If tables already exist, `alter: true` will update them to match models
- For a fresh start, you can use `force: true` (⚠️ **WARNING**: This drops all tables!)
- Check the console for any SQL errors during sync

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── models/
│   │   ├── index.js       # Models index (imports all models)
│   │   ├── User/
│   │   │   ├── User.js
│   │   │   ├── Role.js
│   │   │   └── user_role.js
│   │   ├── sacco.model.js
│   │   └── stage.model.js
│   ├── routes/            # API routes
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   └── middlewares/       # Express middlewares
├── server.js              # Main server file
└── .env                   # Environment variables (create this)
```

## Next Steps

After the server starts successfully:
- Check the console for "✅ PostgreSQL connected successfully"
- Visit `http://localhost:5000/health` to verify the server is running
- Test your API endpoints at `/api/auth` and `/api/roles`

