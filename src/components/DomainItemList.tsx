import MarkdownView from "./MarkdownView";

interface DomainItemListProps {
    items: any[]
    currentTab: chrome.tabs.Tab
}
const DomainItemList = ({items, currentTab}: DomainItemListProps) => {
    console.log("=>(DomainItemList.tsx:3) items", items);
    return (
        <ul className="bg-white shadow max-h-full overflow-scroll">
            {
                items &&
                items.map((item, index) => {
                    return (
                        <li className={`${index === 0 ? '' : 'border-t border-gray-200'}`}>
                            <div className="px-4 py-5 sm:px-6">
                                <div className="flex flex-col w-full justify-between">
                                    <div className="flex justify-between">
                                        <h3 className={`text-lg leading-6 font-medium text-gray-900 line-clamp-1 ${
                                            currentTab.url === item.url
                                                ? 'text-white bg-blue-500 px-2 py-1 rounded'
                                                : 'text-gray-900'
                                        }`}>{item.title}</h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500 truncate line-clamp-1">{new URL(item.url).pathname}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <span></span>
                                        {
                                            currentTab.url !== item.url &&
                                            <a href={item.url} target="_blank" className="font-medium text-indigo-600 hover:text-indigo-500">move</a>
                                        }

                                    </div>
                                </div>
                                <div className="border-solid border-sky-200 max-h-[45px]">
                                    <MarkdownView markdown={item.data}/>
                                </div>
                            </div>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default DomainItemList;