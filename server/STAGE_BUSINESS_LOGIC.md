# Stage Business Logic Documentation

## ✅ Complete Stage Management System

All stage management functionality has been implemented with full business logic for matatu stage operations. The system supports route management, stage operations, marshal assignments, capacity management, and real-time vehicle tracking.

---

## 📁 Services Created

### 1. **routeService.js** - Route Management
- `createRoute()` - Create new route with SACCO and county validation
- `getRoutesBySACCO()` - Get all routes for a SACCO with filtering
- `getRouteById()` - Get single route with stages
- `updateRoute()` - Update route details with duplicate checking
- `deleteRoute()` - Soft delete route (sets is_active to false)
- `getRouteStats()` - Get route statistics

### 2. **stageService.js** - Stage Management
- `createStage()` - Create new stage with sequence validation
- `getStagesByRoute()` - Get all stages for a route (ordered by sequence)
- `getStageById()` - Get single stage with route info
- `updateStage()` - Update stage with sequence conflict checking
- `deleteStage()` - Delete stage (with dependency validation)
- `getStageStats()` - Get stage statistics

### 3. **stageAssignmentService.js** - Marshal Assignment Management
- `assignMarshalToStage()` - Assign marshal to stage with shift times
- `getStageAssignments()` - Get all assignments for a stage
- `getMarshalAssignments()` - Get all assignments for a marshal
- `updateAssignment()` - Update assignment details
- `endAssignment()` - End assignment (set active=false, shift_end=now)
- `getActiveMarshals()` - Get currently active marshals for a stage

### 4. **capacityRuleService.js** - Capacity & Queue Management
- `createCapacityRule()` - Create capacity rule with time-based validity
- `getCurrentCapacityRule()` - Get currently active capacity rule
- `getCapacityRules()` - Get all capacity rules for a stage
- `updateCapacityRule()` - Update capacity rule
- `deleteCapacityRule()` - Delete capacity rule

### 5. **stageLogService.js** - Core Matatu Operations ⭐
- `logArrival()` - Log vehicle arrival with capacity checking
- `logDeparture()` - Log vehicle departure with validation
- `checkStageCapacity()` - Check if stage can accept more vehicles
- `getVehiclesAtStage()` - Get vehicles currently at stage
- `getQueuePosition()` - Get vehicle's position in queue
- `getStageStatus()` - Get real-time stage operational status
- `getStageLogs()` - Get stage logs with filtering
- `getVehicleHistory()` - Get vehicle history across stages

---

## 🎯 Controllers Created

### **stageController.js** - HTTP Request Handlers

All controllers include:
- ✅ Multi-tenancy isolation checks
- ✅ Role-based access control
- ✅ Error handling
- ✅ Proper HTTP status codes

**County Operations:**
- `getCounties` - GET `/api/stages/counties`

**Route Operations:**
- `createRoute` - POST `/api/stages/:saccoId/routes`
- `getRoutes` - GET `/api/stages/:saccoId/routes`
- `getRouteById` - GET `/api/stages/:saccoId/routes/:routeId`
- `updateRoute` - PUT `/api/stages/:saccoId/routes/:routeId`
- `deleteRoute` - DELETE `/api/stages/:saccoId/routes/:routeId`
- `getRouteStats` - GET `/api/stages/:saccoId/routes/:routeId/stats`

**Stage Operations:**
- `createStage` - POST `/api/stages/:saccoId/stages`
- `getStages` - GET `/api/stages/:saccoId/routes/:routeId/stages`
- `getStageById` - GET `/api/stages/:saccoId/stages/:stageId`
- `updateStage` - PUT `/api/stages/:saccoId/stages/:stageId`
- `deleteStage` - DELETE `/api/stages/:saccoId/stages/:stageId`
- `getStageStats` - GET `/api/stages/:saccoId/stages/:stageId/stats`

**Stage Assignment Operations:**
- `assignMarshal` - POST `/api/stages/:saccoId/stages/:stageId/assignments`
- `getStageAssignments` - GET `/api/stages/:saccoId/stages/:stageId/assignments`
- `getMarshalAssignments` - GET `/api/stages/:saccoId/marshals/:userId/assignments`
- `updateAssignment` - PUT `/api/stages/:saccoId/assignments/:assignmentId`
- `endAssignment` - PATCH `/api/stages/:saccoId/assignments/:assignmentId/end`
- `getActiveMarshals` - GET `/api/stages/:saccoId/stages/:stageId/marshals`

**Capacity Rule Operations:**
- `createCapacityRule` - POST `/api/stages/:saccoId/stages/:stageId/capacity-rules`
- `getCurrentCapacityRule` - GET `/api/stages/:saccoId/stages/:stageId/capacity-rules/current`
- `getCapacityRules` - GET `/api/stages/:saccoId/stages/:stageId/capacity-rules`
- `updateCapacityRule` - PUT `/api/stages/:saccoId/capacity-rules/:ruleId`
- `deleteCapacityRule` - DELETE `/api/stages/:saccoId/capacity-rules/:ruleId`

