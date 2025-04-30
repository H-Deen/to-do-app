import { TodoProvider } from "@/context/TodoContext";
import { Sidebar } from "@/components/SideBar";
import { TodoList } from "@/components/TodoList";

const Index = () => {
  return (
    <TodoProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <TodoList />
      </div>
    </TodoProvider>
  );
};

export default Index;
