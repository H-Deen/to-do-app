import { useState } from "react";
// import { useTodo } from "@/context/TodoContext";
import { Plus, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTodo } from "@/context/TodoContext";

const ColorOptions = [
  { value: "#ef4444", label: "Red" },
  { value: "#f59e0b", label: "Orange" },
  { value: "#eab308", label: "Yellow" },
  { value: "#84cc16", label: "Green" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#ec4899", label: "Pink" },
];

export const Sidebar = () => {
  const {
    projects,
    tags,
    selectedProject,
    selectedTag,
    setSelectedProject,
    setSelectedTag,
    addProject,
    updateProject,
    deleteProject,
    addTag,
    updateTag,
    deleteTag,
  } = useTodo();

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");
  const [editingProject, setEditingProject] = useState<{ id: string; name: string } | null>(null);
  const [editingTag, setEditingTag] = useState<{ id: string; name: string; color: string } | null>(null);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(true);

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName("");
      setIsProjectDialogOpen(false);
    }
  };

  const handleUpdateProject = () => {
    if (editingProject && editingProject.name.trim()) {
      const project = projects.find((p) => p.id === editingProject.id);
      if (project) {
        updateProject({
          ...project,
          name: editingProject.name,
        });
      }
      setEditingProject(null);
      setIsProjectDialogOpen(false);
    }
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim(), newTagColor);
      setNewTagName("");
      setNewTagColor("#3b82f6");
      setIsTagDialogOpen(false);
    }
  };

  const handleUpdateTag = () => {
    if (editingTag && editingTag.name.trim()) {
      const tag = tags.find((t) => t.id === editingTag.id);
      if (tag) {
        updateTag({
          ...tag,
          name: editingTag.name,
          color: editingTag.color,
        });
      }
      setEditingTag(null);
      setIsTagDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen w-64 bg-secondary/50 border-r p-4 flex flex-col">
      <div className="text-xl font-semibold mb-6 text-primary">Minimalist Todo</div>

      {/* Projects Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setProjectsExpanded(!projectsExpanded)}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {projectsExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            <span className="ml-1">Projects</span>
          </button>
          <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingProject(null);
                  setNewProjectName("");
                }}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
              >
                <Plus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingProject ? "Edit Project" : "Add Project"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={editingProject ? editingProject.name : newProjectName}
                    onChange={(e) =>
                      editingProject
                        ? setEditingProject({ ...editingProject, name: e.target.value })
                        : setNewProjectName(e.target.value)
                    }
                    placeholder="Enter project name"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsProjectDialogOpen(false);
                      setEditingProject(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={editingProject ? handleUpdateProject : handleAddProject}>
                    {editingProject ? "Update" : "Add"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {projectsExpanded && (
          <div className="space-y-1 ml-1">
            <button
              className={`w-full text-left py-1 px-2 text-sm rounded-md transition-colors ${
                selectedProject === null
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-secondary"
              }`}
              onClick={() => setSelectedProject(null)}
            >
              All Projects
            </button>
            {projects.map((project) => (
              <div
                key={project.id}
                className="group flex items-center justify-between"
              >
                <button
                  className={`flex-1 text-left py-1 px-2 text-sm rounded-md transition-colors ${
                    selectedProject === project.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-secondary"
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  {project.name}
                </button>
                <div className="hidden group-hover:flex items-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      setEditingProject({ id: project.id, name: project.name });
                      setIsProjectDialogOpen(true);
                    }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => deleteProject(project.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setTagsExpanded(!tagsExpanded)}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {tagsExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            <span className="ml-1">Tags</span>
          </button>
          <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingTag(null);
                  setNewTagName("");
                  setNewTagColor("#3b82f6");
                }}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
              >
                <Plus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingTag ? "Edit Tag" : "Add Tag"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="tag-name">Tag Name</Label>
                  <Input
                    id="tag-name"
                    value={editingTag ? editingTag.name : newTagName}
                    onChange={(e) =>
                      editingTag
                        ? setEditingTag({ ...editingTag, name: e.target.value })
                        : setNewTagName(e.target.value)
                    }
                    placeholder="Enter tag name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tag-color">Tag Color</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ColorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`w-6 h-6 rounded-full ${
                          (editingTag ? editingTag.color : newTagColor) === color.value
                            ? "ring-2 ring-offset-2 ring-primary"
                            : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() =>
                          editingTag
                            ? setEditingTag({ ...editingTag, color: color.value })
                            : setNewTagColor(color.value)
                        }
                        aria-label={`Select ${color.label} color`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsTagDialogOpen(false);
                      setEditingTag(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={editingTag ? handleUpdateTag : handleAddTag}>
                    {editingTag ? "Update" : "Add"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {tagsExpanded && (
          <div className="space-y-1 ml-1">
            <button
              className={`w-full text-left py-1 px-2 text-sm rounded-md transition-colors ${
                selectedTag === null
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-secondary"
              }`}
              onClick={() => setSelectedTag(null)}
            >
              All Tags
            </button>
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="group flex items-center justify-between"
              >
                <button
                  className={`flex-1 flex items-center text-left py-1 px-2 text-sm rounded-md transition-colors ${
                    selectedTag === tag.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-secondary"
                  }`}
                  onClick={() => setSelectedTag(tag.id)}
                >
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: tag.color }}
                  ></span>
                  {tag.name}
                </button>
                <div className="hidden group-hover:flex items-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      setEditingTag({
                        id: tag.id,
                        name: tag.name,
                        color: tag.color,
                      });
                      setIsTagDialogOpen(true);
                    }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => deleteTag(tag.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
