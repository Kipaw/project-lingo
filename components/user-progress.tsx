import Link from "next/link";
import Image from "next/image";
import { InfinityIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  activeCourse: { imageSrc: string; title: string }; // TODO: ganti ke tipe DB
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const UserProgress = ({
  activeCourse,
  points,
  hearts,
  hasActiveSubscription,
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <Button
        variant="ghost"
        nativeButton={false}
        render={<Link href="/courses" />}
      >
        <Image
          src={activeCourse.imageSrc}
          alt={activeCourse.title}
          className="rounded-md border"
          width={32}
          height={32}
        />
      </Button>

      <Button
        variant="ghost"
        className="text-orange-500"
        nativeButton={false}
        render={<Link href="/shop" />}
      >
        <Image
          src="/points.svg"
          height={28}
          width={28}
          alt="Points"
          className="mr-2"
        />
        {points}
      </Button>

      <Button
        variant="ghost"
        className="text-rose-500"
        nativeButton={false}
        render={<Link href="/shop" />}
      >
        <Image
          src="/heart.svg"
          height={22}
          width={22}
          alt="Hearts"
          className="mr-2"
        />
        {hasActiveSubscription ? (
          <InfinityIcon className="h-4 w-4 stroke-[3]" />
        ) : (
          hearts
        )}
      </Button>
    </div>
  );
};
