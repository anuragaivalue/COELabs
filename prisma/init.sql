-- ==============================================================================
-- iValue CoE SQLite Database Initialization
-- Database: dev.db
-- ==============================================================================

PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------------------------
-- 1. Contact Inquiries Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "ContactInquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "workEmail" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT,
    "interestArea" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "ContactInquiry_workEmail_idx" ON "ContactInquiry"("workEmail");
CREATE INDEX IF NOT EXISTS "ContactInquiry_status_idx" ON "ContactInquiry"("status");

-- ------------------------------------------------------------------------------
-- 2. Partner Applications Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "PartnerApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "partnerTier" TEXT NOT NULL DEFAULT 'standard',
    "contactName" TEXT NOT NULL,
    "workEmail" TEXT NOT NULL,
    "phone" TEXT,
    "region" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "PartnerApplication_workEmail_idx" ON "PartnerApplication"("workEmail");
CREATE INDEX IF NOT EXISTS "PartnerApplication_status_idx" ON "PartnerApplication"("status");

-- ------------------------------------------------------------------------------
-- 3. Partner Handshakes Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "PartnerHandshake" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partnerId" TEXT NOT NULL,
    "handshakeKey" TEXT NOT NULL UNIQUE,
    "verifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PartnerHandshake_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "PartnerApplication" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "PartnerHandshake_partnerId_idx" ON "PartnerHandshake"("partnerId");
CREATE UNIQUE INDEX IF NOT EXISTS "PartnerHandshake_handshakeKey_key" ON "PartnerHandshake"("handshakeKey");

-- ------------------------------------------------------------------------------
-- 4. Userlist & Authentication Tables
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "userlist" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'google',
    "profileImage" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "accessTillDate" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT UNIQUE,
    "email_verified" DATETIME,
    "image" TEXT,
    "role" TEXT DEFAULT 'user',
    "provider" TEXT DEFAULT 'google',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");
CREATE INDEX IF NOT EXISTS "accounts_user_id_idx" ON "accounts"("user_id");

CREATE TABLE IF NOT EXISTS "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_token" TEXT NOT NULL UNIQUE,
    "user_id" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "sessions_user_id_idx" ON "sessions"("user_id");

CREATE TABLE IF NOT EXISTS "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expires" DATETIME NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- ------------------------------------------------------------------------------
-- 5. Content & OEM Platform Tables
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "oem" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "oemName" TEXT NOT NULL,
    "logo" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "content" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "idKey" TEXT NOT NULL,
    "oem" TEXT NOT NULL,
    "oemImage" TEXT NOT NULL,
    "head" TEXT NOT NULL,
    "headDetails" TEXT NOT NULL,
    "overView" TEXT NOT NULL,
    "howToAccess" TEXT NOT NULL,
    "supportContent" TEXT NOT NULL,
    "accessSteps" TEXT,
    "accessCredentials" TEXT,
    "comingSoon" TEXT NOT NULL DEFAULT 'No',
    "contentStatus" TEXT NOT NULL DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS "category" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "subCategory" TEXT NOT NULL,
    "subCategoryFull" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "contentcategory" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "contentID" TEXT NOT NULL,
    "contentIdKey" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "contentplaybooks" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "contentID" TEXT NOT NULL,
    "contentIdKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "contentresources" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "contentID" TEXT NOT NULL,
    "contentIdKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "cdnvideos" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "contentID" TEXT NOT NULL,
    "contentIdKey" TEXT NOT NULL,
    "cdnUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "videoName" TEXT NOT NULL,
    "videoDescription" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "ytvideos" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "contentID" TEXT NOT NULL,
    "contentIdKey" TEXT NOT NULL,
    "ytCode" TEXT NOT NULL,
    "ytType" TEXT DEFAULT 'single'
);

CREATE TABLE IF NOT EXISTS "approvedrequest" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "requesteduserlistEmail" TEXT NOT NULL,
    "contentID" TEXT NOT NULL,
    "contentIdKey" TEXT NOT NULL,
    "orchestrationID" TEXT NOT NULL,
    "orchestrationVMGroupName" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "requesteduserlist" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "contentID" TEXT NOT NULL,
    "contentIdKey" TEXT NOT NULL,
    "requestedDate" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "userAccessKeys" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "otpTime" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "adminComment" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "rssfeeds" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "oem" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "head" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "product_access" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,
    "accessStatus" TEXT NOT NULL DEFAULT 'active',
    "grantedBy" INTEGER,
    "grantedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" DATETIME,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "product_access_unique_user_content" ON "product_access"("userId", "contentId");
CREATE INDEX IF NOT EXISTS "product_access_idx_accessStatus" ON "product_access"("accessStatus");
CREATE INDEX IF NOT EXISTS "product_access_idx_contentId" ON "product_access"("contentId");
CREATE INDEX IF NOT EXISTS "product_access_idx_userId" ON "product_access"("userId");

CREATE TABLE IF NOT EXISTS "user_content_access" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,
    "idKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "grantedBy" INTEGER NOT NULL,
    "grantedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "user_content_access_unique_user_content" ON "user_content_access"("userId", "contentId");
CREATE INDEX IF NOT EXISTS "user_content_access_idx_contentId" ON "user_content_access"("contentId");
CREATE INDEX IF NOT EXISTS "user_content_access_idx_idKey" ON "user_content_access"("idKey");
CREATE INDEX IF NOT EXISTS "user_content_access_idx_status" ON "user_content_access"("status");
CREATE INDEX IF NOT EXISTS "user_content_access_idx_userId" ON "user_content_access"("userId");
