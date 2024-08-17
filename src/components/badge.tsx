
export function Badgesm({ color, text }: { color: string, text: string }) {
    return (<div className="w-12 font-pretendard text-white h-5 flex items-center justify-center text-xs rounded-2xl" style={{ backgroundColor: `${color}` }}>{text}</div>);
}


export function Badgelg({ color, text }: { color: string, text: string }) {
    return (<div className="w-20 font-pretendard text-white h-10 flex items-center justify-center text-base rounded-2xl" style={{ backgroundColor: `${color}` }}>{text}</div>);
}