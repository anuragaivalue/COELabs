import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";

/**
 * Resolves the GCP service account JSON key file path across relative, absolute,
 * and Windows backslash formats.
 */
function resolveKeyFilePath(rawPath) {
  if (!rawPath) {
    // Default fallback to credentials/ folder in project
    const defaultInCreds = path.resolve(
      process.cwd(),
      "credentials",
      "ivalue-coe-web-022a2c183393 (1).json"
    );
    if (fs.existsSync(defaultInCreds)) return defaultInCreds;
    return null;
  }

  let clean = rawPath.trim().replace(/^["']|["']$/g, "").replace(/\\/g, "/");

  // Check direct existence
  if (fs.existsSync(clean)) return clean;

  // Check relative to project root
  const fromCwd = path.resolve(process.cwd(), clean);
  if (fs.existsSync(fromCwd)) return fromCwd;

  // Check inside credentials/ directory
  const base = path.basename(clean);
  const inCredsDir = path.resolve(process.cwd(), "credentials", base);
  if (fs.existsSync(inCredsDir)) return inCredsDir;

  return null;
}

/**
 * Initialize Google Cloud Storage client with credentials from the service account JSON key file.
 */
function getStorageClient() {
  const keyPath = resolveKeyFilePath(process.env.GCP_KEY_FILE);

  // 1. Primary: Load credentials directly from service account JSON file
  if (keyPath) {
    try {
      const fileData = JSON.parse(fs.readFileSync(keyPath, "utf8"));
      return new Storage({
        projectId: fileData.project_id || process.env.GCP_PROJECT_ID,
        credentials: {
          client_email: fileData.client_email,
          private_key: fileData.private_key,
        },
      });
    } catch (err) {
      console.error("Error reading GCP service account JSON file:", err.message);
    }
  }

  // 2. Secondary: Load from individual environment variables
  const projectId = process.env.GCP_PROJECT_ID;
  const clientEmail = process.env.GCP_CLIENT_EMAIL;
  let privateKey = process.env.GCP_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  if (clientEmail && privateKey) {
    return new Storage({
      projectId: projectId || undefined,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
  }

  // 3. Fallback to default
  return new Storage({
    projectId: projectId || undefined,
  });
}

/**
 * Generic upload of any asset (playbook, document, screenshot, video) to GCP Cloud Storage.
 *
 * @param {Buffer} fileBuffer - Binary buffer of the uploaded file
 * @param {string} originalFilename - Original filename
 * @param {string} folder - Target folder in bucket (e.g. "playbooks", "resources", "steps", "videos")
 * @param {string} mimeType - MIME type
 * @returns {Promise<{ success: boolean, filename: string, fullGcsPath: string, publicUrl: string, storage: string }>}
 */
export async function uploadFileToGCS(fileBuffer, originalFilename, folder = "public", mimeType = "application/octet-stream") {
  const bucketName = process.env.GCP_STORAGE_BUCKET || "test-coe-portal";
  const publicBaseUrl =
    process.env.NEXT_PUBLIC_GCP_STORAGE_BASE_URL?.replace(/\/oem\/?$/, "") ||
    `https://storage.googleapis.com/${bucketName}`;

  const ext = path.extname(originalFilename || "").toLowerCase();
  const baseName = path
    .basename(originalFilename || "file", ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 60);

  const timestamp = Date.now().toString(36);
  const targetFilename = `${baseName}_${timestamp}${ext}`;
  const gcsPath = folder ? `${folder}/${targetFilename}` : targetFilename;

  const client = getStorageClient();
  if (!client) {
    throw new Error(
      "GCP Storage client initialization failed. Please verify GCP_KEY_FILE path in .env."
    );
  }

  try {
    const bucket = client.bucket(bucketName);
    const file = bucket.file(gcsPath);

    await file.save(fileBuffer, {
      contentType: mimeType || "application/octet-stream",
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
      resumable: false,
    });

    return {
      success: true,
      filename: targetFilename,
      fullGcsPath: gcsPath,
      publicUrl: `${publicBaseUrl}/${gcsPath}`,
      storage: "gcs",
    };
  } catch (gcsError) {
    console.error("GCP Cloud Storage Upload Error:", gcsError);
    throw new Error(`Google Cloud Storage upload to '${gcsPath}' failed: ${gcsError.message}`);
  }
}

/**
 * Upload an OEM logo image directly to the GCP Cloud Storage bucket.
 * Stores the file under the specified folder (e.g. oem/{filename}) and returns
 * the exact clean filename to be persisted in MySQL database.
 *
 * @param {Buffer} fileBuffer - Binary buffer of the uploaded file
 * @param {string} originalFilename - Original filename uploaded by the user
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<{ success: boolean, filename: string, fullGcsPath: string, publicUrl: string, storage: string }>}
 */
export async function uploadOemLogoToGCS(fileBuffer, originalFilename, mimeType = "image/png") {
  const bucketName = process.env.GCP_STORAGE_BUCKET || "test-coe-portal";
  const oemFolder = process.env.GCP_STORAGE_OEM_FOLDER || "oem";
  const publicBaseUrl =
    process.env.NEXT_PUBLIC_GCP_STORAGE_BASE_URL ||
    `https://storage.googleapis.com/${bucketName}/${oemFolder}`;

  // Sanitize filename: e.g. "Cisco Systems Logo.svg" -> "cisco_systems_logo_173254.svg"
  const ext = path.extname(originalFilename || ".png").toLowerCase();
  const baseName = path
    .basename(originalFilename || "oem_logo", ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 50);

  const timestamp = Date.now().toString(36);
  const targetFilename = `${baseName}_${timestamp}${ext || ".png"}`;
  const gcsPath = oemFolder ? `${oemFolder}/${targetFilename}` : targetFilename;

  const client = getStorageClient();
  if (!client) {
    throw new Error(
      "GCP Storage client initialization failed. Please verify GCP_KEY_FILE path in .env."
    );
  }

  try {
    const bucket = client.bucket(bucketName);
    const file = bucket.file(gcsPath);

    // Save directly to Google Cloud Storage bucket
    await file.save(fileBuffer, {
      contentType: mimeType || "application/octet-stream",
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
      resumable: false,
    });

    return {
      success: true,
      filename: targetFilename,
      fullGcsPath: gcsPath,
      publicUrl: `${publicBaseUrl}/${targetFilename}`,
      storage: "gcs",
    };
  } catch (gcsError) {
    console.error("GCP Cloud Storage Upload Error:", gcsError);
    throw new Error(`Google Cloud Storage upload to bucket '${bucketName}' failed: ${gcsError.message}`);
  }
}

/**
 * Resolves a stored OEM logo string into its full public URL.
 * Matches: https://storage.googleapis.com/test-coe-portal/oem/{filename}
 *
 * @param {string} logo - The filename stored in the database
 * @returns {string|null}
 */
export function resolveOemLogoUrl(logo) {
  if (!logo) return null;
  if (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("/")) {
    return logo;
  }
  const baseUrl =
    process.env.NEXT_PUBLIC_GCP_STORAGE_BASE_URL ||
    "https://storage.googleapis.com/test-coe-portal/oem";
  return `${baseUrl.replace(/\/+$/, "")}/${logo.replace(/^\/+/, "")}`;
}
