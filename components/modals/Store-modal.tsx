"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/Modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StoreValidator } from "@/lib/validators/store";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { toast } from "../../hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useState } from "react";

export type StoreRequest = z.infer<typeof StoreValidator>;

const StoreModal = () => {
  const storeModal = useStoreModal();
  const { loginToast } = useCustomToast();
  const [id, setId] = useState<number>();

  const form = useForm<StoreRequest>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(StoreValidator),
  });

  const { isLoading, mutate: createStore } = useMutation({
    mutationFn: async ({ name }: StoreRequest) => {
      const payload: StoreRequest = { name };

      const { data } = await axios.post("/api/stores/", payload);
      setId(data.id);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }

        if (err.response?.status === 409) {
          toast({
            description: "Введите другое название магазина.",
            title: "Имя магазина уже занято",
            variant: "destructive",
          });
          return;
        }

        toast({
          description: "Произошла ошибка. Попробуйте еще раз",
          title: "Неизвестная ошибка",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      toast({
        description: "Магазин успешно создан.",
      });
      window.location.assign(`/${id}`);
    },
  });

  return (
    <Modal
      title="Create store"
      description="Add a new store"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((e) => createStore(e))}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E-commerce"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  isLoading={isLoading}
                  variant="outline"
                  onClick={storeModal.onClose}
                >
                  Cancel
                </Button>
                <Button isLoading={isLoading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default StoreModal;
