import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editPitSchema, FormInputs } from "../types/index";
import { pitApi } from "../api/pitApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useEditPitForm = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: pit, isLoading } = useQuery({
    queryKey: ["pit", id],
    queryFn: () => pitApi.getPit(id),
  });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => pitApi.editPit(id, formData),
    onSuccess: () => {
      router.push("/documents");
      queryClient.invalidateQueries({ queryKey: ["pits"] });
      toast.success("Площадка успешно обновлена");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ошибка при обновлении площадки");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<FormInputs>({
    resolver: zodResolver(editPitSchema),
    defaultValues: {
      year: "",
      month: "",
      street: "",
    },
  });

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    control,
    mutation,
    isLoading,
    pit,
  };
};
