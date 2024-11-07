import { useEffect, useState } from "react";
import { LogOut, MonitorPlay, Plus } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import ManageMovieModal from "@/components/ManageMovieModal";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { logout } from "@/services/auth";
import { useUserContext } from "@/contexts/userContext";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

export default function AppLayout() {
  const [open, setOpen] = useState(false);

  const { logout: contextLogout, user } = useUserContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  async function handleLogout() {
    await logout();
    contextLogout();
    navigate("/");
  }

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;

          if (status === 401) {
            toast({
              title: "Atenção",
              description: "Por favor, faça login.",
            });
            navigate("/", { replace: true });
          }
        }
        return Promise.reject(error);
      }
    );

    if (!user) {
      navigate("/", { replace: true });
    }

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4 bg-gray-900">
        <div className="container mx-auto flex justify-between items-center">
          <MonitorPlay className="w-8 h-8 lg:w-12 lg:h-12 text-white" />

          <nav className="flex items-center gap-6">
            <ManageMovieModal open={open} setOpen={setOpen}>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Novo filme
              </Button>
            </ManageMovieModal>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center">
                  <Button
                    onClick={async () => handleLogout()}
                    variant="ghost"
                    size="ghost"
                  >
                    <LogOut className="w-8 h-8 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 border-gray-500">
                  <p className="text-white">Sair</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
