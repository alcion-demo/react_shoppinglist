import { Icon } from '@iconify/react';

type BottomNavProps = {
    activeTab: string;
    onTabChange: (tab: string) => void;
};

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
console.log('activeTab:', activeTab);
  return (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <div className="w-full max-w-md px-4 pointer-events-auto">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl shadow-blue-900/10 p-2 flex justify-around items-center">

                    <button
                        type="button"
                        onClick={() => onTabChange('list')}
                        className={`h-16 aspect-square flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                            activeTab === 'list'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        <Icon 
                            icon="icon-park-solid:shopping" 
                            className="text-2xl"
                        />
                        <span className="text-[10px] font-bold">リスト</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onTabChange('recipe')}
                        className={`h-16 aspect-square flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                            activeTab === 'recipe'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        <Icon 
                            icon="hugeicons:pot-02"
                            className="text-2xl"
                        />
                        <span className="text-[10px] font-bold">献立</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onTabChange('history')}
                        className={`h-16 aspect-square flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                            activeTab === 'history'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        <Icon 
                            icon="lucide:clock"
                            className="text-2xl"
                        />
                        <span className="text-[10px] font-bold">履歴</span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default BottomNav;