import { useState } from "react";
import { useTodo } from "@/context/TodoContext";
import { TodoItem, Project, Tag } from "@/types";
import { Plus, ChevronDown, ChevronRight, Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TodoModal } from "./TodoModal";

export const TodoList = () => {
  const {
    filteredTodos,
    projects,
    tags,
    selectedProject,
    toggleTodoCompleted,
    toggleProjectCollapsed,
    deleteTodo,
  } = useTodo();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

  // Group todos by project
  const todosByProject = projects.map((project) => {
    const projectTodos = filteredTodos.filter(
      (todo) => todo.projectId === project.id
    );
    return {
      project,
      todos: projectTodos,
    };
  });

  const findTag = (id: string) => {
    return tags.find((tag) => tag.id === id);
  };

  const handleEditTodo = (todo: TodoItem) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          {selectedProject
            ? projects.find((p) => p.id === selectedProject)?.name || "Tasks"
            : "All Tasks"}
        </h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Button
            onClick={() => {
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1"
          >
            <Plus size={16} />
            Add Task
          </Button>
          <TodoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            todo={editingTodo}
          />
        </Dialog>
      </div>

      {todosByProject.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      ) : (
        todosByProject.map(({ project, todos }) =>
          todos.length > 0 ? (
            <div key={project.id} className="mb-6">
              <div
                className="flex items-center mb-2 cursor-pointer"
                onClick={() => toggleProjectCollapsed(project.id)}
              >
                {project.collapsed ? (
                  <ChevronRight className="mr-1 text-muted-foreground" size={18} />
                ) : (
                  <ChevronDown className="mr-1 text-muted-foreground" size={18} />
                )}
                <h2 className="text-lg font-medium">{project.name}</h2>
              </div>
              
              {!project.collapsed && (
                <div className="space-y-2 ml-6">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`group p-3 border rounded-lg bg-background shadow-sm hover:shadow-md transition-all ${
                        todo.completed ? "todo-item-completed" : "todo-item"
                      }`}
                    >
                      <div className="flex items-start">
                        <button
                          onClick={() => toggleTodoCompleted(todo.id)}
                          className={`mt-1 mr-3 flex-shrink-0 w-5 h-5 rounded-full border ${
                            todo.completed
                              ? "bg-primary border-primary text-white flex items-center justify-center"
                              : "border-muted-foreground"
                          }`}
                        >
                          {todo.completed && <Check size={12} />}
                        </button>
                        <div className="flex-1">
                          <h3
                            className={`font-medium ${
                              todo.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p
                              className={`text-sm ${
                                todo.completed ? "line-through text-muted-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {todo.description}
                            </p>
                          )}
                          {todo.tagIds.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {todo.tagIds.map((tagId) => {
                                const tag = findTag(tagId);
                                if (!tag) return null;
                                return (
                                  <span
                                    key={tagId}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
                                    style={{
                                      backgroundColor: `${tag.color}20`,
                                      color: tag.color,
                                    }}
                                  >
                                    {tag.name}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEditTodo(todo)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => deleteTodo(todo.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null
        )
      )}

      {todosByProject.every(({ todos }) => todos.length === 0) && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No tasks found.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
          >
            Create your first task
          </Button>
        </div>
      )}

      {/* Remove this standalone TodoModal that was causing the error */}
    </div>
  );
};
