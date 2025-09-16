import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormInputs, addPitSchema } from "../types/index";
import { pitApi } from "../api/pitApi";
import { toast } from "react-toastify";

export const useAddPitForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<FormInputs>({
    resolver: zodResolver(addPitSchema),
    defaultValues: {
      year: "",
      month: "",
      city: "",
      street: "",
      author: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => pitApi.addPit(formData),
    onSuccess: (data) => {
      console.log("Mutacja dodania otworu zakończona sukcesem:", data);
      toast.success("Otwór został pomyślnie dodany");
      queryClient.invalidateQueries({ queryKey: ["pits"] });
      router.push("/documents");
    },
    onError: (error: Error) => {
      console.error("Błąd mutacji dodawania otworu:", error);
      toast.error(error.message || "Błąd podczas dodawania otworu");
    },
  });

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    control,
    mutation,
  };
};
