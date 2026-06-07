import { describe, it, expect } from "vitest";
import {
  calculateDaysSince,
  formatDate,
  parseEventsToActivity,
  calculateCodingStreaks,
} from "./githubApi";

const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);

describe("calculateDaysSince", () => {
  it("returns 0/1 for now", () => {
    expect(calculateDaysSince(iso(new Date()))).toBeLessThanOrEqual(1);
  });

  it("returns ~10 for ten days ago", () => {
    const d = calculateDaysSince(iso(daysAgo(10)));
    expect(d).toBeGreaterThanOrEqual(10);
    expect(d).toBeLessThanOrEqual(11);
  });
});

describe("formatDate", () => {
  it("formats an ISO date into a readable label", () => {
    expect(formatDate("2024-01-15T00:00:00Z")).toMatch(/2024/);
  });
});

describe("parseEventsToActivity", () => {
  it("aggregates events by date and type", () => {
    const events = [
      { created_at: "2024-01-01T10:00:00Z", type: "PushEvent" },
      { created_at: "2024-01-01T12:00:00Z", type: "PushEvent" },
      { created_at: "2024-01-02T09:00:00Z", type: "WatchEvent" },
    ];
    const { activityByDate, eventTypes } = parseEventsToActivity(events);
    expect(activityByDate["2024-01-01"]).toBe(2);
    expect(activityByDate["2024-01-02"]).toBe(1);
    expect(eventTypes.PushEvent).toBe(2);
    expect(eventTypes.WatchEvent).toBe(1);
  });

  it("handles empty input", () => {
    const { activityByDate, eventTypes } = parseEventsToActivity([]);
    expect(activityByDate).toEqual({});
    expect(eventTypes).toEqual({});
  });
});

describe("calculateCodingStreaks", () => {
  it("returns zeros for no events", () => {
    expect(calculateCodingStreaks([])).toEqual({
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
    });
  });

  it("computes longest streak across consecutive days", () => {
    const events = [
      { created_at: iso(new Date("2024-01-01")) },
      { created_at: iso(new Date("2024-01-02")) },
      { created_at: iso(new Date("2024-01-03")) },
      { created_at: iso(new Date("2024-01-10")) },
    ];
    const { longestStreak, totalActiveDays } = calculateCodingStreaks(events);
    expect(longestStreak).toBe(3);
    expect(totalActiveDays).toBe(4);
  });

  it("tracks a current streak ending today", () => {
    const events = [
      { created_at: iso(daysAgo(2)) },
      { created_at: iso(daysAgo(1)) },
      { created_at: iso(daysAgo(0)) },
    ];
    const { currentStreak } = calculateCodingStreaks(events);
    expect(currentStreak).toBeGreaterThanOrEqual(2);
  });
});
