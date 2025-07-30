const WritingSectionPage = async ({ params }) => {
    const { num } = await params;

    return (
        <div>
            <h1>Writing Task {num}</h1>
        </div>
    );
}
export default WritingSectionPage;