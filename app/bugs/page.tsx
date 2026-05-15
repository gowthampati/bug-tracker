"use client";


import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { allowedTransitions } from "@/lib/workflow";
type ActivityLog = {
  id: number;
  action: string;
  actor: string;
  created_at: string;
};
type Comment = {
  id: number;
  body: string;
  author: string;
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
  updated_at: string;
  comments?: Comment[];
  activity_logs?: ActivityLog[];
  
};

export default function BugsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [sortField, setSortField] =
  useState("created_at");

const [sortOrder, setSortOrder] =
  useState("desc");
  const [page, setPage] = useState(1);

const PAGE_SIZE = 5;
  const [commentText, setCommentText] = useState("");
  const [userEmail, setUserEmail] =
  useState("");
  const fetchBugs = async () => {
    let query = supabase
  .from("bugs")
  .select(`
  *,
  comments (
  id,
  body,
  author,
  created_at
)
    ,
activity_logs (
  id,
  action,
  actor,
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
if (filterStatus) {
  query = query.eq(
    "status",
    filterStatus
  );
}
const from = (page - 1) * PAGE_SIZE;

const to = from + PAGE_SIZE - 1;

const { data, error } = await query
  .order(sortField, {
    ascending: sortOrder === "asc",
  })
  .range(from, to);

    if (error) {
      console.log(error);
      return;
    }

    setBugs(data || []);
  };

 useEffect(() => {
    supabase.auth.getUser().then(
  ({ data }) => {
    setUserEmail(
      data.user?.email || ""
    );
  }
);
supabase.auth.getSession().then(
  ({ data }) => {
    if (!data.session) {
      window.location.href =
        "/login";
    }
  }
);
  fetchBugs();
}, [
  search,
  filterPriority,
  filterStatus,
  sortField,
  sortOrder,
  page,
]);
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
        assigned_to: assignedTo,
        reporter: userEmail,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setAssignedTo("");
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
await supabase
  .from("activity_logs")
  .insert([
    {
      bug_id: id,
      actor: userEmail,
      action: `Status changed to ${newStatus}`,
    },
  ]);
  fetchBugs();
};
const handleAssignBug = async (
  id: number,
  assignee: string
) => {
  const { error } = await supabase
    .from("bugs")
    .update({
      assigned_to: assignee,
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }
await supabase
  .from("activity_logs")
  .insert([
    {
      bug_id: id,
      actor: userEmail,
      action: `Assigned to ${assignee}`,
    },
  ]);
  fetchBugs();
};
const handleUpdateBug = async (
  id: number,
  field: string,
  value: string
) => {
  const { error } = await supabase
    .from("bugs")
    .update({
      [field]: value,
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await supabase
    .from("activity_logs")
    .insert([
      {
        bug_id: id,
        actor: userEmail,
        action: `${field} changed to ${value}`,
      },
    ]);

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
        author: userEmail,
      },
    ]);

  if (error) {
    alert(error.message);
    return;
  }

  setCommentText("");
  await supabase
  .from("activity_logs")
  .insert([
    {
      bug_id: bugId,
      actor: userEmail,
      action: "Comment added",
    },
  ]);
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

<select
  className="w-full border p-2"
  value={assignedTo}
  onChange={(e) =>
    setAssignedTo(e.target.value)
  }
>
  <option value="">
    Unassigned
  </option>

  <option value="rahul@gmail.com">
    rahul@gmail.com
  </option>

  <option value="priya@gmail.com">
    priya@gmail.com
  </option>

  <option value="arjun@gmail.com">
    arjun@gmail.com
  </option>

  <option value="sneha@gmail.com">
    sneha@gmail.com
  </option>
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
  <select
  className="border p-2"
  value={filterStatus}
  onChange={(e) =>
    setFilterStatus(e.target.value)
  }
>
  <option value="">
    All Statuses
  </option>

  <option value="Open">
    Open
  </option>

  <option value="In Progress">
    In Progress
  </option>

  <option value="Resolved">
    Resolved
  </option>

  <option value="Closed">
    Closed
  </option>
</select>
<select
  className="border p-2"
  value={sortField}
  onChange={(e) =>
    setSortField(e.target.value)
  }
>
  <option value="created_at">
    Created Date
  </option>

  <option value="updated_at">
    Updated Date
  </option>

  <option value="priority">
    Priority
  </option>
</select>

<select
  className="border p-2"
  value={sortOrder}
  onChange={(e) =>
    setSortOrder(e.target.value)
  }
>
  <option value="desc">
    Desc
  </option>

  <option value="asc">
    Asc
  </option>
</select>
</div>
      <div className="space-y-4">
        {bugs.map((bug) => (
          <div
            key={bug.id}
            className="rounded border p-4"
          >
            <p className="text-sm text-gray-400">
  Bug ID: {bug.id}
</p>
            <a
  href={`/bugs/${bug.id}`}
  className="text-xl font-semibold text-blue-600 underline"
>
  {bug.title}
</a>

            <textarea
  className="mt-2 w-full border p-2 text-gray-600"
  value={bug.description || ""}
  onChange={(e) =>
    handleUpdateBug(
      bug.id,
      "description",
      e.target.value
    )
  }
/>

<p className="text-sm text-gray-500">
  Reporter: {bug.reporter}
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

    <select
  className={`border p-1 font-semibold ${
    bug.priority === "Critical"
      ? "text-red-500"
      : bug.priority === "High"
      ? "text-orange-400"
      : bug.priority === "Medium"
      ? "text-yellow-400"
      : "text-green-400"
  }`}
  value={bug.priority}
  onChange={(e) =>
    handleUpdateBug(
      bug.id,
      "priority",
      e.target.value
    )
  }
>
  <option value="Low">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
  <option value="Critical">
    Critical
  </option>
</select>
    <div className="flex items-center gap-2">
  <span>Assigned:</span>

  <select
    className="border p-1 text-sm"
    value={bug.assigned_to || ""}
    onChange={(e) =>
      handleAssignBug(
        bug.id,
        e.target.value
      )
    }
  >
    <option value="">
      Unassigned
    </option>

    <option value="rahul@gmail.com">
  rahul@gmail.com
</option>

<option value="priya@gmail.com">
  priya@gmail.com
</option>

<option value="arjun@gmail.com">
  arjun@gmail.com
</option>

<option value="sneha@gmail.com">
  sneha@gmail.com
</option>
  </select>
</div>
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
      <p className="text-xs font-semibold">
  {comment.author}
</p>
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
<div className="mt-4 border-t pt-4">
  <h3 className="mb-2 font-semibold">
    Activity
  </h3>

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

          </div>
                ))}
      </div>

<div className="mt-6 flex gap-4">
  <button
    disabled={page === 1}
    onClick={() =>
      setPage(page - 1)
    }
    className="rounded border px-4 py-2"
  >
    Previous
  </button>

  <span>
    Page {page}
  </span>

  <button
    onClick={() =>
      setPage(page + 1)
    }
    className="rounded border px-4 py-2"
  >
    Next
  </button>
</div>
    </div>
  );
}