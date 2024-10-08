import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";

const Menu = dynamic(() => import("@/components/TabMenu"), {
  ssr: false,
})
const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

export default async function Page() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    throw new Error();
  }

  return (
    <div className="px-4 py-2 flex items-center bg-card">
      <Menu accessToken={accessToken} />

      {/* Pulling Chat to experiment with nesting the component within a new Menu
      <div className={"grow flex flex-col"}>
        <Chat accessToken={accessToken} />
      </div>
      */}

    </div>
  );
}
