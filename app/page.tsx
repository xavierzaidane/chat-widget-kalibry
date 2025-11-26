import { ChatWidget } from "./components/ChatWidget";


export default function WidgetTest() {
  return (
    <div className="flex justify-center items-center p-10 space-y-5">
      <h2 className="font-semibold">Chat widget preview</h2>
      <ChatWidget />
    </div>
  );
}
