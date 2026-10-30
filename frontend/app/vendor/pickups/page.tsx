
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  Package,
  Plus,
  Search,
  Truck,
  X,
} from "lucide-react";

type PickupStatus = "Scheduled" | "Picked Up" | "Completed" | "Cancelled";

type Pickup = {
  id: string;
  date: string;
  time: string;
  address: string;
  packages: number;
  status: PickupStatus;
  contact: string;
  phone: string;
};

const initialPickups: Pickup[] = [
  {
    id: "PCK-1001",
    date: "2026-10-14",
    time: "09:00 AM - 11:00 AM",
    address: "Thamel, Kathmandu",
    packages: 8,
    status: "Scheduled",
    contact: "Ram Sharma",
    phone: "9800000001",
  },
  {
    id: "PCK-1002",
    date: "2026-10-14",
    time: "12:00 PM - 02:00 PM",
    address: "New Road, Kathmandu",
    packages: 5,
    status: "Picked Up",
    contact: "Sita Karki",
    phone: "9800000002",
  },
  {
    id: "PCK-1003",
    date: "2026-10-12",
    time: "10:00 AM - 12:00 PM",
    address: "Lalitpur, Nepal",
    packages: 12,
    status: "Completed",
    contact: "Hari Thapa",
    phone: "9800000003",
  },
  {
    id: "PCK-1004",
    date: "2026-10-11",
    time: "02:00 PM - 04:00 PM",
    address: "Bhaktapur, Nepal",
    packages: 3,
    status: "Cancelled",
    contact: "Maya Rai",
    phone: "9800000004",
  },
];