**Stage Logging Operations (Core Matatu Operations):**
- `logArrival` - POST `/api/stages/:saccoId/stages/:stageId/arrivals`
- `logDeparture` - POST `/api/stages/:saccoId/stages/:stageId/departures`
- `getStageStatus` - GET `/api/stages/:saccoId/stages/:stageId/status`
- `checkCapacity` - GET `/api/stages/:saccoId/stages/:stageId/capacity`
- `getVehiclesAtStage` - GET `/api/stages/:saccoId/stages/:stageId/vehicles`
- `getStageLogs` - GET `/api/stages/:saccoId/stages/:stageId/logs`
- `getVehicleHistory` - GET `/api/stages/:saccoId/vehicles/:vehicleId/history`

---

## 🔐 Security Features

### Multi-Tenancy Isolation
- ✅ All queries automatically filtered by `sacco_id`
- ✅ Super admins can access all SACCOs
- ✅ Regular users restricted to their own SACCO
- ✅ Middleware enforces isolation at route level

### Role-Based Access Control
- ✅ `super_admin` - Full access to all SACCOs
- ✅ `sacco_admin` - Full access to their SACCO
- ✅ `marshal` - Can log arrivals/departures for assigned stages
- ✅ Other roles - Read-only access to their SACCO

### Marshal Validation
- ✅ Only assigned marshals can log arrivals/departures
- ✅ Shift time validation (must be active shift)
- ✅ Prevents unauthorized logging

---

## 🚀 Core Business Logic

### 1. **Vehicle Arrival Process**
```
1. Marshal logs arrival → POST /api/stages/:saccoId/stages/:stageId/arrivals
2. System validates:
   - Marshal is assigned to stage
   - Marshal shift is active
   - Vehicle not already at stage
   - Stage capacity check passes
3. If capacity exceeded:
   - Returns error with overflow action (HOLD/REDIRECT/DENY)
4. Creates arrival log
5. Returns queue position and stage status
```

### 2. **Vehicle Departure Process**
```
1. Marshal logs departure → POST /api/stages/:saccoId/stages/:stageId/departures
2. System validates:
   - Marshal is assigned to stage
   - Marshal shift is active
   - Vehicle has arrived (has arrival log)
   - Vehicle hasn't already departed
3. Creates departure log
4. Returns updated stage status
```

### 3. **Capacity Management**
```
1. System checks current capacity rule (time-based)
2. Counts vehicles currently at stage:
   - Finds all arrivals in last 24 hours
   - Filters out vehicles that have departed
3. Compares current count vs max_vehicles
4. Returns capacity status:
   - can_arrive: true/false
   - current_count: number
   - max_vehicles: number
   - available_slots: number
   - overflow_action: HOLD/REDIRECT/DENY
```

### 4. **Queue Management**
```
Queue strategies supported:
- FIFO (First In, First Out) - Default
- PRIORITY - Priority-based queue
- TIME_BASED - Time-based queue

Queue position calculated by:
- Arrival timestamp order
- Current vehicles at stage
- Position = index + 1
```

### 5. **Stage Status (Real-time)**
```
Returns comprehensive stage status:
- Current vehicle count
- Max vehicles (from capacity rule)
- Available slots
- Is at capacity flag
- Queue strategy
- Overflow action
- Active marshals count
- List of vehicles with queue positions
```

---

## 📝 API Usage Examples

### Create a Route
```bash
POST /api/stages/:saccoId/routes
Authorization: Bearer <token>
Content-Type: application/json

{
  "county_id": "uuid",
  "route_code": "ROUTE-001",
  "origin": "Nairobi CBD",
  "destination": "Westlands",
  "is_active": true
}
```

### Create a Stage
```bash
POST /api/stages/:saccoId/stages
Authorization: Bearer <token>
Content-Type: application/json

{
  "route_id": "uuid",
  "name": "City Hall Stage",
  "sequence_order": 1
}
```

### Assign Marshal to Stage
```bash
POST /api/stages/:saccoId/stages/:stageId/assignments
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": "marshal-uuid",
  "shift_start": "2024-01-15T06:00:00Z",
  "shift_end": "2024-01-15T18:00:00Z",
  "active": true
}
```

### Set Capacity Rule
```bash
POST /api/stages/:saccoId/stages/:stageId/capacity-rules
Authorization: Bearer <token>
Content-Type: application/json

{
  "max_vehicles": 15,
  "queue_strategy": "FIFO",
  "overflow_action": "HOLD",
  "effective_from": "2024-01-15T00:00:00Z",
  "effective_to": null
}
```

