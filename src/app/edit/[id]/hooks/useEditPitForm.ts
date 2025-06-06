import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editPitSchema, FormInputs } from "../types";
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
      router.push("/");
      queryClient.invalidateQueries({ queryKey: ["pits"] });
      toast.success("Площадка успешно обновлена");
      // router.refresh();
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
