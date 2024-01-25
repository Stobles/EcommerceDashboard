"use client";

import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Separator } from "@/components/ui/Separator";
import { Heading } from "@/components/ui/Heading";
import { AlertModal } from "@/components/modals/Alert-modal";
import { useMutation } from "react-query";
import { toast } from "@/hooks/use-toast";
import {
  BillboardRequest,
  BillboardValidator,
} from "@/lib/validators/billboard";
import ImageUpload from "@/components/ui/ImageUpload";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface BillboardFormProps {
  initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Редактировать билборд" : "Создать билборд";
  const description = initialData
    ? "Отредактируйте существующий билборд"
    : "Добавьте новый билдорд";
  const toastMessage = initialData
    ? "Билборд был изменен"
    : "Билборд был создан";
  const action = initialData ? "Сохранить изменения" : "Создать";

  const form = useForm<BillboardRequest>({
    resolver: zodResolver(BillboardValidator),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const { mutate: onSubmit, isLoading: isChangeLoading } = useMutation({
    mutationFn: async ({ label, imageUrl }: BillboardRequest) => {
      const payload: BillboardRequest = { label, imageUrl };
      const { data } = initialData
        ? await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, payload)
        : await axios.post(`/api/${params.storeId}/billboards`, payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          loginToast();
          return;
        }

        if (err.response?.status === 405) {
          toast({
            title: "Вы не можете удалить этот билборд.",
            variant: "destructive",
          });
          return;
        }
      }
      toast({
        title: "Ошибка.",
        description: "Непредвиденная ошибка. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: toastMessage,
      });
      router.push(`/${params.storeId}/billboards`);
      router.refresh();
    },
  });

  const { mutate: deleteStore, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          toast({
            title: "Неправильный id.",
            description: "Введен неверный id билборда.",
            variant: "destructive",
          });
          return;
        }

        if (err.response?.status === 401) {
          loginToast();
          return;
        }

        if(err.response?.status === 405) {
          toast({
            title: "Вы не можете удалить этот билборд.",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Произошла ошибка",
          description: "Убедитесь, что вы удалили все категории, которые используют этот билборд.",
          variant: "destructive",
        });
        return;
      }
    },
    onSuccess: () => {
      toast({
        title: "Билборд был успешно удален",
      });
      router.push(`/${params.storeId}/billboards`);
      router.refresh();
    },
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteStore}
        isLoading={isChangeLoading || isDeleteLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData ? (
          <Button
            disabled={isChangeLoading || isDeleteLoading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((e) => onSubmit(e))}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Фоновое изображение</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isChangeLoading || isDeleteLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isChangeLoading || isDeleteLoading}
                      placeholder="Название билборда"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            isLoading={isChangeLoading || isDeleteLoading}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
