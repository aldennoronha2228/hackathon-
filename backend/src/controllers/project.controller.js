import {
  createProject as createProjectDoc,
  findProjectById,
  findProjectsByOwner,
  updateProject as updateProjectDoc,
  deleteProject as deleteProjectDoc,
  saveProject,
} from "../models/project.model.js";
import { processInput } from "../services/ai.services.js";

const isIdeaFinalized = (project) => {
  return Boolean(project?.ideaState?.summary?.trim()) && (project?.ideaState?.unknowns?.length ?? 0) === 0;
};

/*
CREATE PROJECT
*/
export const createProject = async (req, res) => {
  try {
    const { description } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const project = await createProjectDoc({
      description,
      owner: req.user._id,
      messages: [{ role: "user", content: description }],
      ideaState: {
        summary: "",
        requirements: [],
        unknowns: [],
      },
      meta: { stage: "idea" },
    });

    const ai = await processInput(project, description);

    project.ideaState = {
      summary: ai.summary,
      requirements: ai.requirements,
      unknowns: ai.unknowns,
    };

    project.meta.stage = isIdeaFinalized(project) ? "components" : "idea";

    project.messages.push({
      role: "ai",
      content: ai.question,
    });

    await saveProject(project);

    res.json({
      projectId: project._id,
      reply: ai.question,
      ideaState: project.ideaState,
    });
  } catch (err) {
    console.error("PROJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const projects = await findProjectsByOwner(req.user._id);
    res.json(projects);
  } catch (err) {
    console.error("GET PROJECTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await findProjectById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.owner !== req.user._id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(project);
  } catch (err) {
    console.error("GET PROJECT BY ID ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getIdeationHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await findProjectById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.owner !== req.user._id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ messages: project.messages || [] });
  } catch (err) {
    console.error("GET IDEATION HISTORY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getComponentsHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await findProjectById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.owner !== req.user._id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ messages: project.componentsMessages || [] });
  } catch (err) {
    console.error("GET COMPONENTS HISTORY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, wokwiUrl, wokwiProjectPath } = req.body;

    const project = await findProjectById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.owner !== req.user._id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const hasDescription = typeof description === "string";
    const hasWokwiUrl = typeof wokwiUrl === "string";
    const hasWokwiProjectPath = typeof wokwiProjectPath === "string";

    if (!hasDescription && !hasWokwiUrl && !hasWokwiProjectPath) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const updates = {};

    if (hasDescription) {
      const nextDescription = description.trim();
      if (!nextDescription) {
        return res.status(400).json({ error: "Description cannot be empty" });
      }
      updates.description = nextDescription;
    }

    if (hasWokwiUrl) {
      const nextWokwiUrl = wokwiUrl.trim();

      if (nextWokwiUrl && !/^https:\/\/wokwi\.com\/projects\/\d+/i.test(nextWokwiUrl)) {
        return res.status(400).json({ error: "Invalid Wokwi project URL" });
      }

      updates.wokwiUrl = nextWokwiUrl;
    }

    if (hasWokwiProjectPath) {
      updates.wokwiProjectPath = wokwiProjectPath.trim();
    }

    const updated = await updateProjectDoc(id, updates);
    res.json(updated);
  } catch (err) {
    console.error("UPDATE PROJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await findProjectById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.owner !== req.user._id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await deleteProjectDoc(id);

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/*
CHAT LOOP
*/
export const chatProject = async (req, res) => {
  try {
    const { projectId, message } = req.body;

    const project = await findProjectById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.owner !== req.user._id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    project.messages.push({
      role: "user",
      content: message,
    });

    const ai = await processInput(project, message);

    project.ideaState = {
      summary: ai.summary,
      requirements: ai.requirements,
      unknowns: ai.unknowns,
    };

    project.meta.stage = isIdeaFinalized(project) ? "components" : "idea";

    project.messages.push({
      role: "ai",
      content: ai.question,
    });

    await saveProject(project);

    res.json({
      reply: ai.question,
      ideaState: project.ideaState,
    });
  } catch (err) {
    console.error("PROJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};