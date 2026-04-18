import admin from "firebase-admin";

let db;

export const initializeFirebase = () => {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "{}");

    if (!serviceAccount.project_id) {
      console.error("FIREBASE_SERVICE_ACCOUNT_JSON is missing or invalid.");
      process.exit(1);
    }

    // dotenv stores \n as literal two-char sequences; convert them to real newlines
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();
    console.log(`Firebase connected: project ${serviceAccount.project_id}`);
  } catch (error) {
    console.error(`Firebase init error: ${error.message}`);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error("Firestore not initialized. Call initializeFirebase() first.");
  }
  return db;
};
