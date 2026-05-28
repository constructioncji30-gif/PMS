This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


CREATE TABLE provider (
    -- Primary Key
    providerId INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Personal Information
    firstName NVARCHAR(100) NOT NULL DEFAULT '',
    lastName NVARCHAR(100) NOT NULL DEFAULT '',
    prefixTitle NVARCHAR(50) NOT NULL DEFAULT '',
    suffix NVARCHAR(50) NOT NULL DEFAULT '',
    dateOfBirth DATE NULL,
    gender NVARCHAR(20) NOT NULL DEFAULT '',  -- 'male', 'female', 'other'
    nationalProviderIdentifier NVARCHAR(20) NOT NULL DEFAULT '',  -- NPI
    licenseNumber NVARCHAR(100) NOT NULL DEFAULT '',
    
    -- Professional Information
    providerType NVARCHAR(50) NOT NULL DEFAULT '',  -- 'physician', 'nurse', 'technician', 'therapist', 'other'
    specialties NVARCHAR(MAX) NOT NULL DEFAULT '[]',  -- JSON array of specialties
    department NVARCHAR(200) NOT NULL DEFAULT '',
    status NVARCHAR(50) NOT NULL DEFAULT '',  -- 'active', 'inactive', 'suspended'
    
    -- Contact Information
    phoneNumber NVARCHAR(20) NOT NULL DEFAULT '',
    email NVARCHAR(200) NOT NULL DEFAULT '',
    addressLine1 NVARCHAR(200) NOT NULL DEFAULT '',
    addressLine2 NVARCHAR(200) NOT NULL DEFAULT '',
    city NVARCHAR(100) NOT NULL DEFAULT '',
    state NVARCHAR(50) NOT NULL DEFAULT '',
    zipCode NVARCHAR(20) NOT NULL DEFAULT '',
    country NVARCHAR(100) NOT NULL DEFAULT '',
    
    -- Work Information
    affiliatedPracticeHospital NVARCHAR(300) NOT NULL DEFAULT '',
    startTime TIME NULL,  -- Work shift start time
    endTime TIME NULL,    -- Work shift end time
    workingDays NVARCHAR(MAX) NOT NULL DEFAULT '[]',  -- JSON array: ['Mon', 'Tue', ...]
    
    -- Languages
    languagesSpoken NVARCHAR(MAX) NOT NULL DEFAULT '[]',  -- JSON array of languages
    
    -- Insurance Information
    insuranceProvider NVARCHAR(200) NOT NULL DEFAULT '',
    insurancePolicyNumber NVARCHAR(100) NOT NULL DEFAULT '',
    insuranceGroupNumber NVARCHAR(100) NOT NULL DEFAULT '',
    insurancePhone NVARCHAR(20) NOT NULL DEFAULT '',
    
    -- Additional Information
    notesComments NVARCHAR(MAX) NOT NULL DEFAULT '',
    
    -- Audit Fields
    createdDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    modifiedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    createdBy NVARCHAR(100) NULL,
    modifiedBy NVARCHAR(100) NULL
);

 


