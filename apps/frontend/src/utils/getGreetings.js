import { getCurrentSessionData } from "@/services/authService";

var myDate = new Date();
var hrs = myDate.getHours();

export default function greetings() {
  if (hrs < 12) return `Good morning `;
  else if (hrs >= 12 && hrs <= 17) return `Good afternoon `;
  else if (hrs >= 17 && hrs <= 24) return `Good evening `;
}
