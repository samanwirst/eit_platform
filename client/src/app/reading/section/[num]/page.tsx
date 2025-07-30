const ReadingSectionPage = async ({ params }) => {
    const { num } = await params;

    return (
        <div>
            <h1>Reading Section {num}</h1>
        </div>
    );
}
export default ReadingSectionPage;