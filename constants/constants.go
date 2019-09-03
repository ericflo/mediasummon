package constants

import "time"

// DefaultAdminPath is the default path to the admin
const DefaultAdminPath = "admin"

// DefaultServiceName is the default service name for commands to use when none is specified
const DefaultServiceName = "all"

// DefaultDurationBetweenSyncChecks is the default time to use when checking whether to
// sync or not (this is not how often to Sync, just how often to check whether to sync)
const DefaultDurationBetweenSyncChecks = time.Duration(time.Second * 5)

// DefaultNumFetchers is the default number of http fetchers to run per service
const DefaultNumFetchers = 6

// DefaultWebPort is the default port for the web service
const DefaultWebPort = "5000"

// MaxAllowablePages is the maximum allowable number of pages that a user can request
const MaxAllowablePages = 1000000

// DefaultUserConfigPath is the default path to the config json
const DefaultUserConfigPath = "mediasummon.config.json"

// DefaultHoursPerSync is the default number of hours between syncing each searvice
const DefaultHoursPerSync = 24.0

// UserRoleStandard is a role for the user that means they have standard access
const UserRoleStandard = "standard"

// UserRoleAdmin is a role for the user that means they have administrative access
const UserRoleAdmin = "admin"

// DefaultUserRole is the default user role
const DefaultUserRole = UserRoleAdmin
