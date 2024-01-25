"use client";

import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { AlertModal } from "@/components/modals/Alert-modal";

import { ProductColumn } from "./columns";
import { useMutation } from "react-query";

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const { mutate: onConfirm, isLoading: isConfirmLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          toast({
            title: "Неправильное название",
            description: "Такое название уже используется",
            variant: "destructive",
          });
          return;
        }

        if (err.response?.status === 401) {
          toast({
            title: "Авторизуйтесь",
            description: "Авторизуйтесь, чтобы изменить название.",
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
        title: "Имя успешно изменено",
      });
      router.refresh();
    },
  });

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Текст успешно скопирован.",
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        isLoading={isConfirmLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/products/${data.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
