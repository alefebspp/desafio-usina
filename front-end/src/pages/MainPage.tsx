import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, MonitorPlay, Film } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import SignInModal from "@/components/SignInModal";
import RegisterModal from "@/components/RegisterModal";
import { useUserContext } from "@/contexts/userContext";

export default function MainPage() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const atAuthenticatedPages = pathname.includes("home");

    if (user) {
      if (!atAuthenticatedPages) {
        navigate(`/home`);
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex justify-between items-center p-4 absolute top-0 left-0 right-0 z-50">
        <MonitorPlay className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
        <SignInModal>
          <Button className="bg-red-600 px-4 py-2 rounded">Entrar</Button>
        </SignInModal>
      </header>

      <main>
        <section className="relative h-screen flex items-center justify-center text-center">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black bg-opacity-60" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-3xl mx-auto px-4"
          >
            <h1 className="text-5xl font-bold mb-4">
              Descubra, compartilhe e opine sobre filmes
            </h1>
            <p className="text-2xl mb-8">Gratuito. Para sempre.</p>
            <RegisterModal>
              <Button className="px-8 py-4 text-xl rounded">Começar</Button>
            </RegisterModal>
          </motion.div>
        </section>

        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Receba recomendações</h2>
              <p className="text-xl">
                Baseado em suas avaliações, receba recomendações de filmes
                semelhantes
              </p>
            </motion.div>
            <div className="flex justify-center">
              <Film className="text-white w-12 h-12" />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Perguntas frequentes
            </h2>
            <div className="max-w-3xl mx-auto">
              <FAQ question="Como funciona?">
                Cadastra-se e descubra os filmes que os usuários estão
                publicando e falando sobre. Você também pode deixar avaliações
                nos filme publicados. Publique um filme você também!
              </FAQ>
              <FAQ question="Quanto o serviço custa?">
                Não custa nada e sempre será assim.
              </FAQ>
              <FAQ question="Como funciona as recomendações de filmes?">
                Deixei avaliações nos filmes e nosso algoritmo irá buscar
                gêneros semelhantes ao seu gosto.
              </FAQ>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-black text-gray-500 text-center">
        <p>&copy; 2024 Biblioteca de filmes. Todos direitos reservados.</p>
      </footer>
    </div>
  );
}

function FAQ({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-4 bg-gray-800 text-left"
      >
        <span>{question}</span>
        <ChevronDown
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 p-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
