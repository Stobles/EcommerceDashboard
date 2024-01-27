"use client";

import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Store } from "@prisma/client";
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
import { ApiAlert } from "@/components/ui/ApiAlert";
import { useMutation } from "react-query";
import { toast } from "@/hooks/use-toast";
import { SettingsRequest, SettingsValidator } from "@/lib/validators/settings";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);

  const form = useForm<SettingsRequest>({
    defaultValues: initialData,
    resolver: zodResolver(SettingsValidator),
  });

  const { isLoading: isChangeLoading, mutate: changeSettings } = useMutation({
    mutationFn: async ({ name }: SettingsRequest) => {
      const payload: SettingsRequest = { name };
      const { data } = await axios.patch(
        `/api/stores/${params.storeId}`,
        payload
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          toast({
            description: "Такое название уже используется",
            title: "Неправильное название",
            variant: "destructive",
          });
          return;
        }

        if (err.response?.status === 401) {
          toast({
            description: "Авторизуйтесь, чтобы изменить название.",
            title: "Авторизуйтесь",
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
        title: "Имя успешно изменено",
      });
      router.refresh();
    },
  });

  const { isLoading: isDeleteLoading, mutate: deleteStore } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/stores/${params.storeId}`);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast({
          description: "Непредвиденная ошибка. Попробуйте еще раз",
          title: "Произошла ошибка",
          variant: "destructive",
        });
        return;
      }

      toast({
        description: "Непредвиденная ошибка. Попробуйте еще раз",
        title: "Произошла ошибка",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Магазин был успешно удален",
      });
      router.refresh();
      setOpen(false);
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
        <Heading
          title="Настройки магазина"
          description="Управляйте настройками своего магазина"
        />
        <Button
          disabled={isChangeLoading || isDeleteLoading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((e) => changeSettings(e))}
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
                      placeholder="Название магазина"
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
            Сохранить изменения
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        variant="public"
        description={`${origin}/api/stores/${params.storeId}`}
      />
    </>
  );
};
