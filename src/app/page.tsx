import { redirect } from "next/navigation";

// The site opens directly on the login page — no landing/home page.
export default function Home() {
  redirect("/login");
}
