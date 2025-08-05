'use client'
import { useParams } from "next/navigation"
import RichTextEditor from "@/components/Editor/RichTextEditor";
import InputDefault from "@/components/Inputs/InputDefault";
import DragAndDropUpload from "@/components/Inputs/DragAndDropUpload";

const WritingSectionAddPage = () => {
    const params = useParams();
    const num = params.num as string;

    const handleFiles = (files: File[]) => {
        console.log("Chosen files:", files);
    };

    return (
        <div>
            <h1>Add Writing Task {num}</h1>
            <div>
                <InputDefault name="title" type="text" placeholder="Title" customClasses="mb-4" />
                <RichTextEditor />
                <DragAndDropUpload
                    onFilesSelected={handleFiles}
                    multiple
                    maxFiles={5}
                    placeholder="Drag and drop the writing task image here"
                    className="mt-4"
                />
            </div>
        </div>
    );
}
export default WritingSectionAddPage;