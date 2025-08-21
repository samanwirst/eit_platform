import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

const SubmissionPage = () => {
    return (
        <div className="container mx-auto p-4">
            <Breadcrumb pageName="Submission" />
            <h1 className="text-2xl font-bold mb-4">Submission</h1>
            <p className="text-gray-700">This is the submission page.</p>
        </div>
    )
}
export default SubmissionPage;