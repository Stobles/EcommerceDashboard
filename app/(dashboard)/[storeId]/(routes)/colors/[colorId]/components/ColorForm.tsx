"use client";

import axios, { AxiosError } from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import { Color } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

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
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useMutation } from "react-query";
import { ColorRequest, ColorValidator } from "@/lib/validators/color";

interface ColorFormProps {
  initialData: Color | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const { loginToast } = useCustomToast();

  const title = initialData ? "Редактировать цвет" : "Создать цвет";
  const description = initialData ? "Изменить цвет." : "Добавить новый цвет.";
  const toastMessage = initialData ? "Цвет изменен." : "Цвет создан.";
  const action = initialData ? "Сохранить." : "Создать.";

  const form = useForm<ColorRequest>({
    defaultValues: initialData || {
      name: "",
    },
    resolver: zodResolver(ColorValidator),
  });

  const { isLoading: isChangeLoading, mutate: onSubmit } = useMutation({
    mutationFn: async ({ name, value }: ColorRequest) => {
      const payload: ColorRequest = { name, value };
      const { data } = initialData
        ? await axios.patch(
            `/api/${params.storeId}/colors/${params.colorId}`,
            payload
          )
        : await axios.post(`/api/${params.storeId}/colors`, payload);
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
            title: "Вы не можете добавить цвет.",
            variant: "destructive",
          });
          return;
        }
      }
      toast({
        description: "Непредвиденная ошибка. Попробуйте еще раз.",
        title: "Ошибка.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: toastMessage,
      });
      router.push(`/${params.storeId}/colors`);
      router.refresh();
    },
  });

  const { isLoading: isDeleteLoading, mutate: onDelete } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/colors/${params.colorId}`
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          toast({
            description: "Введен неверный id.",
            title: "Неправильный id.",
            variant: "destructive",
          });
          return;
        }

        if (err.response?.status === 401) {
          loginToast();
          return;
        }

        if (err.response?.status === 405) {
          toast({
            title: "Вы не можете удалить этот размер.",
            variant: "destructive",
          });
          return;
        }
        toast({
          description:
            "Убедитесь, что вы удалили все товары, которые используют этот размер.",
          title: "Произошла ошибка",
          variant: "destructive",
        });
        return;
      }
    },
    onSuccess: () => {
      toast({
        title: "Цвет был успешно удален",
      });
      router.push(`/${params.storeId}/colors`);
      router.refresh();
      setOpen(false);
    },
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isLoading={isChangeLoading || isDeleteLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isChangeLoading || isDeleteLoading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((e) => onSubmit(e))}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isChangeLoading || isDeleteLoading}
                      placeholder="Название цвета"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Значение</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isChangeLoading || isDeleteLoading}
                      placeholder="Hex-код"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isChangeLoading || isDeleteLoading}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
