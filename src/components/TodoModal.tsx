'use client'

import { useState, useEffect } from "react";
import { useTodo } from "@/context/TodoContext";
import { TodoItem } from "@/types";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: TodoItem | null;
}

export const TodoModal = ({ isOpen, onClose, todo }: TodoModalProps) => {
  const { projects, tags, addTodo, updateTodo, selectedProject } = useTodo();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || "");
      setProjectId(todo.projectId);
      setSelectedTags(todo.tagIds);
    } else {
      setTitle("");
      setDescription("");
      setProjectId(selectedProject || (projects[0]?.id || ""));
      setSelectedTags([]);
    }
  }, [todo, selectedProject, projects]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    if (todo) {
      updateTodo({
        ...todo,
        title,
        description: description.trim() ? description : undefined,
        projectId,
        tagIds: selectedTags,
      });
    } else {
      addTodo({
        title,
        description: description.trim() ? description : undefined,
        projectId,
        tagIds: selectedTags,
        completed: false,
      });
    }
    
    onClose();
  };
  
  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  // Only render the DialogContent if the modal is open
  if (!isOpen) return null;
  
  return (
    <DialogContent className="sm:max-w-md modal-animation">
      <DialogHeader>
        <DialogTitle>{todo ? "Edit Task" : "Add New Task"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
            autoFocus
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this task"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="project">Project</Label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className={`flex items-center space-x-2 p-2 rounded-md border ${
                  selectedTags.includes(tag.id)
                    ? "border-primary bg-primary/10"
                    : "border-border"
                }`}
              >
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.id)}
                  onCheckedChange={() => handleTagToggle(tag.id)}
                />
                <label
                  htmlFor={`tag-${tag.id}`}
                  className="flex items-center text-sm cursor-pointer"
                >
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: tag.color }}
                  ></span>
                  {tag.name}
                </label>
              </div>
            ))}
            
            {tags.length === 0 && (
              <p className="text-sm text-muted-foreground">No tags available.</p>
            )}
          </div>
        </div>
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{todo ? "Update" : "Add"} Task</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
