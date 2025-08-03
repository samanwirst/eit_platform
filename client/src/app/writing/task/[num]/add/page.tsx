'use client'
import { useParams } from "next/navigation"
import RichTextEditor from "@/components/Editor/RichTextEditor";

const WritingSectionAddPage = () => {
    const params = useParams();
    const num = params.num as string;

    return (
        <div>
            <h1>Add Writing Task {num}</h1>
            <RichTextEditor />
        </div>
    );
}
export default WritingSectionAddPage;