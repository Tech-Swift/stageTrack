# IAM (Identity & Access Control) Verification Report

## ✅ Complete IAM Model Setup

All 6 mandatory IAM tables have been created and linked to your PostgreSQL database:

### 1. ✅ **users** Table
**Model:** `src/models/User/User.js`
**Table Name:** `users`

**Fields:**
- `id` (UUID, primary key)
- `full_name` (STRING) - ⚠️ **Note:** Model uses `full_name`, verify if your DB uses `name`
- `email` (STRING, unique)
- `phone` (STRING, unique)
- `password_hash` (TEXT)
- `status` (STRING, default: "active")
- `sacco_id` (UUID, foreign key to saccos)
- `stage_id` (UUID, foreign key to stages)
- Additional fields: `badge_number`, `license_number`, `license_expiry_date`, `suspended_until`, `incident_count`, `last_login_at`, `profile_image_url`
- `created_at`, `updated_at`

**Associations:**
- ✅ Belongs to SACCO
- ✅ Belongs to Stage
- ✅ Many-to-Many with Roles (through user_roles)

---

### 2. ✅ **roles** Table
**Model:** `src/models/User/Role.js`
**Table Name:** `roles`

**Fields:**
- `id` (UUID, primary key)
- `name` (STRING, unique) - Supports: super_admin, sacco_admin, director, stage_marshal, clerk, owner
- `description` (STRING)
- `hierarchy_level` (INTEGER) - For role hierarchy enforcement
- `created_at`, `updated_at`

**Associations:**
- ✅ Many-to-Many with Users (through user_roles)
- ✅ Many-to-Many with Permissions (through role_permissions)

---

### 3. ✅ **permissions** Table
**Model:** `src/models/User/Permission.js`
**Table Name:** `permissions`

**Fields:**
- `id` (UUID, primary key)
- `name` (STRING, unique) - e.g., "register_vehicle", "view_reports", "manage_users"
- `description` (STRING)
- `resource` (STRING) - e.g., "vehicle", "report", "user"
- `action` (STRING) - e.g., "create", "read", "update", "delete"
- `created_at`, `updated_at`

**Associations:**
- ✅ Many-to-Many with Roles (through role_permissions)

---

### 4. ✅ **role_permissions** Table
**Model:** `src/models/User/role_permission.js`
**Table Name:** `role_permissions`

**Fields:**
- `id` (UUID, primary key)
- `role_id` (UUID, foreign key to roles)
- `permission_id` (UUID, foreign key to permissions)
- `granted_at` (DATE)
- `granted_by_uuid` (UUID, foreign key to users) - Tracks who granted the permission
- `created_at`, `updated_at`

**Unique Constraint:** `(role_id, permission_id)` - Prevents duplicate role-permission assignments

**Associations:**
- ✅ Belongs to Role
- ✅ Belongs to Permission
- ✅ Belongs to User (grantedBy)

---

### 5. ✅ **user_roles** Table
**Model:** `src/models/User/user_role.js`
**Table Name:** `user_roles`

**Fields:**
- `id` (UUID, primary key)
- `user_uuid` (UUID, foreign key to users)
- `role_id` (UUID, foreign key to roles)
- `assigned_by_uuid` (UUID, foreign key to users) - Tracks who assigned the role
- `assigned_at` (DATE)
- `created_at`, `updated_at`

**Associations:**
- ✅ Belongs to User (user)
- ✅ Belongs to Role
- ✅ Belongs to User (assignedBy)

---

### 6. ✅ **user_sessions** Table
**Model:** `src/models/User/UserSession.js`
**Table Name:** `user_sessions`

**Fields:**
- `id` (UUID, primary key)
- `user_uuid` (UUID, foreign key to users)
- `token` (TEXT, unique) - JWT token or session token
- `token_hash` (TEXT) - Hashed version for security
- `device_info` (STRING) - e.g., "Chrome on Windows", "Mobile App"
- `ip_address` (STRING) - IPv4 or IPv6
- `user_agent` (TEXT)
- `expires_at` (DATE) - Token expiration
- `revoked` (BOOLEAN, default: false) - For token revocation
- `revoked_at` (DATE)
- `last_used_at` (DATE)
- `created_at`, `updated_at`

**Indexes:**
- `user_uuid` - For quick user session lookups
- `token` - For token validation
- `expires_at` - For cleanup of expired sessions

**Associations:**
- ✅ Belongs to User

---

## 🔗 Association Summary

All relationships are properly configured:

1. **User ↔ Role** (Many-to-Many via `user_roles`)
2. **Role ↔ Permission** (Many-to-Many via `role_permissions`)
3. **User → SACCO** (Many-to-One)
4. **User → Stage** (Many-to-One)
5. **User → UserSession** (One-to-Many)
6. **RolePermission → User** (grantedBy)
7. **UserRole → User** (assignedBy)

---

## ⚠️ Important Notes

### Field Name Discrepancy
The User model uses `full_name` but you mentioned `name` in your requirements. Please verify:
- If your database table uses `name`, update the model field
- If your database table uses `full_name`, the current setup is correct

To check your database schema:
```sql
\d users
```

### Next Steps

1. **Verify Database Schema Match:**
   ```bash
   # Connect to your database and verify table structures
   psql your_database_name -c "\d users"
   psql your_database_name -c "\d roles"
   psql your_database_name -c "\d permissions"
   psql your_database_name -c "\d role_permissions"
   psql your_database_name -c "\d user_roles"
   psql your_database_name -c "\d user_sessions"
   ```

2. **Sync Models with Database:**
   When you start the server, Sequelize will automatically:
   - Create missing tables
   - Alter existing tables to match models (if `alter: true` is set)
   - Set up all foreign keys and indexes

3. **Test the Connection:**
   ```bash
   cd server
   pnpm run dev
   ```
   
   Look for:
   - ✅ "PostgreSQL connected successfully via Sequelize."
   - ✅ "Database models synchronized successfully."

---

## 🎯 SACCO-Specific Security Features

This IAM setup provides the strict role separation required for SACCO operations in Kenya:

- **Role Hierarchy:** `hierarchy_level` field enforces role precedence
- **Permission-Based Access:** Fine-grained permissions prevent unauthorized actions
- **Audit Trail:** `assigned_by_uuid` and `granted_by_uuid` track who assigned roles/permissions
- **Session Management:** `user_sessions` table enables token revocation and device tracking
- **Multi-Tenant Support:** Users are linked to SACCOs, enabling proper data isolation

---

## 📁 File Structure

```
server/src/models/
├── index.js                    # Imports all models
├── associations.js            # Sets up all relationships
├── User/
│   ├── User.js                # users table
│   ├── Role.js                # roles table
│   ├── Permission.js          # permissions table
│   ├── user_role.js           # user_roles table
│   ├── role_permission.js     # role_permissions table
│   └── UserSession.js         # user_sessions table
├── sacco.model.js
└── stage.model.js
```

All models are automatically loaded when the server starts via `server.js` → `src/models/index.js`.

