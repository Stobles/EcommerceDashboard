"use client";

import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Billboard, Category } from "@prisma/client";
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
import { CategoryRequest, CategoryValidator } from "@/lib/validators/category";
import { useCustomToast } from "@/hooks/use-custom-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import Image from "next/image";

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  billboards,
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Редактировать категорию" : "Создать категорию";
  const description = initialData
    ? "Отредактируйте существующую категорию"
    : "Добавьте новую категорию";
  const toastMessage = initialData
    ? "Категория была изменена"
    : "Категория была создана";
  const action = initialData ? "Сохранить изменения" : "Создать";

  const form = useForm<CategoryRequest>({
    defaultValues: initialData || {
      billboardId: "",
      name: "",
    },
    resolver: zodResolver(CategoryValidator),
  });

  const { isLoading: isChangeLoading, mutate: onSubmit } = useMutation({
    mutationFn: async ({ billboardId, name }: CategoryRequest) => {
      const payload: CategoryRequest = { billboardId, name };
      const { data } = initialData
        ? await axios.patch(
            `/api/${params.storeId}/categories/${params.categoryId}`,
            payload
          )
        : await axios.post(`/api/${params.storeId}/categories`, payload);
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
            title: "Вы не можете удалить эту категорию.",
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
      router.push(`/${params.storeId}/categories`);
      router.refresh();
    },
  });

  const { isLoading: isDeleteLoading, mutate: deleteStore } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          toast({
            description: "Введен неверный id билборда.",
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
            title: "Вы не можете удалить этот билборд.",
            variant: "destructive",
          });
          return;
        }
        toast({
          description:
            "Убедитесь, что вы удалили все товары, которые используют эту категорию.",
          title: "Произошла ошибка",
          variant: "destructive",
        });
        return;
      }
    },
    onSuccess: () => {
      toast({
        title: "Билборд был успешно удален",
      });
      router.push(`/${params.storeId}/categories`);
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isChangeLoading || isDeleteLoading}
                      placeholder="Название категории"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Билборд</FormLabel>
                  <Select
                    disabled={isChangeLoading || isDeleteLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Выберите билборд"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
