"use client";
import { useState } from "react";
import { Heading, Grid, Stack, Stat, Text } from "@lacspace/components";
import { LineChart } from "@lacspace/charts";
import { DataTable, textColumn, badgeColumn, currencyColumn, numberColumn } from "@lacspace/table";
import { DateRangePicker, defaultPresets } from "@lacspace/date";

// Swap these three arrays for your own data — nothing else needs to change.
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const REVENUE = [18, 21, 25, 24, 31, 38];
const TARGET = [20, 22, 24, 26, 28, 30];

type Account = {
  id: string;
  account: string;
  plan: string;
  seats: number;
  mrr: number;
};

const ACCOUNTS: Account[] = [
  { id: "1", account: "Northwind", plan: "team", seats: 42, mrr: 1890 },
  { id: "2", account: "Umbrella", plan: "pro", seats: 12, mrr: 540 },
  { id: "3", account: "Initech", plan: "team", seats: 68, mrr: 3060 },
  { id: "4", account: "Hooli", plan: "free", seats: 3, mrr: 0 },
  { id: "5", account: "Stark Industries", plan: "pro", seats: 19, mrr: 855 },
  { id: "6", account: "Wayne Enterprises", plan: "team", seats: 51, mrr: 2295 },
];

export default function InsightsPage() {
  const [range, setRange] = useState<unknown>(null);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Stack gap={5}>
        <Stack direction="row" justify="between" align="center" gap={3} wrap>
          <div>
            <Heading level={1}>Insights</Heading>
            <Text tone="muted">Charts, a data table and a date filter — all zero-dependency.</Text>
          </div>
          <DateRangePicker
            numberOfMonths={2}
            presets={defaultPresets()}
            separator=" – "
            onChange={setRange}
          />
        </Stack>

        <Grid columns={{ base: 1, md: 3 }} gap={3}>
          <Stat label="MRR" value="$8,640" delta={12.4} comparison="vs last month" />
          <Stat label="Seats" value="195" delta={6.1} comparison="vs last month" />
          <Stat label="Churn" value="1.8%" delta={-0.3} invertDelta comparison="vs last month" />
        </Grid>

        <LineChart
          labels={MONTHS}
          series={[
            { name: "Revenue", data: REVENUE, area: true },
            { name: "Target", data: TARGET, dashed: true },
          ]}
          curve
          dots
          tooltip
          responsive
          dataTable
          formatValue={(n) => "$" + n + "k"}
        />

        <DataTable<Account>
          caption="Accounts"
          data={ACCOUNTS}
          getRowId={(row) => row.id}
          columns={[
            textColumn<Account>("account", { header: "Account", key: "account", pinned: "left" }),
            badgeColumn<Account>("plan", {
              header: "Plan",
              key: "plan",
              tones: { team: "success", pro: "info", free: "default" },
            }),
            numberColumn<Account>("seats", { header: "Seats", key: "seats", aggregate: "sum" }),
            currencyColumn<Account>("mrr", { header: "MRR", key: "mrr", currency: "USD", aggregate: "sum" }),
          ]}
          defaultSort={[{ id: "mrr", direction: "desc" }]}
          searchable
          selectable
          exportable
          stickyHeader
        />
      </Stack>
    </main>
  );
}
