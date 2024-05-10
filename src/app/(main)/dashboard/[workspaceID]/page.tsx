export const dynamic = "force-dynamic";

//import QuillEditor from "@/components/quill-editor/quill-editor";
import { getWorkspaceDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import React from "react";

const Workspace = async ({ params }: { params: { workspaceId: string } }) => {
  
  return (
    <div className="relative">
      <h1>Workspaces</h1>
    </div>
  );
};

export default Workspace;
