import { getDB } from "../lib/db.js";

const COLLECTION = "projects";

const projectsRef = () => getDB().collection(COLLECTION);

/**
 * Default structure for a new project document.
 */
const defaultProject = (overrides = {}) => ({
  owner: "",
  description: "",
  wokwiUrl: "",
  wokwiProjectPath: "",
  messages: [],
  ideaState: {
    summary: "",
    requirements: [],
    unknowns: [],
  },
  componentsMessages: [],
  componentsState: {
    architecture: "",
    components: [],
    apiEndpoints: [],
  },
  designMessages: [],
  designState: {
    screens: [],
    theme: "",
    uxFlow: [],
  },
  wokwiEvidence: {
    lastLint: null,
    lastRun: null,
    lastScenario: null,
    lastSerialCapture: null,
    updatedAt: null,
  },
  meta: {
    stage: "idea",
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Create a new project document.
 */
export const createProject = async (data) => {
  const doc = defaultProject(data);
  const docRef = await projectsRef().add(doc);
  return { _id: docRef.id, ...doc };
};

/**
 * Find a project by its Firestore document ID.
 */
export const findProjectById = async (projectId) => {
  const doc = await projectsRef().doc(projectId).get();
  if (!doc.exists) return null;
  return { _id: doc.id, ...doc.data() };
};

/**
 * Find all projects belonging to a user, sorted by createdAt descending.
 */
export const findProjectsByOwner = async (ownerId) => {
  const snapshot = await projectsRef()
    .where("owner", "==", ownerId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
};

/**
 * Find a recent project with the same owner + description (for dedup).
 */
export const findRecentDuplicate = async (ownerId, description, withinMs = 60000) => {
  const cutoff = new Date(Date.now() - withinMs);
  const snapshot = await projectsRef()
    .where("owner", "==", ownerId)
    .where("description", "==", description)
    .where("createdAt", ">=", cutoff)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { _id: doc.id, ...doc.data() };
};

/**
 * Update a project document (partial merge).
 */
export const updateProject = async (projectId, data) => {
  const ref = projectsRef().doc(projectId);
  await ref.update({ ...data, updatedAt: new Date() });

  const updated = await ref.get();
  return { _id: updated.id, ...updated.data() };
};

/**
 * Save a full project object back to Firestore.
 * Strips _id so it isn't stored as a field.
 */
export const saveProject = async (project) => {
  const { _id, ...data } = project;
  data.updatedAt = new Date();
  await projectsRef().doc(_id).set(data, { merge: true });
  return project;
};

/**
 * Delete a project document.
 */
export const deleteProject = async (projectId) => {
  await projectsRef().doc(projectId).delete();
};

export default {
  createProject,
  findProjectById,
  findProjectsByOwner,
  findRecentDuplicate,
  updateProject,
  saveProject,
  deleteProject,
};