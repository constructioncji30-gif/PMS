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

-- Create indexes for frequently queried columns
CREATE INDEX IX_provider_lastName ON provider(lastName);
CREATE INDEX IX_provider_npi ON provider(nationalProviderIdentifier);
CREATE INDEX IX_provider_licenseNumber ON provider(licenseNumber);
CREATE INDEX IX_provider_status ON provider(status);
CREATE INDEX IX_provider_providerType ON provider(providerType);
CREATE INDEX IX_provider_department ON provider(department);
CREATE INDEX IX_provider_email ON provider(email);
CREATE INDEX IX_provider_affiliatedPractice ON provider(affiliatedPracticeHospital);
CREATE INDEX IX_provider_dateOfBirth ON provider(dateOfBirth);

-- Trigger to automatically update modifiedDate
CREATE TRIGGER trg_provider_modifiedDate
ON provider
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE provider
    SET modifiedDate = GETDATE()
    FROM provider p
    INNER JOIN inserted i ON p.providerId = i.providerId;
END;



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

-- Create indexes for frequently queried columns
CREATE INDEX IX_patient_lastName ON patient(lastName);
CREATE INDEX IX_patient_dob ON patient(dob);
CREATE INDEX IX_patient_ssn ON patient(ssn);
CREATE INDEX IX_patient_status ON patient(status);
CREATE INDEX IX_patient_insurancePolicyNumber ON patient(insurancePolicyNumber);
CREATE INDEX IX_patient_primaryPhysician ON patient(primaryPhysician);








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

-- Create indexes for frequently queried columns
CREATE INDEX IX_practice_practiceName ON practice(practiceName);
CREATE INDEX IX_practice_practiceIdentifier ON practice(practiceIdentifier);
CREATE INDEX IX_practice_licenseNumber ON practice(licenseNumber);
CREATE INDEX IX_practice_practiceType ON practice(practiceType);
CREATE INDEX IX_practice_city ON practice(city);
CREATE INDEX IX_practice_state ON practice(state);
CREATE INDEX IX_practice_zip ON practice(zip);
CREATE INDEX IX_practice_phone ON practice(phone);
CREATE INDEX IX_practice_email ON practice(email);
CREATE INDEX IX_practice_isActive ON practice(isActive);
CREATE INDEX IX_practice_adminName ON practice(adminName);
CREATE INDEX IX_practice_adminEmail ON practice(adminEmail);

-- Trigger to automatically update modifiedDate
CREATE TRIGGER trg_practice_modifiedDate
ON practice
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE practice
    SET modifiedDate = GETDATE()
    FROM practice p
    INNER JOIN inserted i ON p.practiceId = i.practiceId;
END;