const statusStyles: Record<PickupStatus, string> = {
  Scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Picked Up": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function PickupsPage() {
  const [pickups, setPickups] = useState<Pickup[]>(initialPickups);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    date: "",
    time: "09:00 AM - 11:00 AM",
    address: "",
    packages: "1",
    contact: "",
    phone: "",
  });

  const filteredPickups = useMemo(() => {
    return pickups.filter((pickup) => {
      const matchesSearch = [
        pickup.id,
        pickup.address,
        pickup.contact,
        pickup.phone,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || pickup.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [pickups, search, statusFilter]);

  const scheduledCount = pickups.filter(
    (pickup) => pickup.status === "Scheduled",
  ).length;

  const pickedUpCount = pickups.filter(
    (pickup) => pickup.status === "Picked Up",
  ).length;

  const completedCount = pickups.filter(
    (pickup) => pickup.status === "Completed",
  ).length;

  function schedulePickup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newPickup: Pickup = {
      id: `PCK-${Date.now().toString().slice(-6)}`,
      date: form.date,
      time: form.time,
      address: form.address.trim(),
      packages: Number(form.packages),
      status: "Scheduled",
      contact: form.contact.trim(),
      phone: form.phone.trim(),
    };

    setPickups((current) => [newPickup, ...current]);
    setShowScheduleForm(false);
    setForm({
      date: "",
      time: "09:00 AM - 11:00 AM",
      address: "",
      packages: "1",
      contact: "",
      phone: "",
    });
    setNotice("Pickup scheduled successfully.");
  }

  function updatePickupStatus(id: string, status: PickupStatus) {
    setPickups((current) =>
      current.map((pickup) =>
        pickup.id === id ? { ...pickup, status } : pickup,
      ),
    );

    setSelectedPickup((current) =>
      current?.id === id ? { ...current, status } : current,
    );

    setNotice(`Pickup status updated to "${status}".`);
  }

  return (
    <main className="min-h-screen bg-app px-4 py-6 text-fg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/vendor/shipments"
              className="mb-3 inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
            >
              <ArrowLeft size={16} />
              Back to Shipments
            </Link>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Pickup Management
            </h1>
            <p className="mt-2 text-sm text-muted">
              Schedule pickups and track your parcel collection requests.
            </p>
          </div>

          <button
            onClick={() => {
              setNotice("");
              setShowScheduleForm(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-dark-1 transition hover:opacity-90"
          >
            <Plus size={18} />
            Schedule Pickup
          </button>
        </div>

        {notice && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <span>{notice}</span>
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Pickups"
            value={pickups.length}
            description="All pickup requests"
            icon={<Package size={20} />}
          />
          <StatCard
            title="Scheduled"
            value={scheduledCount}
            description="Waiting for collection"
            icon={<CalendarDays size={20} />}
          />
          <StatCard
            title="Picked Up"
            value={pickedUpCount}
            description="Collected by courier"
            icon={<Truck size={20} />}
          />
          <StatCard
            title="Completed"
            value={completedCount}
            description="Successfully completed"
            icon={<CheckCircle2 size={20} />}
          />
        </section>

        <section className="card overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-4 border-b border-hairline p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">Pickup Requests</h2>
              <p className="mt-1 text-sm text-muted">
                Manage your pickup schedule and collection status.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search pickups..."
                  className="w-full rounded-xl border border-hairline bg-panel py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-primary sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-hairline bg-panel px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="All">All statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Picked Up">Picked Up</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-panel text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-4 font-medium">Pickup ID</th>
                  <th className="px-5 py-4 font-medium">Pickup Date</th>
                  <th className="px-5 py-4 font-medium">Location</th>
                  <th className="px-5 py-4 font-medium">Packages</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-hairline">
                {filteredPickups.map((pickup) => (
                  <tr
                    key={pickup.id}
                    className="transition hover:bg-panel/60"
                  >
                    <td className="px-5 py-4 font-semibold text-primary">
                      {pickup.id}
                    </td>
                    <td className="px-5 py-4">
                      <p>{pickup.date}</p>
                      <p className="mt-1 text-xs text-muted">{pickup.time}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="shrink-0 text-muted" />
                        <span>{pickup.address}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">{pickup.packages}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[pickup.status]}`}
                      >
                        {pickup.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedPickup(pickup)}
                        className="inline-flex items-center gap-2 rounded-lg border border-hairline px-3 py-2 text-xs font-medium transition hover:border-primary hover:text-primary"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPickups.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-muted"
                    >
                      No pickup requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-hairline px-5 py-4 text-sm text-muted">
            Showing {filteredPickups.length} of {pickups.length} pickup requests
          </div>
        </section>
      </div>

      {showScheduleForm && (
        <Modal
          title="Schedule a Pickup"
          onClose={() => setShowScheduleForm(false)}
        >
          <form onSubmit={schedulePickup} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Pickup Date
              </label>
              <input
                required
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={(event) =>
                  setForm({ ...form, date: event.target.value })
                }
                className="w-full rounded-xl border border-hairline bg-panel px-3 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Time Slot
              </label>
              <select
                value={form.time}
                onChange={(event) =>
                  setForm({ ...form, time: event.target.value })
                }
                className="w-full rounded-xl border border-hairline bg-panel px-3 py-3 text-sm outline-none focus:border-primary"
              >
                <option>09:00 AM - 11:00 AM</option>
                <option>11:00 AM - 01:00 PM</option>
                <option>12:00 PM - 02:00 PM</option>
                <option>02:00 PM - 04:00 PM</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Pickup Address
              </label>
              <input
                required
                value={form.address}
                onChange={(event) =>
                  setForm({ ...form, address: event.target.value })
                }
                placeholder="Street, area, city"
                className="w-full rounded-xl border border-hairline bg-panel px-3 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Number of Packages
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  max="1000"
                  value={form.packages}
                  onChange={(event) =>
                    setForm({ ...form, packages: event.target.value })
                  }
                  className="w-full rounded-xl border border-hairline bg-panel px-3 py-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Contact Person
                </label>
                <input
                  required
                  value={form.contact}
                  onChange={(event) =>
                    setForm({ ...form, contact: event.target.value })
                  }
                  placeholder="Full name"
                  className="w-full rounded-xl border border-hairline bg-panel px-3 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Contact Phone
              </label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                placeholder="98XXXXXXXX"
                className="w-full rounded-xl border border-hairline bg-panel px-3 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="rounded-xl border border-hairline px-5 py-3 text-sm font-medium transition hover:bg-panel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-dark-1 transition hover:opacity-90"
              >
                Schedule Pickup
              </button>
            </div>
          </form>
        </Modal>
      )}

      {selectedPickup && (
        <Modal
          title="Pickup Details"
          onClose={() => setSelectedPickup(null)}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-hairline bg-panel p-4">
              <p className="text-xs text-muted">Pickup ID</p>
              <p className="mt-1 font-semibold text-primary">
                {selectedPickup.id}
              </p>
            </div>

            <Detail label="Contact Person" value={selectedPickup.contact} />
            <Detail label="Phone" value={selectedPickup.phone} />
            <Detail label="Address" value={selectedPickup.address} />
            <Detail label="Date" value={selectedPickup.date} />
            <Detail label="Time Slot" value={selectedPickup.time} />
            <Detail
              label="Packages"
              value={String(selectedPickup.packages)}
            />

            <div>
              <label className="mb-2 block text-sm font-medium">
                Update Status
              </label>
              <select
                value={selectedPickup.status}
                onChange={(event) =>
                  updatePickupStatus(
                    selectedPickup.id,
                    event.target.value as PickupStatus,
                  )
                }
                className="w-full rounded-xl border border-hairline bg-panel px-3 py-3 text-sm outline-none focus:border-primary"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Picked Up">Picked Up</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-3 text-3xl font-bold">{value}</p>
          <p className="mt-2 text-xs text-muted">{description}</p>
        </div>
        <div className="rounded-xl border border-hairline bg-panel p-3 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-hairline bg-app p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-muted transition hover:bg-panel hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-hairline pb-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}
