import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", location: "", capacity: "", description: "" });

  useEffect(() => {
    fetch("/api/admin/users").then(res => res.json()).then(setUsers);
    fetch("/api/admin/bookings").then(res => res.json()).then(setBookings);
    fetch("/api/events").then(res => res.json()).then(setEvents);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    alert("Event created");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Create Event</h2>
        <form onSubmit={handleCreate}>
          <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
          <input type="date" onChange={e => setForm({ ...form, date: e.target.value })} />
          <input placeholder="Location" onChange={e => setForm({ ...form, location: e.target.value })} />
          <input type="number" placeholder="Capacity" onChange={e => setForm({ ...form, capacity: e.target.value })} />
          <textarea placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
          <button type="submit">Create</button>
        </form>
      </section>

      <section>
        <h2>All Events</h2>
        <ul>{events.map(e => <li key={e._id}>{e.title} — {new Date(e.date).toDateString()}</li>)}</ul>
      </section>

      <section>
        <h2>All Users</h2>
        <ul>{users.map(u => <li key={u._id}>{u.name} ({u.email})</li>)}</ul>
      </section>

      <section>
        <h2>All Bookings</h2>
        <ul>{bookings.map(b => (
          <li key={b._id}>
            {b.user?.name} booked {b.tickets} tickets for {b.event?.title}
          </li>
        ))}</ul>
      </section>
    </div>
  );
}

export default AdminDashboard;