CREATE TABLE patient (
    -- Primary Key (add an identity column for unique patient IDs)
    patientId INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Basic Patient Information
    firstName NVARCHAR(100) NOT NULL DEFAULT '',
    middleName NVARCHAR(100) NOT NULL DEFAULT '',
    lastName NVARCHAR(100) NOT NULL DEFAULT '',
    prefixTitle NVARCHAR(50) NOT NULL DEFAULT '',
    suffix NVARCHAR(50) NOT NULL DEFAULT '',
    dob DATE NULL,  -- Date of birth (NULL allowed)
    sex NVARCHAR(20) NOT NULL DEFAULT '',
    ssn NVARCHAR(11) NOT NULL DEFAULT '',  -- Format: XXX-XX-XXXX
    previousName NVARCHAR(200) NOT NULL DEFAULT '',
    professionalSuffix NVARCHAR(50) NOT NULL DEFAULT '',
    status NVARCHAR(50) NOT NULL DEFAULT '',
    maritalStatus NVARCHAR(50) NOT NULL DEFAULT '',
    preferredLanguage NVARCHAR(50) NOT NULL DEFAULT '',
    interpreterRequired NVARCHAR(10) NOT NULL DEFAULT '',  -- 'Yes'/'No' or boolean
    biologicalSex NVARCHAR(20) NOT NULL DEFAULT '',
    
    -- Address Information
    address1 NVARCHAR(200) NOT NULL DEFAULT '',
    address2 NVARCHAR(200) NOT NULL DEFAULT '',
    city NVARCHAR(100) NOT NULL DEFAULT '',
    state NVARCHAR(50) NOT NULL DEFAULT '',
    zip NVARCHAR(20) NOT NULL DEFAULT '',
    country NVARCHAR(100) NOT NULL DEFAULT '',
    
    -- Contact Information
    homePhone NVARCHAR(20) NOT NULL DEFAULT '',
    primaryPhoneType NVARCHAR(50) NOT NULL DEFAULT '',
    cellPhone NVARCHAR(20) NOT NULL DEFAULT '',
    workPhone NVARCHAR(20) NOT NULL DEFAULT '',
    email NVARCHAR(200) NOT NULL DEFAULT '',
    
    -- Additional Information
    comments NVARCHAR(MAX) NOT NULL DEFAULT '',
    
    -- Emergency Contact
    emergencyContactNumber NVARCHAR(20) NOT NULL DEFAULT '',
    relationship NVARCHAR(100) NOT NULL DEFAULT '',
    emergencyEmail NVARCHAR(200) NOT NULL DEFAULT '',
    
    -- Alternate Patient Contact
    altPatientName NVARCHAR(200) NOT NULL DEFAULT '',
    altPatientPhone NVARCHAR(20) NOT NULL DEFAULT '',
    altPatientEmail NVARCHAR(200) NOT NULL DEFAULT '',
    altPatientAddress NVARCHAR(500) NOT NULL DEFAULT '',
    
    -- Race & Ethnicity (stored as JSON strings since arrays are not native)
    race NVARCHAR(MAX) NOT NULL DEFAULT '[]',  -- JSON array: ["Race1", "Race2"]
    ethnicity NVARCHAR(MAX) NOT NULL DEFAULT '[]',  -- JSON array: ["Ethnicity1", "Ethnicity2"]
    
    -- Insurance Information
    insuranceProvider NVARCHAR(200) NOT NULL DEFAULT '',
    insurancePolicyNumber NVARCHAR(100) NOT NULL DEFAULT '',
    insuranceGroupNumber NVARCHAR(100) NOT NULL DEFAULT '',
    insurancePhone NVARCHAR(20) NOT NULL DEFAULT '',
    insuranceAddress NVARCHAR(500) NOT NULL DEFAULT '',
    
    -- Family Information
    motherName NVARCHAR(200) NOT NULL DEFAULT '',
    motherPhone NVARCHAR(20) NOT NULL DEFAULT '',
    motherEmail NVARCHAR(200) NOT NULL DEFAULT '',
    motherAddress NVARCHAR(500) NOT NULL DEFAULT '',
    
    -- Physician Information
    referringPhysician NVARCHAR(200) NOT NULL DEFAULT '',
    primaryPhysician NVARCHAR(200) NOT NULL DEFAULT '',
    
    -- Payment Information
    paymentMethod NVARCHAR(100) NOT NULL DEFAULT '',
    
    -- Audit fields (recommended)
    createdDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    modifiedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    createdBy NVARCHAR(100) NULL,
    modifiedBy NVARCHAR(100) NULL
);

- 




CREATE TABLE practice (
    -- Primary Key
    practiceId INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Practice Information
    practiceName NVARCHAR(200) NOT NULL DEFAULT '',
    practiceIdentifier NVARCHAR(100) NOT NULL DEFAULT '',  -- Practice ID from form
    licenseNumber NVARCHAR(100) NOT NULL DEFAULT '',
    prefix NVARCHAR(50) NOT NULL DEFAULT '',
    suffix NVARCHAR(50) NOT NULL DEFAULT '',
    practiceType NVARCHAR(100) NOT NULL DEFAULT '',  -- From dropdown options
    interpreterRequired NVARCHAR(10) NOT NULL DEFAULT '',  -- 'Yes' or 'No'
    
    -- Address & Contact Information
    address1 NVARCHAR(200) NOT NULL DEFAULT '',
    address2 NVARCHAR(200) NOT NULL DEFAULT '',
    city NVARCHAR(100) NOT NULL DEFAULT '',
    state NVARCHAR(50) NOT NULL DEFAULT '',
    zip NVARCHAR(20) NOT NULL DEFAULT '',
    country NVARCHAR(100) NOT NULL DEFAULT '',
    phone NVARCHAR(20) NOT NULL DEFAULT '',
    fax NVARCHAR(20) NOT NULL DEFAULT '',
    email NVARCHAR(200) NOT NULL DEFAULT '',
    website NVARCHAR(300) NOT NULL DEFAULT '',
    
    -- Services & Departments (JSON array for multiple selections)
    servicesOffered NVARCHAR(MAX) NOT NULL DEFAULT '[]',  -- JSON array of services
    
    -- Operating Hours
    openingTime TIME NULL,
    closingTime TIME NULL,
    workingDays NVARCHAR(MAX) NOT NULL DEFAULT '[]',  -- JSON array of working days
    
    -- Insurance Information
    insuranceProvider NVARCHAR(200) NOT NULL DEFAULT '',
    insurancePolicyNumber NVARCHAR(100) NOT NULL DEFAULT '',
    insuranceGroupNumber NVARCHAR(100) NOT NULL DEFAULT '',
    insurancePhone NVARCHAR(20) NOT NULL DEFAULT '',
    insuranceAddress NVARCHAR(500) NOT NULL DEFAULT '',
    
    -- Administrator / Contact Person
    adminName NVARCHAR(200) NOT NULL DEFAULT '',
    adminPhone NVARCHAR(20) NOT NULL DEFAULT '',
    adminEmail NVARCHAR(200) NOT NULL DEFAULT '',
    adminRole NVARCHAR(100) NOT NULL DEFAULT '',
    
    -- Additional Information
    notes NVARCHAR(MAX) NOT NULL DEFAULT '',
    paymentMethod NVARCHAR(100) NOT NULL DEFAULT '',
    
    -- Status Field (recommended for active/inactive practices)
    isActive BIT NOT NULL DEFAULT 1,
    
    -- Audit Fields
    createdDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    modifiedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    createdBy NVARCHAR(100) NULL,
    modifiedBy NVARCHAR(100) NULL
);
 

