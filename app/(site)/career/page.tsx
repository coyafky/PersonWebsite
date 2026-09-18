import { redirect } from "next/navigation";

export default function CareerRedirect() {
  // 新版 /about 已无 #career 锚点（求职材料改成折叠区），指到页面本身
  redirect("/about");
}