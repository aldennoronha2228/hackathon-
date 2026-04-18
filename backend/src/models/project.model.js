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
 * Sorts in-memory to avoid requiring a composite Firestore index.
 */
export const findProjectsByOwner = async (ownerId) => {
  const snapshot = await projectsRef()
    .where("owner", "==", ownerId)
    .get();

  return snapshot.docs
    .map((doc) => ({ _id: doc.id, ...doc.data() }))
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? new Date(a.createdAt).getTime();
      const bTime = b.createdAt?.toMillis?.() ?? new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
};

/**
 * Find a recent project with the same owner + description (for dedup).
 * Filters description and createdAt in-memory to avoid composite index requirement.
 */
export const findRecentDuplicate = async (ownerId, description, withinMs = 60000) => {
  const cutoff = Date.now() - withinMs;

  // Only filter by owner in Firestore — no composite index needed
  const snapshot = await projectsRef()
    .where("owner", "==", ownerId)
    .get();

  if (snapshot.empty) return null;

  const match = snapshot.docs
    .map((doc) => ({ _id: doc.id, ...doc.data() }))
    .filter((p) => {
      const docTime = p.createdAt?.toMillis?.() ?? new Date(p.createdAt).getTime();
      return p.description === description && docTime >= cutoff;
    })
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? new Date(a.createdAt).getTime();
      const bTime = b.createdAt?.toMillis?.() ?? new Date(b.createdAt).getTime();
      return bTime - aTime;
    })[0];

  return match ?? null;
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