CREATE TABLE [user] (
    -- Primary Key
    userId INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Basic User Information
    username NVARCHAR(100) NOT NULL UNIQUE,
    email NVARCHAR(200) NOT NULL UNIQUE,
    passwordHash NVARCHAR(255) NOT NULL,  -- Store hashed password, never plain text
    passwordSalt NVARCHAR(255) NULL,      -- For additional security
    
    -- Personal Information
    firstName NVARCHAR(100) NOT NULL DEFAULT '',
    lastName NVARCHAR(100) NOT NULL DEFAULT '',
    middleName NVARCHAR(100) NOT NULL DEFAULT '',
    prefixTitle NVARCHAR(50) NOT NULL DEFAULT '',
    suffix NVARCHAR(50) NOT NULL DEFAULT '',
    dateOfBirth DATE NULL,
    gender NVARCHAR(20) NOT NULL DEFAULT '',
    
    -- Contact Information
    phoneNumber NVARCHAR(20) NOT NULL DEFAULT '',
    cellPhone NVARCHAR(20) NOT NULL DEFAULT '',
    address1 NVARCHAR(200) NOT NULL DEFAULT '',
    address2 NVARCHAR(200) NOT NULL DEFAULT '',
    city NVARCHAR(100) NOT NULL DEFAULT '',
    state NVARCHAR(50) NOT NULL DEFAULT '',
    zip NVARCHAR(20) NOT NULL DEFAULT '',
    country NVARCHAR(100) NOT NULL DEFAULT '',
    
    -- Professional Information
    employeeId NVARCHAR(50) NULL,  -- Internal employee ID
    jobTitle NVARCHAR(100) NOT NULL DEFAULT '',
    department NVARCHAR(100) NOT NULL DEFAULT '',
    
    -- Role & Permissions
    role NVARCHAR(50) NOT NULL DEFAULT 'user',  -- 'admin', 'provider', 'nurse', 'receptionist', 'user'
    permissions NVARCHAR(MAX) NOT NULL DEFAULT '[]',  -- JSON array of custom permissions
    
    -- Account Status
    isActive BIT NOT NULL DEFAULT 1,
    isLocked BIT NOT NULL DEFAULT 0,
    isEmailVerified BIT NOT NULL DEFAULT 0,
    isPhoneVerified BIT NOT NULL DEFAULT 0,
    
    -- Authentication & Security
    lastLoginDate DATETIME2 NULL,
    lastLoginIP NVARCHAR(45) NULL,  -- Supports IPv4 and IPv6
    failedLoginAttempts INT NOT NULL DEFAULT 0,
    lastFailedLoginDate DATETIME2 NULL,
    accountLockoutEndDate DATETIME2 NULL,
    passwordLastChangedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    passwordExpiryDate DATETIME2 NULL,  -- For password expiration policy
    requiresPasswordReset BIT NOT NULL DEFAULT 0,
    
    -- Two-Factor Authentication (2FA)
    isTwoFactorEnabled BIT NOT NULL DEFAULT 0,
    twoFactorSecret NVARCHAR(255) NULL,  -- TOTP secret key
    
    -- Refresh Tokens (for JWT authentication)
    refreshToken NVARCHAR(255) NULL,
    refreshTokenExpiryDate DATETIME2 NULL,
    
    -- Relationships to other tables
    associatedProviderId INT NULL,  -- FK to provider table if user is a provider
    associatedPracticeId INT NULL,  -- FK to practice table
    
    -- Preferences
    languagePreference NVARCHAR(10) NOT NULL DEFAULT 'en',
    timezone NVARCHAR(100) NOT NULL DEFAULT 'UTC',
    dateFormat NVARCHAR(20) NOT NULL DEFAULT 'MM/DD/YYYY',
    notificationPreferences NVARCHAR(MAX) NOT NULL DEFAULT '[]',  -- JSON array
    
    -- Additional Information
    profileImageUrl NVARCHAR(500) NULL,
    notes NVARCHAR(MAX) NOT NULL DEFAULT '',
    
    -- Audit Fields
    createdDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    modifiedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    createdBy INT NULL,  -- userId who created this record
    modifiedBy INT NULL,  -- userId who last modified this record
    lastModifiedIP NVARCHAR(45) NULL,
    
    -- Foreign Keys (if referencing other tables)
    FOREIGN KEY (associatedProviderId) REFERENCES provider(providerId),
    FOREIGN KEY (associatedPracticeId) REFERENCES practice(practiceId)
);




