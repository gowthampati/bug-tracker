"use client";


import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { allowedTransitions } from "@/lib/workflow";

type Comment = {
  id: number;
  body: string;
  created_at: string;
};
type Bug = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  updated_at: string;
  comments?: Comment[];
};

export default function BugsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [commentText, setCommentText] = useState("");
  const fetchBugs = async () => {
    let query = supabase
  .from("bugs")
  .select(`
  *,
  comments (
    id,
    body,
    created_at
  )
`);

if (search.trim()) {
  query = query.ilike(
    "title",
    `%${search}%`
  );
}
if (filterPriority) {
  query = query.eq(
    "priority",
    filterPriority
  );
}
const { data, error } = await query.order(
  "created_at",
  { ascending: false }
);

    if (error) {
      console.log(error);
      return;
    }

    setBugs(data || []);
  };

 useEffect(() => {
  fetchBugs();
}, [search, filterPriority]);
  const handleCreateBug = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const { error } = await supabase.from("bugs").insert([
      {
        title,
        description,
        priority,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setDescription("");
    setPriority("Medium");
    fetchBugs();
  };
const handleDeleteBug = async (id: number) => {
  const { error } = await supabase
    .from("bugs")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  fetchBugs();
};
const handleStatusChange = async (
  id: number,
  newStatus: string
) => {
  const { error } = await supabase
    .from("bugs")
    .update({
      status: newStatus,
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  fetchBugs();
};
const handleLogout = async () => {
  await supabase.auth.signOut();

  window.location.href = "/login";
};

const handleAddComment = async (
  bugId: number
) => {
  if (!commentText.trim()) {
    alert("Comment cannot be empty");
    return;
  }

  const { error } = await supabase
    .from("comments")
    .insert([
      {
        bug_id: bugId,
        body: commentText,
      },
    ]);

  if (error) {
    alert(error.message);
    return;
  }

  setCommentText("");

  fetchBugs();
};
  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
  <h1 className="text-3xl font-bold">
    Bug Tracker Dashboard
  </h1>

  <button
    onClick={handleLogout}
    className="rounded bg-black px-4 py-2 text-white"
  >
    Logout
  </button>
</div>

      <div className="mb-8 space-y-4 border p-4 rounded">
        <h2 className="text-xl font-semibold">Create Bug</h2>

        <input
          className="w-full border p-2"
          placeholder="Bug title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2"
          placeholder="Bug description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
  className="w-full border p-2"
  value={priority}
  onChange={(e) => setPriority(e.target.value)}
>
  <option>Low</option>
  <option>Medium</option>
  <option>High</option>
  <option>Critical</option>
</select>
        <button
          onClick={handleCreateBug}
          className="bg-black px-4 py-2 text-white"
        >
          Create Bug
        </button>
      </div>
     <div className="mb-6 flex gap-4">
  <input
    className="w-full border p-2"
    placeholder="Search bugs by title..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    className="border p-2"
    value={filterPriority}
    onChange={(e) =>
      setFilterPriority(e.target.value)
    }
  >
    <option value="">All Priorities</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
    <option value="Critical">Critical</option>
  </select>
</div>
      <div className="space-y-4">
        {bugs.map((bug) => (
          <div
            key={bug.id}
            className="rounded border p-4"
          >
            <h2 className="text-xl font-semibold">
              {bug.title}
            </h2>

            <p className="mt-2 text-gray-600">
              {bug.description}
            </p>
            <p className="mt-2 text-sm text-gray-400">
  Last updated:{" "}
  {new Date(
    bug.updated_at
  ).toLocaleString()}
</p>

            <div className="mt-4 flex items-center justify-between">
  <div className="flex gap-4 text-sm">
    <div className="flex items-center gap-2">
  <span>Status:</span>

  <select
    className="border p-1"
    value={bug.status}
    onChange={(e) =>
      handleStatusChange(bug.id, e.target.value)
    }
  >
    <option value={bug.status}>
      {bug.status}
    </option>

    {allowedTransitions[bug.status]?.map((status) => (
      <option
        key={status}
        value={status}
      >
        {status}
      </option>
    ))}
  </select>
</div>

    <span
      className={`font-semibold ${
        bug.priority === "Critical"
          ? "text-red-500"
          : bug.priority === "High"
          ? "text-orange-400"
          : bug.priority === "Medium"
          ? "text-yellow-400"
          : "text-green-400"
      }`}
    >
      Priority: {bug.priority}
    </span>
  </div>

  <button
    onClick={() => handleDeleteBug(bug.id)}
    className="rounded bg-red-600 px-3 py-1 text-sm text-white"
  >
    Delete
  </button>
  
</div>

<div className="mt-4 border-t pt-4">
  <h3 className="mb-2 font-semibold">
    Comments
  </h3>

  <div className="space-y-2">
    {bug.comments?.map((comment) => (
      <div
        key={comment.id}
        className="rounded border p-2 text-sm"
      >
        <p>{comment.body}</p>

        <p className="mt-1 text-xs text-gray-400">
          {new Date(
            comment.created_at
          ).toLocaleString()}
        </p>
      </div>
    ))}
  </div>

  <div className="mt-3 flex gap-2">
    <input
      className="w-full border p-2"
      placeholder="Add comment..."
      value={commentText}
      onChange={(e) =>
        setCommentText(e.target.value)
      }
    />

    <button
      onClick={() =>
        handleAddComment(bug.id)
      }
      className="rounded bg-black px-3 py-2 text-white"
    >
      Add
    </button>
  </div>
</div>

          </div>
        ))}
      </div>
    </div>
  );
}