import { useParams } from "next/navigation"
const WritingSectionAddPage = async ({ params }) => {
    const { num } = await params;
    
    return (
        <div>
        <h1>Add Writing Task {num}</h1>
        {/* Add your form or components here */}
        </div>
    );
}
export default WritingSectionAddPage;