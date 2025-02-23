"use client";
import React, { useState } from "react";
import {
  Calendar,
  Tag,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import CountUp from "react-countup";
import { AreaChart, Card, Title, Text } from "@tremor/react";

type NavItem = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

const chartdata = [
  { date: "2024-01", Revenue: 2890, Bookings: 45 },
  { date: "2024-02", Revenue: 3250, Bookings: 52 },
  { date: "2024-03", Revenue: 3820, Bookings: 61 },
];

function DashboardPages() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, John's Barbershop! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your business today.
          </p>
        </div>
        <button className="neon-button">+ Create Promotion</button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: <DollarSign className="w-6 h-6 text-green-500" />,
            label: "Today's Revenue",
            value: 890,
            trend: "+12.5%",
            prefix: "$",
          },
          {
            icon: <Users className="w-6 h-6 text-blue-500" />,
            label: "Total Customers",
            value: 245,
            trend: "+8.1%",
          },
          {
            icon: <Clock className="w-6 h-6 text-purple-500" />,
            label: "Appointments Today",
            value: 12,
            trend: "+2.3%",
          },
          {
            icon: <TrendingUp className="w-6 h-6 text-accent" />,
            label: "Conversion Rate",
            value: 64.5,
            trend: "+5.7%",
            suffix: "%",
          },
        ].map((stat, index) => (
          <div key={index} className="dashboard-card">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/5">{stat.icon}</div>
              <span className="text-green-500 text-sm font-medium">
                {stat.trend}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="stats-value">
              {stat.prefix}
              <CountUp
                end={stat.value}
                decimals={stat.value % 1 !== 0 ? 1 : 0}
                duration={2}
              />
              {stat.suffix}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border rounded-lg">
          <Title className="text-white mb-4">Revenue & Bookings Overview</Title>
          <AreaChart
            className="h-72 mt-4"
            data={chartdata}
            index="date"
            categories={["Revenue", "Bookings"]}
            colors={["yellow", "cyan"]}
            valueFormatter={(number) =>
              `${Intl.NumberFormat("us").format(number).toString()}`
            }
          />
        </Card>

        <Card className="bg-white/5 border rounded-lg">
          <Title className="text-white mb-4">Popular Services</Title>
          <div className="space-y-4">
            {[
              { name: "Classic Haircut", value: 35, color: "bg-accent" },
              { name: "Beard Trim", value: 28, color: "bg-cyan-500" },
              { name: "Hair Color", value: 20, color: "bg-purple-500" },
              { name: "Facial", value: 17, color: "bg-pink-500" },
            ].map((service, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-200">{service.name}</span>
                  <span className="text-gray-400">{service.value}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full">
                  <div
                    className={`h-full ${service.color} rounded-full`}
                    style={{ width: `${service.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/5 border ">
        <Title className="text-white mb-4">Recent Activity</Title>
        <div className="space-y-4">
          {[
            {
              title: "New Appointment",
              description: "John Doe booked a Classic Haircut",
              time: "10 minutes ago",
              icon: <Calendar className="w-4 h-4 text-blue-500" />,
            },
            {
              title: "Promotion Created",
              description: "20% off on all services this weekend",
              time: "1 hour ago",
              icon: <Tag className="w-4 h-4 text-accent" />,
            },
            {
              title: "New Review",
              description: "⭐⭐⭐⭐⭐ Great service and atmosphere!",
              time: "2 hours ago",
              icon: <Star className="w-4 h-4 text-yellow-500" />,
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg bg-white/5"
            >
              <div className="p-2 rounded-lg bg-white/5">{activity.icon}</div>
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-400">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default DashboardPages;
