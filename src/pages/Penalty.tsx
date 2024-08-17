import Banner from "../components/layout/banner";
import PenaltyTable from "../components/rank/PenaltyTable.tsx";
export default function Penalty() {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Banner text="벌금 현황" />
            <PenaltyTable />
        </div>
    );
}