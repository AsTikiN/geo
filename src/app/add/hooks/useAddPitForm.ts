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
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => pitApi.addPit(formData),
    onSuccess: () => {
      router.push("/documents");
      queryClient.invalidateQueries({ queryKey: ["pits"] });
      toast.success("Площадка успешно добавлена");
      // router.refresh();
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
