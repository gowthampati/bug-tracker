"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
type Comment = {
  id: number;
  body: string;
  author: string;
  created_at: string;
};

type ActivityLog = {
  id: number;
  action: string;
  actor: string;
  created_at: string;
};

type Bug = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string;
  reporter: string;
  created_at: string;
  updated_at: string;
  comments?: Comment[];
  activity_logs?: ActivityLog[];
};



export default function BugDetailPage() {
  const params = useParams();
  const [bug, setBug] =
    useState<Bug | null>(null);

  const fetchBug = async () => {
    const { data, error } =
      await supabase
        .from("bugs")
        .select(`
          *,
          comments (
            id,
            body,
            author,
            created_at
          ),
          activity_logs (
            id,
            action,
            actor,
            created_at
          )
        `)
        .eq("id", params.id)
        .single();

    if (error) {
      console.log(error);
      return;
    }

    setBug(data);
  };

  useEffect(() => {
    fetchBug();
  }, []);

  if (!bug) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">
        {bug.title}
      </h1>

      <p className="mt-4 text-gray-600">
        {bug.description}
      </p>

      <div className="mt-4 space-y-2 text-sm">
        <p>Status: {bug.status}</p>
        <p>Priority: {bug.priority}</p>
        <p>
          Assigned:{" "}
          {bug.assigned_to || "Unassigned"}
        </p>
        <p>
          Reporter: {bug.reporter}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">
          Comments
        </h2>

        <div className="space-y-3">
          {bug.comments?.map((comment) => (
            <div
              key={comment.id}
              className="rounded border p-3"
            >
              <p className="text-xs font-semibold">
                {comment.author}
              </p>

              <p>{comment.body}</p>

              <p className="text-xs text-gray-400">
                {new Date(
                  comment.created_at
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">
          Activity Log
        </h2>

        <div className="space-y-2">
          {bug.activity_logs?.map((log) => (
            <div
              key={log.id}
              className="text-sm text-gray-500"
            >
              • {log.actor}: {log.action}

              <span className="ml-2 text-xs">
                {new Date(
                  log.created_at
                ).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}