CREATE TABLE appointment (
    -- Primary Key
    appointmentId INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Patient Information
    patientId INT NOT NULL,  -- FK to patient table
    patientName NVARCHAR(200) NOT NULL DEFAULT '',  -- Denormalized for quick display
    
    -- Location & Provider Information
    locationId NVARCHAR(100) NOT NULL DEFAULT '',  -- Location identifier
    locationName NVARCHAR(200) NOT NULL DEFAULT '',  -- Denormalized location name
    providerId INT NULL,  -- FK to provider table
    providerName NVARCHAR(200) NOT NULL DEFAULT '',  -- Denormalized provider name
    
    -- Appointment Date & Time
    appointmentDate DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NULL,  -- Calculated from startTime + duration
    duration INT NOT NULL DEFAULT 30,  -- Duration in minutes
    
    -- Appointment Status
    status NVARCHAR(50) NOT NULL DEFAULT 'pending',  -- 'pending', 'scheduled', 'completed', 'cancelled'
    
    -- Appointment Type
    appointmentType NVARCHAR(50) NOT NULL DEFAULT '',  -- 'office', 'tele'
    
    -- Additional Information
    visitReason NVARCHAR(500) NOT NULL DEFAULT '',
    comments NVARCHAR(MAX) NOT NULL DEFAULT '',
    
    -- Tracking Fields
    isRecurring BIT NOT NULL DEFAULT 0,
    recurringParentId INT NULL,  -- For recurring appointments, points to parent appointment
    recurrencePattern NVARCHAR(200) NULL,  -- JSON or text describing recurrence
    
    -- Notification & Reminder Settings
    reminderSent BIT NOT NULL DEFAULT 0,
    reminderSentDate DATETIME2 NULL,
    patientConfirmed BIT NOT NULL DEFAULT 0,
    patientConfirmedDate DATETIME2 NULL,
    
    -- Check-in/Check-out Times
    checkInTime DATETIME2 NULL,
    checkOutTime DATETIME2 NULL,
    actualStartTime DATETIME2 NULL,
    actualEndTime DATETIME2 NULL,
    
    -- Wait Time Tracking
    waitTimeMinutes INT NULL,  -- Time between check-in and actual start
    
    -- Cancellation Information
    cancelledDate DATETIME2 NULL,
    cancelledBy NVARCHAR(100) NULL,
    cancellationReason NVARCHAR(500) NULL,
    
    -- Billing Information
    isBilled BIT NOT NULL DEFAULT 0,
    billedAmount DECIMAL(10, 2) NULL,
    billingCode NVARCHAR(50) NULL,  -- CPT/ICD code
    insuranceClaimSubmitted BIT NOT NULL DEFAULT 0,
    
    -- Audit Fields
    createdDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    modifiedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    createdBy INT NULL,  -- User ID who created
    modifiedBy INT NULL,  -- User ID who last modified
    createdByIP NVARCHAR(45) NULL,
    
    -- Foreign Keys
    FOREIGN KEY (patientId) REFERENCES patient(patientId),
    FOREIGN KEY (providerId) REFERENCES provider(providerId),
    FOREIGN KEY (recurringParentId) REFERENCES appointment(appointmentId)
);

 

 CREATE TABLE location (
    -- Primary Key
    locationId INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Basic Location Information
    locationCode NVARCHAR(50) NOT NULL UNIQUE,  -- Short code like 'aspire', 'cityclinic'
    locationName NVARCHAR(200) NOT NULL,  -- Full name like 'Aspire Regenerative Wound Care'
    locationType NVARCHAR(50) NOT NULL DEFAULT '',  -- 'clinic', 'hospital', 'urgent_care', 'office'
    
    -- Description
    description NVARCHAR(500) NOT NULL DEFAULT '',
    
);

 