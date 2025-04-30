export interface TodoItem {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    projectId: string;
    tagIds: string[];
    createdAt: Date;
  }
  
  export interface Project {
    id: string;
    name: string;
    collapsed: boolean;
  }
  
  export interface Tag {
    id: string;
    name: string;
    color: string;
  }