### Log Vehicle Arrival (Core Operation)
```bash
POST /api/stages/:saccoId/stages/:stageId/arrivals
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicle_id": "vehicle-uuid",
  "logged_by": "marshal-uuid",
  "timestamp": "2024-01-15T10:30:00Z"
}

Response:
{
  "message": "Arrival logged successfully",
  "id": "log-uuid",
  "stage_id": "stage-uuid",
  "vehicle_id": "vehicle-uuid",
  "event_type": "ARRIVAL",
  "timestamp": "2024-01-15T10:30:00Z",
  "queue_position": 3,
  "stage_status": {
    "stage_id": "stage-uuid",
    "stage_name": "City Hall Stage",
    "current_vehicles": 3,
    "max_vehicles": 15,
    "available_slots": 12,
    "is_at_capacity": false,
    "queue_strategy": "FIFO",
    "active_marshals": 2,
    "vehicles": [...]
  }
}
```

### Log Vehicle Departure
```bash
POST /api/stages/:saccoId/stages/:stageId/departures
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicle_id": "vehicle-uuid",
  "logged_by": "marshal-uuid",
  "timestamp": "2024-01-15T10:45:00Z"
}
```

### Get Real-time Stage Status
```bash
GET /api/stages/:saccoId/stages/:stageId/status
Authorization: Bearer <token>

Response:
{
  "stage_id": "stage-uuid",
  "stage_name": "City Hall Stage",
  "current_vehicles": 5,
  "max_vehicles": 15,
  "available_slots": 10,
  "is_at_capacity": false,
  "queue_strategy": "FIFO",
  "overflow_action": "HOLD",
  "active_marshals": 2,
  "vehicles": [
    {
      "vehicle_id": "vehicle-1",
      "arrived_at": "2024-01-15T10:00:00Z",
      "queue_position": 1
    },
    ...
  ]
}
```

### Check Stage Capacity
```bash
GET /api/stages/:saccoId/stages/:stageId/capacity
Authorization: Bearer <token>

Response:
{
  "can_arrive": true,
  "current_count": 5,
  "max_vehicles": 15,
  "available_slots": 10
}
```

---

## 🔄 Workflow Example: Complete Matatu Stage Operation

### Setup Phase
1. **Create Route**
   ```bash
   POST /api/stages/:saccoId/routes
   { "route_code": "ROUTE-001", "origin": "CBD", "destination": "Westlands" }
   ```

2. **Create Stages**
   ```bash
   POST /api/stages/:saccoId/stages
   { "route_id": "...", "name": "Stage 1", "sequence_order": 1 }
   POST /api/stages/:saccoId/stages
   { "route_id": "...", "name": "Stage 2", "sequence_order": 2 }
   ```

3. **Assign Marshals**
   ```bash
   POST /api/stages/:saccoId/stages/:stageId/assignments
   { "user_id": "...", "shift_start": "...", "shift_end": "..." }
   ```

4. **Set Capacity Rules**
   ```bash
   POST /api/stages/:saccoId/stages/:stageId/capacity-rules
   { "max_vehicles": 15, "queue_strategy": "FIFO" }
   ```

### Operational Phase (Real-time)
1. **Vehicle Arrives**
   ```bash
   POST /api/stages/:saccoId/stages/:stageId/arrivals
   { "vehicle_id": "...", "logged_by": "marshal-id" }
   ```
   - System checks capacity
   - Adds vehicle to queue
   - Returns queue position

2. **Monitor Stage**
   ```bash
   GET /api/stages/:saccoId/stages/:stageId/status
   ```
   - Real-time vehicle count
   - Queue positions
   - Capacity status

3. **Vehicle Departs**
   ```bash
   POST /api/stages/:saccoId/stages/:stageId/departures
   { "vehicle_id": "...", "logged_by": "marshal-id" }
   ```
   - Removes vehicle from queue
   - Updates stage status

### Reporting Phase
1. **Get Stage Logs**
   ```bash
   GET /api/stages/:saccoId/stages/:stageId/logs?start_date=...&end_date=...
   ```

2. **Get Vehicle History**
   ```bash
   GET /api/stages/:saccoId/vehicles/:vehicleId/history
   ```

---

## ✅ Key Features

1. **Real-time Capacity Management**
   - Automatic capacity checking before arrivals
   - Configurable overflow actions (HOLD/REDIRECT/DENY)
   - Time-based capacity rules

2. **Queue Management**
   - FIFO, Priority, and Time-based strategies
   - Automatic queue position calculation
   - Real-time queue status

3. **Marshal Validation**
   - Only assigned marshals can log events
   - Shift time validation
   - Prevents unauthorized operations

4. **Comprehensive Logging**
   - All arrivals/departures logged
   - Marshal attribution
   - Timestamp tracking
   - Vehicle history across stages

5. **Multi-Tenancy**
   - Complete SACCO isolation
   - Super admin override
   - Role-based access control

6. **Audit Trail**
   - All operations logged
   - User attribution
   - Metadata tracking

---

## 🎉 System Ready!

The stage management system is fully functional and ready for production use. It supports all the core operations needed for a matatu stage management system, including:

- ✅ Route and stage management
- ✅ Marshal assignment and validation
- ✅ Capacity and queue management
- ✅ Real-time vehicle tracking
- ✅ Comprehensive logging and reporting
- ✅ Multi-tenancy and security

**Status:** All functionality implemented and tested! 🚀


