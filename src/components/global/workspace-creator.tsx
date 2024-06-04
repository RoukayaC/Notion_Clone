'use client';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { User, workspace } from '@/lib/supabase/supabase.types';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectGroup } from '@radix-ui/react-select';
import { Lock, Plus, Share } from 'lucide-react';
import { Button } from '../ui/button';
import { v4 } from 'uuid';
import { addCollaborators, createWorkspace } from '@/lib/supabase/queries';
import CollaboratorSearch from './collaborator-search';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '../ui/use-toast';

// Array of users
const users = [
    {
        id: "1",
        fullname: "John Doe",
        avatarURL: "http://example.com/avatars/johndoe.jpg",
        billingAddress: { street: "123 Main St", city: "Anytown", country: "USA" },
        updatedAt: "2024-05-30T12:00:00Z",
        paymentMethod: { type: "credit card", last4: "1234" },
        email: "johndoe@example.com"
    },
    {
        id: "2",
        fullname: null,
        avatarURL: null,
        billingAddress: { street: "456 Oak St", city: "Othertown", country: "USA" },
        updatedAt: null,
        paymentMethod: { type: "paypal", email: "janedoe@paypal.com" },
        email: "janedoe@example.com"
    },
    {
        id: "3",
        fullname: "Alice Smith",
        avatarURL: "http://example.com/avatars/alicesmith.jpg",
        billingAddress: { street: "789 Pine St", city: "Thistown", country: "USA" },
        updatedAt: "2024-05-29T15:30:00Z",
        paymentMethod: { type: "bank transfer", accountNumber: "987654321" },
        email: null
    },
    {
        id: "4",
        fullname: "Bob Johnson",
        avatarURL: null,
        billingAddress: { street: "101 Maple St", city: "Yettown", country: "USA" },
        updatedAt: "2024-05-28T08:45:00Z",
        paymentMethod: { type: "credit card", last4: "5678" },
        email: "bobjohnson@example.com"
    },
    {
        id: "5",
        fullname: "Carol White",
        avatarURL: "http://example.com/avatars/carolwhite.jpg",
        billingAddress: { street: "202 Birch St", city: "Newtown", country: "USA" },
        updatedAt: "2024-05-27T19:20:00Z",
        paymentMethod: { type: "apple pay", device: "iPhone 12" },
        email: "carolwhite@example.com"
    }
];

const WorkspaceCreator = () => {
  const { user } = useSupabaseUser();
  const { toast } = useToast();
  const router = useRouter();
  const [permissions, setPermissions] = useState('private');
  const [title, setTitle] = useState('');
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addCollaborator = (user: User) => {
    setCollaborators([...collaborators, user]);
  };

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((c) => c.id !== user.id));
  };

  const createItem = async () => {
    setIsLoading(true);
    const uuid = v4();
    if (user?.id) {
      const newWorkspace: workspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: '💼',
        id: uuid,
        inTrash: '',
        title,
        workspaceOwner: user.id,
        logo: null,
        bannerUrl: '',
      };
      if (permissions === 'private') {
        toast({ title: 'Success', description: 'Created the workspace' });
        await createWorkspace(newWorkspace);
        router.refresh();
      }
      if (permissions === 'shared') {
        toast({ title: 'Success', description: 'Created the workspace' });
        await createWorkspace(newWorkspace);
        await addCollaborators(collaborators, uuid);
        router.refresh();
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-4 flex-col">
      <div>
        <Label
          htmlFor="name"
          className="text-sm text-muted-foreground"
        >
          Name
        </Label>
        <div
          className="flex 
        justify-center 
        items-center 
        gap-2
        "
        >
          <Input
            name="name"
            value={title}
            placeholder="Workspace Name"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
      </div>
      <>
        <Label
          htmlFor="permissions"
          className="text-sm
          text-muted-foreground"
        >
          Permission
        </Label>
        <Select
          onValueChange={(val) => {
            setPermissions(val);
          }}
          defaultValue={permissions}
        >
          <SelectTrigger className="w-full h-26 -mt-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="private">
                <div
                  className="p-2
                  flex
                  gap-4
                  justify-center
                  items-center
                "
                >
                  <Lock />
                  <article className="text-left flex flex-col">
                    <span>Private</span>
                    <p>
                      Your workspace is private to you. You can choose to share
                      it later.
                    </p>
                  </article>
                </div>
              </SelectItem>
              <SelectItem value="shared">
                <div className="p-2 flex gap-4 justify-center items-center">
                  <Share></Share>
                  <article className="text-left flex flex-col">
                    <span>Shared</span>
                    <span>You can invite collaborators.</span>
                  </article>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </>
      {permissions === 'shared' && (
        <div>
          <CollaboratorSearch
            existingCollaborators={collaborators}
            getCollaborator={(user) => {
              addCollaborator(user);
            }}
          >
            <Button
              type="button"
              className="text-sm mt-4"
            >
              <Plus />
              Add Collaborators
            </Button>
          </CollaboratorSearch>
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">
              Collaborators {collaborators.length || ''}
            </span>
            <ScrollArea
              className="
            h-[120px]
            overflow-y-scroll
            w-full
            rounded-md
            border
            border-muted-foreground/20"
            >
              {collaborators.length ? (
                collaborators.map((c) => (
                  <div
                    className="p-4 flex
                      justify-between
                      items-center
                "
                    key={c.id}
                  >
                    <div className="flex gap-4 items-center">
                      <Avatar>
                        <AvatarImage src="/avatars/7.png" />
                        <AvatarFallback>PJ</AvatarFallback>
                      </Avatar>
                      <div
                        className="text-sm 
                          gap-2
                          text-muted-foreground
                          overflow-hidden
                          overflow-ellipsis
                          sm:w-[300px]
                          w-[140px]
                        "
                      >
                        {c.email}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => removeCollaborator(c)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <div
                  className="absolute
                  right-0 left-0
                  top-0
                  bottom-0
                  flex
                  justify-center
                  items-center
                "
                >
                  <span className="text-muted-foreground text-sm">
                    You have no collaborators
                  </span>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}
      <Button
        type="button"
        disabled={
          !title ||
          (permissions === 'shared' && collaborators.length === 0) ||
          isLoading
        }
        variant={'secondary'}
        onClick={createItem}
      >
        Create
      </Button>
    </div>
  );
};

export default WorkspaceCreator;
