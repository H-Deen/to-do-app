import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TodoItem, Project, Tag } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface TodoContextType {
  todos: TodoItem[];
  projects: Project[];
  tags: Tag[];
  selectedProject: string | null;
  selectedTag: string | null;
  setSelectedProject: (id: string | null) => void;
  setSelectedTag: (id: string | null) => void;
  addTodo: (todo: Omit<TodoItem, "id" | "createdAt">) => void;
  updateTodo: (todo: TodoItem) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompleted: (id: string) => void;
  addProject: (name: string) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  toggleProjectCollapsed: (id: string) => void;
  addTag: (name: string, color: string) => void;
  updateTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;
  filteredTodos: TodoItem[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const SAMPLE_PROJECTS: Project[] = [
  { id: "1", name: "Work", collapsed: false },
  { id: "2", name: "Personal", collapsed: false },
];

const SAMPLE_TAGS: Tag[] = [
  { id: "1", name: "Urgent", color: "#ef4444" },
  { id: "2", name: "Important", color: "#f59e0b" },
  { id: "3", name: "Later", color: "#3b82f6" },
];

const SAMPLE_TODOS: TodoItem[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Finish the Q3 project proposal for client review",
    completed: false,
    projectId: "1",
    tagIds: ["1"],
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Schedule team meeting",
    description: "Set up weekly sync with design and development teams",
    completed: false,
    projectId: "1",
    tagIds: ["2"],
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Grocery shopping",
    description: "Buy ingredients for dinner",
    completed: true,
    projectId: "2",
    tagIds: ["3"],
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "Plan weekend trip",
    description: "Research destinations and accommodations",
    completed: false,
    projectId: "2",
    tagIds: ["2", "3"],
    createdAt: new Date(),
  },
];

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : SAMPLE_TODOS;
  });
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : SAMPLE_PROJECTS;
  });
  
  const [tags, setTags] = useState<Tag[]>(() => {
    const savedTags = localStorage.getItem("tags");
    return savedTags ? JSON.parse(savedTags) : SAMPLE_TAGS;
  });
  
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  // Filter todos based on selected project and/or tag
  const filteredTodos = todos.filter((todo) => {
    const projectMatch = !selectedProject || todo.projectId === selectedProject;
    const tagMatch = !selectedTag || todo.tagIds.includes(selectedTag);
    return projectMatch && tagMatch;
  });

  const addTodo = (todo: Omit<TodoItem, "id" | "createdAt">) => {
    const newTodo: TodoItem = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    toast({
      title: "Todo added",
      description: `"${newTodo.title}" has been added to your list.`,
    });
  };

  const updateTodo = (todo: TodoItem) => {
    setTodos((prevTodos) =>
      prevTodos.map((t) => (t.id === todo.id ? todo : t))
    );
    toast({
      title: "Todo updated",
      description: `"${todo.title}" has been updated.`,
    });
  };

  const deleteTodo = (id: string) => {
    const todoToDelete = todos.find((todo) => todo.id === id);
    if (todoToDelete) {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      toast({
        title: "Todo deleted",
        description: `"${todoToDelete.title}" has been deleted.`,
        variant: "destructive",
      });
    }
  };

  const toggleTodoCompleted = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const addProject = (name: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      collapsed: false,
    };
    setProjects((prevProjects) => [...prevProjects, newProject]);
    toast({
      title: "Project added",
      description: `"${name}" project has been created.`,
    });
  };

  const updateProject = (project: Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === project.id ? project : p))
    );
    toast({
      title: "Project updated",
      description: `"${project.name}" has been updated.`,
    });
  };

  const deleteProject = (id: string) => {
    const projectToDelete = projects.find((project) => project.id === id);
    if (projectToDelete) {
      // Delete associated todos
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.projectId !== id));
      
      // Delete the project
      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
      
      // Reset selected project if it was deleted
      if (selectedProject === id) {
        setSelectedProject(null);
      }
      
      toast({
        title: "Project deleted",
        description: `"${projectToDelete.name}" and all its todos have been deleted.`,
        variant: "destructive",
      });
    }
  };

  const toggleProjectCollapsed = (id: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === id
          ? { ...project, collapsed: !project.collapsed }
          : project
      )
    );
  };

  const addTag = (name: string, color: string) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name,
      color,
    };
    setTags((prevTags) => [...prevTags, newTag]);
    toast({
      title: "Tag added",
      description: `"${name}" tag has been created.`,
    });
  };

  const updateTag = (tag: Tag) => {
    setTags((prevTags) => prevTags.map((t) => (t.id === tag.id ? tag : t)));
    toast({
      title: "Tag updated",
      description: `"${tag.name}" has been updated.`,
    });
  };

  const deleteTag = (id: string) => {
    const tagToDelete = tags.find((tag) => tag.id === id);
    if (tagToDelete) {
      // Remove tag from todos
      setTodos((prevTodos) =>
        prevTodos.map((todo) => ({
          ...todo,
          tagIds: todo.tagIds.filter((tagId) => tagId !== id),
        }))
      );
      
      // Delete the tag
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
      
      // Reset selected tag if it was deleted
      if (selectedTag === id) {
        setSelectedTag(null);
      }
      
      toast({
        title: "Tag deleted",
        description: `"${tagToDelete.name}" tag has been deleted.`,
        variant: "destructive",
      });
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        projects,
        tags,
        selectedProject,
        selectedTag,
        setSelectedProject,
        setSelectedTag,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodoCompleted,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectCollapsed,
        addTag,
        updateTag,
        deleteTag,
        filteredTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};
