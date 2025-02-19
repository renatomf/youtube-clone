import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

import { UseSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";

import { VideoGetOneOutput } from "../../types";

interface VideoOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId: clerUserId, isLoaded } = useAuth();
  const { isPending, onClick } = UseSubscription({
    userId: user.id,
    IsSubscribed: user.viewerSubscribed,
    fromVideoId: videoId,
  });

  return ( 
    <div className="flex items-center sm:items-start justify-between sm:justify-normal gap-3 min-w-0">
      <Link href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
          <div className="flex flex-col gap-1 min-w-0">
            <UserInfo size="lg" name={user.name} />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {/* TODO: properly fill subscriber count */}
              {user.subscriberCount} subscribers
            </span>
          </div>
        </div>
      </Link>
      {clerUserId === user.clerkId ? (
        <Button
          variant="secondary"
          className="rounded-full"
          asChild
        >
          <Link href={`/studio/videos/${videoId}`}>
            Edit video
          </Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={onClick}
          disabled={isPending || !isLoaded}
          isSubscribed={user.viewerSubscribed}
          className="flex-none"
        />
      )}
    </div>
   );
}
