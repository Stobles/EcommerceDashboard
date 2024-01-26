import { FC } from "react";
import { Heading } from "./ui/Heading";
import { Button } from "./ui/Button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardHeadingProps {
  title: string;
  description: string;
  redirectTo?: string;
  isEdit?: boolean;
}

const DashboardHeading: FC<DashboardHeadingProps> = ({
  description,
  isEdit = true,
  redirectTo = "",
  title,
}) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between gap-2">
      <Heading title={title} description={description} />
      {isEdit ? (
        <Button onClick={() => router.push(redirectTo)}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      ) : null}
    </div>
  );
};

export default DashboardHeading;
