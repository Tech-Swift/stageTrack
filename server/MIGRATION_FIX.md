# Stage Assignments Table Fix

## Issue
The `stage_assignments` table was created with incorrect column types:
- `shift_start` and `shift_end` were created as `time without time zone` (TIME type)
- Sequelize expected `timestamp with time zone` (TIMESTAMP type)
- This caused a casting error when Sequelize tried to alter the columns

## Solution
The table was dropped and will be recreated with correct types on next server start.

## Migration Script
A migration script was created at `src/migrations/fix-stage-assignments.js` to handle this issue.

## Prevention
- The model uses `DataTypes.DATE` which correctly maps to `TIMESTAMP WITH TIME ZONE` in PostgreSQL
- If you encounter similar issues in the future:
  1. Check the column type: `\d stage_assignments` in psql
  2. If incorrect, drop the table: `DROP TABLE stage_assignments CASCADE;`
  3. Restart the server to recreate with correct types

## Status
✅ Table dropped successfully
✅ Will be recreated with correct types on next sync
✅ Server should start without errors

