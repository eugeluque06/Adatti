import { useQuery } from "@tanstack/react-query";
import { getCategoriesV3 } from "../services/categories";

export function useCategorias() {
  const response = useQuery({
    queryKey: ["categories"],
    staleTime: 2_000, // 5 segundos
    queryFn: function () {
      return getCategoriesV3("Bebidas");
    },
  });

  return response;
}
