import { Calendar, BarChart3, Users, Gift } from "lucide-react";

export const menuItems = [
  { id: "dashboard", icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { id: "booking", icon: Calendar, label: "Bookings", href: "/booking" },
  { id: "clients", icon: Users, label: "Clients", href: "/clients" },
  { id: "promotions", icon: Gift, label: "Promotions", href: "/promotions" },
];
