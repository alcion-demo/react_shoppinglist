import { useState } from 'react';

type PurchaseHistory = {
  id: number;
  purchased_at: string;
  price: number | null;
  quantity: string | null;
  shop_type: number;
  item: {
    id: number;
    name: string;
  };
};

type HistorySectionProps = {
  history: Record<string, PurchaseHistory[]>;
};

const HistorySection = ({ history }: HistorySectionProps) => {
  const [search, setSearch] = useState('');
  const [openHistory, setOpenHistory] = useState<Record<string, boolean>>({});

  const toggleHistory = (date: string) => {
    setOpenHistory((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const filteredHistory = Object.entries(history).map(([date, logs]) => {
    const filteredLogs = logs.filter((log) =>
      log.item.name.toLowerCase().includes(search.toLowerCase())
    );

    return [date, filteredLogs] as [string, PurchaseHistory[]];
  }).filter(([, logs]) => logs.length > 0);

  return (
    <section className="space-y-4">

      {/* 検索 */}
      <div className="relative group px-4 py-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="アイテム名で検索..."
          className="w-full pl-11 pr-24 py-3 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          {search !== '' ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
            >
              クリア
            </button>
          ) : (
            <button
              type="button"
              className="px-4 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-xl active:scale-95 transition-all shadow-md shadow-blue-500/20"
            >
              検索
            </button>
          )}
        </div>
      </div>

      {/* 履歴 */}
      <div className="space-y-2 px-4">

        {filteredHistory.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-8">
            該当する履歴はありません
          </p>
        ) : (
          filteredHistory.map(([date, logs]) => (
            <div
              key={date}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700/50 overflow-hidden"
            >
              {/* 日付 */}
              <button
                type="button"
                onClick={() => toggleHistory(date)}
                className="w-full flex flex-col p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {date}
                  </span>

                  <span className="text-gray-400 text-xs">
                    {openHistory[date] ? '▲' : '▼'}
                  </span>
                </div>

                <div className="text-[11px] text-gray-500 truncate pr-4">
                  {logs
                    .slice(0, 3)
                    .map((log) => log.item.name)
                    .join('、')}

                  {logs.length > 3 && ' ...'}
                </div>
              </button>

              {/* 中身 */}
              {openHistory[date] && (
                <div className="border-t dark:border-gray-700 dark:text-white bg-gray-50 dark:bg-gray-900/50">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex justify-between items-center p-4 border-b last:border-none dark:border-gray-700/50"
                    >

                      <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-medium">
                          {log.item.name}
                        </span>

                        <span className="text-[10px] text-gray-400">
                          {log.price && log.price > 0 &&
                            `¥${log.price.toLocaleString()}`
                          }

                          {log.quantity &&
                            ` / ${log.quantity}`
                          }
                        </span>
                      </div>

                      <button
                        type="button"
                        className="text-xs text-blue-500 font-bold px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full"
                      >
                        ＋再追加
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

      </div>
    </section>
  );
};

export default HistorySection;