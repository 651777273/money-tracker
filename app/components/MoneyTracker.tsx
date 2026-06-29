"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type RecordType = "income" | "expense";

type MoneyRecord = {
  id: number;
  amount: number;
  type: RecordType;
  category: string;
  note: string | null;
  date: string;
};

const categories = ["餐饮", "交通", "购物", "住房", "工资", "投资", "娱乐", "其他"];

const currency = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY"
});

const today = new Date().toISOString().slice(0, 10);

export function MoneyTracker() {
  const [records, setRecords] = useState<MoneyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    type: "expense" as RecordType,
    category: "餐饮",
    note: "",
    date: today
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    setLoading(true);
    const response = await fetch("/api/records", { cache: "no-store" });
    const data = (await response.json()) as MoneyRecord[];
    setRecords(data);
    setLoading(false);
  }

  async function addRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const response = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (response.ok) {
      const created = (await response.json()) as MoneyRecord;
      setRecords((current) => [created, ...current]);
      setForm((current) => ({ ...current, amount: "", note: "" }));
    }

    setSaving(false);
  }

  async function deleteRecord(id: number) {
    const previous = records;
    setRecords((current) => current.filter((record) => record.id !== id));

    const response = await fetch(`/api/records/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setRecords(previous);
    }
  }

  const totals = useMemo(() => {
    return records.reduce(
      (summary, record) => {
        if (record.type === "income") {
          summary.income += record.amount;
        } else {
          summary.expense += record.amount;
        }
        summary.balance = summary.income - summary.expense;
        return summary;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [records]);

  const expenseChart = useMemo(() => {
    const byCategory = records
      .filter((record) => record.type === "expense")
      .reduce<Record<string, number>>((summary, record) => {
        summary[record.category] = (summary[record.category] ?? 0) + record.amount;
        return summary;
      }, {});

    return {
      labels: Object.keys(byCategory),
      datasets: [
        {
          data: Object.values(byCategory),
          backgroundColor: ["#df3f45", "#f59e0b", "#0f9f6e", "#3b82f6", "#8b5cf6", "#14b8a6", "#f97316", "#64748b"],
          borderWidth: 0
        }
      ]
    };
  }, [records]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-mint dark:text-emerald-300">个人财务追踪</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink dark:text-white sm:text-4xl">
            记账追踪
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setDarkMode((value) => !value)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          {darkMode ? "浅色模式" : "深色模式"}
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="总收入" value={currency.format(totals.income)} tone="income" />
        <StatCard label="总支出" value={currency.format(totals.expense)} tone="expense" />
        <StatCard label="余额" value={currency.format(totals.balance)} tone={totals.balance >= 0 ? "income" : "expense"} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
        <form
          onSubmit={addRecord}
          className="h-fit rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/85"
        >
          <h2 className="text-lg font-semibold text-ink dark:text-white">添加记录</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              类型
              <select
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value as RecordType })}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-mint focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-emerald-950"
              >
                <option value="expense">支出</option>
                <option value="income">收入</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              金额
              <input
                value={form.amount}
                onChange={(event) => setForm({ ...form, amount: event.target.value })}
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-mint focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-emerald-950"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              类别
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-mint focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-emerald-950"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              日期
              <input
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
                type="date"
                required
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-mint focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-emerald-950"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              备注
              <input
                value={form.note}
                onChange={(event) => setForm({ ...form, note: event.target.value })}
                placeholder="可选"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-mint focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-emerald-950"
              />
            </label>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
            >
              {saving ? "保存中..." : "添加记录"}
            </motion.button>
          </div>
        </form>

        <section className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-ink dark:text-white">收支记录</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">{records.length} 条</span>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="hidden grid-cols-[1fr_1fr_1fr_1.2fr_auto] bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 dark:bg-slate-950 dark:text-slate-300 md:grid">
              <span>日期</span>
              <span>类别</span>
              <span>金额</span>
              <span>备注</span>
              <span>操作</span>
            </div>

            <AnimatePresence initial={false}>
              {loading ? (
                <div className="p-6 text-sm text-slate-500 dark:text-slate-400">正在加载...</div>
              ) : records.length === 0 ? (
                <div className="p-6 text-sm text-slate-500 dark:text-slate-400">还没有记录，先添加一笔吧。</div>
              ) : (
                records.map((record) => (
                  <motion.div
                    key={record.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-2 border-t border-slate-200 px-4 py-4 transition hover:bg-emerald-50/70 dark:border-slate-800 dark:hover:bg-slate-800/80 md:grid-cols-[1fr_1fr_1fr_1.2fr_auto] md:items-center"
                  >
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {new Date(record.date).toLocaleDateString("zh-CN")}
                    </span>
                    <span className="text-sm font-medium text-ink dark:text-white">{record.category}</span>
                    <span className={`text-sm font-semibold ${record.type === "income" ? "text-mint dark:text-emerald-300" : "text-coral dark:text-rose-300"}`}>
                      {record.type === "income" ? "+" : "-"}
                      {currency.format(record.amount)}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{record.note || "无备注"}</span>
                    <button
                      type="button"
                      onClick={() => deleteRecord(record.id)}
                      className="w-fit rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-coral transition hover:-translate-y-0.5 hover:bg-rose-50 dark:border-rose-900/70 dark:text-rose-300 dark:hover:bg-rose-950/40"
                    >
                      删除
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </section>

      <section className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-ink dark:text-white">支出类别比例</h2>
        </div>
        <div className="mx-auto mt-4 h-72 max-w-xl">
          {expenseChart.labels.length > 0 ? (
            <Doughnut
              data={expenseChart}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: darkMode ? "#e2e8f0" : "#334155",
                      usePointStyle: true
                    }
                  }
                }
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              添加支出后会显示图表
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "income" | "expense";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/85"
    >
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-3 text-2xl font-semibold ${tone === "income" ? "text-mint dark:text-emerald-300" : "text-coral dark:text-rose-300"}`}>
        {value}
      </p>
    </motion.div>
  );
}
