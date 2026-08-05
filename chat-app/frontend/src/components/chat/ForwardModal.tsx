import { useMemo, useState } from "react";

type Props = {
  chats: any[];
  onClose: () => void;
  onSend: (targets: any[]) => void;
};

export default function ForwardModal({
  chats,
  onClose,
  onSend,
}: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any[]>([]);

  const filteredChats = useMemo(() => {
    return chats.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, chats]);

  const toggleSelect = (chat: any) => {
    const exists = selected.find((x) => x.id === chat.id);

    if (exists) {
      setSelected(selected.filter((x) => x.id !== chat.id));
    } else {
      setSelected([...selected, chat]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white w-[420px] rounded-xl shadow-xl">

        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg">
            Forward Message
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-3">

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-2 mb-3"
          />

          <div className="max-h-80 overflow-y-auto">

            {filteredChats.map((chat) => {

              const checked = selected.some(
                (x) => x.id === chat.id
              );

              return (

                <div
                  key={chat.id}
                  onClick={() => toggleSelect(chat)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                >

                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                  />

                  <img
                    src={
                      chat.profileImage
                        ? `http://localhost:5000${chat.profileImage}`
                        : chat.avatar
                        ? `http://localhost:5000${chat.avatar}`
                        : "/user.png"
                    }
                    className="w-10 h-10 rounded-full"
                  />

                  <div>

                    <div className="font-medium">
                      {chat.name}
                    </div>

                    <div className="text-xs text-gray-500">
                      {chat.isGroup
                        ? "Group"
                        : "Contact"}
                    </div>

                  </div>

                </div>

              );
            })}
          </div>

        </div>

        <div className="border-t p-4 flex justify-end">

          <button
            onClick={() => onSend(selected)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Forward
          </button>

        </div>

      </div>

    </div>
  );
}